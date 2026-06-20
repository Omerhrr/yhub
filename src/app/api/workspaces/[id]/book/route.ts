import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTicketId, buildTicketEmail } from "@/lib/ticket";
import { sendEmail } from "@/lib/email";
import { verifyPaystackPayment } from "@/lib/paystack";
import { DEFAULT_CONFIG } from "@/lib/slots";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { date, startTime, endTime, bookingType, name, email, phone, reason, paystackRef } =
    body as Record<string, string>;

  if (!date || !name || !email || !phone || !reason)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  // Length guards
  if (name.length > 120)   return NextResponse.json({ error: "Name too long" },   { status: 400 });
  if (phone.length > 30)   return NextResponse.json({ error: "Phone too long" },  { status: 400 });
  if (reason.length > 300) return NextResponse.json({ error: "Reason too long" }, { status: 400 });

  if (!isValidEmail(email))
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });

  if (!["daily", "hourly"].includes(bookingType))
    return NextResponse.json({ error: "Invalid booking type" }, { status: 400 });

  const TIME_RE = /^\d{2}:\d{2}$/;
  if (bookingType === "hourly" && (!startTime || !endTime || !TIME_RE.test(startTime) || !TIME_RE.test(endTime)))
    return NextResponse.json({ error: "Invalid or missing time range" }, { status: 400 });

  if (bookingType === "hourly" && startTime >= endTime)
    return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 });

  const bookingId = crypto.randomUUID();
  const ticketId  = generateTicketId("WS");

  try {
    const ws = await db.workspace.findUnique({ where: { id } });
    if (!ws) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    // ── Server-side amount calculation (never trust client) ───────────────
    let amount = 0;
    if (bookingType === "daily") {
      amount = ws.dailyRate ?? 0;
    } else {
      // Calculate slot count from server's own config
      const cfgRows = await db.$queryRaw<Record<string, unknown>[]>`
        SELECT slotDuration FROM workspace_availability WHERE workspaceId = ${id}
      `.catch(() => []);
      const slotDuration = cfgRows.length
        ? Number(cfgRows[0].slotDuration)
        : DEFAULT_CONFIG.slotDuration;

      if (startTime && endTime) {
        const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
        const slotCount = Math.floor((toMin(endTime) - toMin(startTime)) / slotDuration);
        amount = Math.max(0, slotCount) * (ws.hourlyRate ?? 0);
      }
    }

    // ── Paystack verification (if paid) ──────────────────────────────────
    if (amount > 0) {
      if (!paystackRef)
        return NextResponse.json({ error: "Payment reference required" }, { status: 400 });
      const verified = await verifyPaystackPayment(paystackRef, amount);
      if (!verified)
        return NextResponse.json({ error: "Payment could not be verified. Contact support." }, { status: 402 });
    }

    // ── Double-booking check ──────────────────────────────────────────────
    if (bookingType !== "daily" && startTime && endTime) {
      const existing = await db.$queryRaw<{ startTime: string; endTime: string }[]>`
        SELECT startTime, endTime FROM workspace_bookings
        WHERE workspaceId = ${id} AND date = ${date}
      `.catch(() => [] as { startTime: string; endTime: string }[]);

      const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
      const newS = toMin(startTime), newE = toMin(endTime);
      const overlap = existing.some(b => {
        const bS = toMin(b.startTime), bE = toMin(b.endTime);
        return !(newE <= bS || newS >= bE);
      });
      if (overlap)
        return NextResponse.json({ error: "This time slot is no longer available" }, { status: 409 });
    }

    const createdAt = new Date().toISOString();
    await db.$executeRaw`
      INSERT INTO workspace_bookings
        (id, workspaceId, ticketId, date, startTime, endTime, type, name, email, phone, notes, amount, status, createdAt)
      VALUES
        (${bookingId}, ${id}, ${ticketId}, ${date},
         ${startTime ?? "09:00"}, ${endTime ?? "20:00"},
         ${bookingType ?? "hourly"}, ${name}, ${email}, ${phone}, ${reason}, ${amount}, 'confirmed', ${createdAt})
    `;

    const timeLabel = bookingType === "daily"
      ? "Full day (09:00 – 20:00)"
      : `${startTime ?? "09:00"} – ${endTime ?? "20:00"}`;

    sendEmail({
      to:      email,
      subject: `✅ Booking Confirmed — ${ws.name} · ${ticketId}`,
      html:    buildTicketEmail({
        ticketId,
        type:       "workspace",
        typeLabel:  "Workspace Booking",
        holderName: name,
        email,
        phone,
        title:    ws.name,
        date,
        time:     timeLabel,
        location: "Yahya Hub, Abuja, Nigeria",
        amount,
        extraRows: [
          { label: "Booking Type", value: bookingType === "daily" ? "Full Day" : "Hourly" },
          { label: "Purpose",      value: reason },
          ...(paystackRef ? [{ label: "Payment Ref", value: paystackRef }] : []),
        ],
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yahyahub.ng",
      }),
    }).catch(err => console.error("[email] workspace booking:", err));

    return NextResponse.json({ ok: true, id: bookingId, ticketId });
  } catch (e) {
    console.error("POST /api/workspaces/[id]/book", e);
    return NextResponse.json({ error: "Booking failed. Please try again." }, { status: 500 });
  }
}
