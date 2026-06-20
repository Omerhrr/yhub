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
    // Use Prisma ORM — handles column name quoting automatically
    const event = await db.eventItem.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const amount = Number(event.fee) || 0;

    if (amount > 0) {
      if (!paystackRef)
        return NextResponse.json({ error: "Payment reference required" }, { status: 400 });
      const verified = await verifyPaystackPayment(paystackRef, amount);
      if (!verified)
        return NextResponse.json({ error: "Payment could not be verified. Contact support." }, { status: 402 });
    }

    // Duplicate registration check
    const existing = await db.eventRegistration.findFirst({
      where: { eventId: id, email },
      select: { id: true, ticketId: true },
    }).catch(() => null);

    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this event.", ticketId: existing.ticketId },
        { status: 409 },
      );
    }

    await db.eventRegistration.create({
      data: {
        id: regId,
        eventId: id,
        ticketId,
        name,
        email,
        phone,
        gender: gender ?? null,
        amount,
        paystackRef: paystackRef ?? null,
        status: "confirmed",
        createdAt: now,
      },
    });

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
