import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTicketId, buildTicketEmail } from "@/lib/ticket";
import { sendEmail } from "@/lib/email";
import { verifyPaystackPayment } from "@/lib/paystack";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { name, email, phone, gender, paystackRef } =
    body as Record<string, string>;

  if (!name || !email || !phone)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  if (name.length > 120)  return NextResponse.json({ error: "Name too long" },  { status: 400 });
  if (phone.length > 30)  return NextResponse.json({ error: "Phone too long" }, { status: 400 });

  if (!isValidEmail(email))
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

  const regId    = crypto.randomUUID();
  const ticketId = generateTicketId("EV");
  const now      = new Date();

  try {
    const rows = await db.$queryRaw<{
      id: string; title: string; date: string; time: string;
      location: string; category: string; mode: string; fee: number;
    }[]>`SELECT id,title,date,time,location,category,mode,fee FROM events WHERE id = ${id} LIMIT 1`;

    const event = rows[0];
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // ── Amount from DB — never trust client ───────────────────────────────
    const amount = Number(event.fee) || 0;

    // ── Paystack verification (if paid) ──────────────────────────────────
    if (amount > 0) {
      if (!paystackRef)
        return NextResponse.json({ error: "Payment reference required" }, { status: 400 });
      const verified = await verifyPaystackPayment(paystackRef, amount);
      if (!verified)
        return NextResponse.json({ error: "Payment could not be verified. Contact support." }, { status: 402 });
    }

    // ── Duplicate registration check ──────────────────────────────────────
    const existing = await db.$queryRaw<{ id: string; ticketId: string }[]>`
      SELECT id, ticketId FROM event_registrations
      WHERE eventId = ${id} AND email = ${email}
      LIMIT 1
    `.catch(() => []);

    if (existing.length) {
      return NextResponse.json(
        { error: "You are already registered for this event.", ticketId: existing[0].ticketId },
        { status: 409 },
      );
    }

    await db.$executeRaw`
      INSERT INTO event_registrations
        (id, eventId, ticketId, name, email, phone, gender, amount, paystackRef, status, createdAt)
      VALUES
        (${regId}, ${id}, ${ticketId}, ${name}, ${email}, ${phone},
         ${gender ?? null}, ${amount}, ${paystackRef ?? null}, 'confirmed', ${now})
    `;

    const locationLabel = event.mode === "Webinar"
      ? "Online (link will be sent separately)"
      : event.location;

    sendEmail({
      to:      email,
      subject: `🎫 Registration Confirmed — ${event.title} · ${ticketId}`,
      html:    buildTicketEmail({
        ticketId,
        type:       "event",
        typeLabel:  "Event Registration",
        holderName: name,
        email,
        phone,
        title:    event.title,
        date:     event.date,
        time:     event.time,
        location: locationLabel,
        amount,
        extraRows: [
          { label: "Category", value: event.category },
          { label: "Mode",     value: event.mode },
          ...(gender      ? [{ label: "Gender",      value: gender }]      : []),
          ...(paystackRef ? [{ label: "Payment Ref", value: paystackRef }] : []),
        ],
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yahyahub.ng",
      }),
    }).catch(err => console.error("[email] event register:", err));

    return NextResponse.json({ ok: true, id: regId, ticketId });
  } catch (e) {
    console.error("POST /api/events/[id]/register", e);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }
}
