import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

async function getModel(): Promise<string> {
  // Env var always wins (Vercel override)
  if (process.env.OPENROUTER_MODEL) return process.env.OPENROUTER_MODEL;
  try {
    const rows = await db.$queryRaw<{ id: string; data: string }[]>`
      SELECT data FROM about_config WHERE id = 'about' LIMIT 1
    `;
    if (rows.length > 0) {
      const cfg = JSON.parse(rows[0].data);
      if (cfg.chatModel) return cfg.chatModel;
    }
  } catch { /* fall through */ }
  return DEFAULT_MODEL;
}

async function buildSystemPrompt(): Promise<string> {
  let wsLines = "Contact us for workspace details.";
  let pgLines = "No upcoming programs right now — contact us for the next cohort.";
  let evLines = "Check our Events page for upcoming events.";

  try {
    const [workspaces, programs, events] = await Promise.all([
      db.workspace.findMany({ select: { id: true, name: true, hourlyRate: true, dailyRate: true, bookingEnabled: true } }),
      db.program.findMany({ select: { id: true, name: true, category: true, price: true, status: true, cohort: true, duration: true } }),
      db.eventItem.findMany({ select: { id: true, title: true, date: true, status: true, fee: true, mode: true } }),
    ]);

    if (workspaces.length) {
      wsLines = workspaces.map((w: any) =>
        `- ${w.name}: ${w.hourlyRate ? "N" + w.hourlyRate.toLocaleString() + "/hr" : ""} ${w.dailyRate ? "N" + w.dailyRate.toLocaleString() + "/day" : ""}${w.bookingEnabled ? "" : " [not bookable online]"} [id:${w.id}]`
      ).join("\n");
    }

    const upcoming = programs.filter((p: any) => p.status === "upcoming");
    if (upcoming.length) {
      pgLines = upcoming.map((p: any) =>
        `- ${p.name} (${p.category}): N${(p.price ?? 0).toLocaleString()}, ${p.duration ?? "TBD"}, starts ${p.cohort ?? "TBD"} [id:${p.id}]`
      ).join("\n");
    }

    const live = events.filter((e: any) => e.status !== "past");
    if (live.length) {
      evLines = live.map((e: any) =>
        `- ${e.title} (${e.mode ?? "In-person"}): ${e.date ?? "TBD"}, ${e.fee ? "N" + e.fee.toLocaleString() : "Free"} [id:${e.id}]`
      ).join("\n");
    }
  } catch { /* use defaults */ }

  return `You are Hubbot, the friendly AI assistant for Yahya Hub — a co-working space, innovation center, and community hub in Abuja, Nigeria.

ABOUT YAHYA HUB:
Yahya Hub provides flexible workspaces, expert-led training programs, and networking events to help entrepreneurs, freelancers, and professionals grow. Located in Abuja, Nigeria, we serve Northern Nigeria and beyond.

CONTACT:
- Phone/WhatsApp: 07043925169
- Email: yahyahub6@gmail.com
- Address: Abuja, Nigeria
- Hours: 9:00 AM - 8:00 PM daily

WORKSPACES (live):
${wsLines}

HOW TO BOOK A WORKSPACE:
1. Go to the Workspaces page, pick a space
2. Choose Hourly or Full Day booking
3. Select date and time slot
4. Pay via Paystack (card or bank transfer)
5. Get confirmation email with Ticket ID

UPCOMING COURSES (live):
${pgLines}

HOW TO ENROLL IN A COURSE:
1. Go to Courses page, pick a course
2. Click Enroll Now, fill in your details
3. Pay via Paystack
4. Get enrollment confirmation with Ticket ID

UPCOMING EVENTS (live):
${evLines}

HOW TO REGISTER FOR AN EVENT:
1. Go to Events page, pick an event
2. Click Register, fill in details
3. Pay if required (some events are free)
4. Get confirmation with Ticket ID

PAYMENTS: Paystack only - Visa, Mastercard, Verve, bank transfer. Payment is upfront.

TICKET TRACKING: You receive a Ticket ID (e.g. YH-WS-20240315-XXXX) after any booking. Visit the Track page and enter it to check status anytime.

REFUNDS: Cancel 48+ hours before scheduled date for a refund. Contact us via WhatsApp or email.

YOUR PERSONA:
- Friendly, knowledgeable, concise (2-4 sentences unless more detail is needed)
- Match the language the user writes in
- If unsure about something, say so and suggest contacting us directly
- Never fabricate prices, IDs, or dates - use only the live data above

NAVIGATION ACTIONS:
After your reply, if it would help the user take immediate action, add ONE line starting with exactly "ACTIONS:" followed by a compact JSON array.

Available views: "home", "workspaces", "courses", "events", "about", "track"
For specific item detail pages, add "id" using the [id:...] from live data above.

Format examples:
ACTIONS:[{"label":"Browse Workspaces","view":"workspaces"}]
ACTIONS:[{"label":"View This Space","view":"workspace-detail","id":"REAL_ID"},{"label":"All Spaces","view":"workspaces"}]
ACTIONS:[{"label":"Register Now","view":"event-detail","id":"REAL_ID"}]
ACTIONS:[{"label":"Track My Ticket","view":"track"}]

Only add ACTIONS when they directly help. Omit for general chat or greetings.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat not configured" }, { status: 503 });
  }

  let body: { messages?: { role: string; content: string }[] };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const messages = (body.messages ?? []).slice(-12);
  const last = messages[messages.length - 1];
  if (!last?.content || typeof last.content !== "string" || last.content.trim().length === 0) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }
  if (last.content.length > 600) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  try {
    const [systemPrompt, model] = await Promise.all([buildSystemPrompt(), getModel()]);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://yahyahub.ng",
        "X-Title": "Yahya Hub Hubbot",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 450,
        temperature: 0.65,
      }),
    });

    if (!res.ok) {
      console.error("OpenRouter:", res.status, await res.text());
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    let reply = raw.trim();
    let actions: { label: string; view: string; id?: string }[] = [];

    const lastNewline = reply.lastIndexOf("\nACTIONS:");
    if (lastNewline !== -1) {
      const actionStr = reply.slice(lastNewline + "\nACTIONS:".length).trim();
      try { actions = JSON.parse(actionStr); } catch { /* ignore */ }
      reply = reply.slice(0, lastNewline).trim();
    }

    return NextResponse.json({ reply, actions });
  } catch (e) {
    console.error("Chat route error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
