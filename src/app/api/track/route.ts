import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const ticketId = req.nextUrl.searchParams.get("id")?.trim().toUpperCase();

  if (!ticketId || !/^YH-(WS|CS|EV)-\d{8}-[A-Z0-9]+$/.test(ticketId)) {
    return NextResponse.json({ error: "Invalid ticket ID format" }, { status: 400 });
  }

  try {
    // Course enrollment
    const courseRows = await db.$queryRaw<Record<string, unknown>[]>`
      SELECT e.*, p.name AS programName, p.category, p.duration, p.cohort
      FROM course_enrollments e
      LEFT JOIN programs p ON p.id = e.programId
      WHERE e.ticketId = ${ticketId}
      LIMIT 1
    `.catch(() => []);

    if (courseRows.length) {
      const r = courseRows[0];
      return NextResponse.json({
        found:     true,
        type:      "course",
        ticketId,
        title:     r.programName ?? "Course",
        name:      r.name,
        email:     maskEmail(String(r.email)),
        date:      r.cohort ?? "See schedule",
        time:      r.duration,
        location:  "Yahya Hub, Abuja, Nigeria",
        amount:    r.amount ?? 0,
        status:    r.status ?? "confirmed",
        extra: [
          { label: "Category", value: r.category },
          { label: "Duration", value: r.duration },
        ].filter(x => x.value),
      });
    }

    // Event registration
    const eventRows = await db.$queryRaw<Record<string, unknown>[]>`
      SELECT er.*, e.title AS eventTitle, e.date AS eventDate,
             e.time AS eventTime, e.location AS eventLocation,
             e.category, e.mode
      FROM event_registrations er
      LEFT JOIN events e ON e.id = er.eventId
      WHERE er.ticketId = ${ticketId}
      LIMIT 1
    `.catch(() => []);

    if (eventRows.length) {
      const r = eventRows[0];
      const location = r.mode === "Webinar"
        ? "Online (Webinar)"
        : (r.eventLocation ?? "Yahya Hub, Abuja, Nigeria");
      return NextResponse.json({
        found:     true,
        type:      "event",
        ticketId,
        title:     r.eventTitle ?? "Event",
        name:      r.name,
        email:     maskEmail(String(r.email)),
        date:      r.eventDate,
        time:      r.eventTime,
        location,
        amount:    r.amount ?? 0,
        status:    r.status ?? "confirmed",
        extra: [
          { label: "Category", value: r.category },
          { label: "Mode",     value: r.mode },
        ].filter(x => x.value),
      });
    }

    // Workspace booking
    const wsRows = await db.$queryRaw<Record<string, unknown>[]>`
      SELECT b.*, w.name AS workspaceName
      FROM workspace_bookings b
      LEFT JOIN workspaces w ON w.id = b.workspaceId
      WHERE b.ticketId = ${ticketId}
      LIMIT 1
    `.catch(() => []);

    if (wsRows.length) {
      const r = wsRows[0];
      const bkType = String(r.type ?? r.bookingType ?? "hourly");
      const timeLabel = bkType === "daily"
        ? "Full day (09:00 - 20:00)"
        : `${r.startTime} - ${r.endTime}`;
      return NextResponse.json({
        found:     true,
        type:      "workspace",
        ticketId,
        title:     r.workspaceName ?? "Workspace",
        name:      r.name,
        email:     maskEmail(String(r.email)),
        date:      r.date,
        time:      timeLabel,
        location:  "Yahya Hub, Abuja, Nigeria",
        amount:    r.amount ?? 0,
        status:    String(r.status ?? "confirmed"),
        extra: [
          { label: "Booking Type", value: bkType === "daily" ? "Full Day" : "Hourly" },
          { label: "Purpose",      value: r.notes ?? r.reason },
        ].filter(x => x.value),
      });
    }

    return NextResponse.json({ found: false });
  } catch (e) {
    console.error("GET /api/track", e);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, local.length - 2))}@${domain}`;
}
