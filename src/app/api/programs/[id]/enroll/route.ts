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

  const { name, email, phone, gender, education, paystackRef } =
    body as Record<string, string>;

  if (!name || !email || !phone)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  if (name.length > 120)  return NextResponse.json({ error: "Name too long" },  { status: 400 });
  if (phone.length > 30)  return NextResponse.json({ error: "Phone too long" }, { status: 400 });

  if (!isValidEmail(email))
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

  const enrollmentId = crypto.randomUUID();
  const ticketId     = generateTicketId("CS");
  const now          = new Date();

  try {
    const program = await db.program.findUnique({ where: { id } });
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });

    // ── Amount from DB — never trust client ───────────────────────────────
    const amount = program.price ?? 0;

    // ── Paystack verification (if paid) ──────────────────────────────────
    if (amount > 0) {
      if (!paystackRef)
        return NextResponse.json({ error: "Payment reference required" }, { status: 400 });
      const verified = await verifyPaystackPayment(paystackRef, amount);
      if (!verified)
        return NextResponse.json({ error: "Payment could not be verified. Contact support." }, { status: 402 });
    }

    // ── Duplicate enrollment check ────────────────────────────────────────
    const existing = await db.$queryRaw<{ id: string; ticketId: string }[]>`
      SELECT id, ticketId FROM course_enrollments
      WHERE programId = ${id} AND email = ${email}
      LIMIT 1
    `.catch(() => []);

    if (existing.length) {
      return NextResponse.json(
        { error: "You are already enrolled in this program.", ticketId: existing[0].ticketId },
        { status: 409 },
      );
    }

    await db.$executeRaw`
      INSERT INTO course_enrollments
        (id, programId, ticketId, name, email, phone, gender, education, amount, paystackRef, status, createdAt)
      VALUES
        (${enrollmentId}, ${id}, ${ticketId}, ${name}, ${email}, ${phone},
         ${gender ?? null}, ${education ?? null}, ${amount},
         ${paystackRef ?? null}, 'confirmed', ${now})
    `;

    sendEmail({
      to:      email,
      subject: `🎓 Enrollment Confirmed — ${program.name} · ${ticketId}`,
      html:    buildTicketEmail({
        ticketId,
        type:       "course",
        typeLabel:  "Course Enrollment",
        holderName: name,
        email,
        phone,
        title:    program.name,
        date:     program.cohort ?? "See course schedule",
        time:     program.duration,
        location: "Yahya Hub, Abuja, Nigeria",
        amount,
        extraRows: [
          { label: "Category",     value: program.category },
          { label: "Duration",     value: program.duration },
          ...(gender      ? [{ label: "Gender",      value: gender }]      : []),
          ...(education   ? [{ label: "Education",   value: education }]   : []),
          ...(paystackRef ? [{ label: "Payment Ref", value: paystackRef }] : []),
        ],
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yahyahub.ng",
      }),
    }).catch(err => console.error("[email] course enroll:", err));

    return NextResponse.json({ ok: true, id: enrollmentId, ticketId });
  } catch (e) {
    console.error("POST /api/programs/[id]/enroll", e);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }
}
