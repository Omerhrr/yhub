import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authErr = requireAdminAuth(req);
  if (authErr) return authErr;

  const { searchParams } = new URL(req.url);
  const from  = searchParams.get("from");   // YYYY-MM-DD
  const to    = searchParams.get("to");     // YYYY-MM-DD
  const type  = searchParams.get("type");   // "workspace" | "course" | "event" | ""
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "200"), 500);

  try {
    const [bookings, enrollments, registrations] = await Promise.all([
      (!type || type === "workspace")
        ? db.workspaceBooking.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
              id: true, ticketId: true, name: true, email: true, phone: true,
              date: true, startTime: true, endTime: true, type: true,
              amount: true, status: true, createdAt: true, workspaceId: true,
            },
          })
        : [],
      (!type || type === "course")
        ? db.courseEnrollment.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
              id: true, ticketId: true, name: true, email: true, phone: true,
              amount: true, status: true, createdAt: true, programId: true,
            },
          })
        : [],
      (!type || type === "event")
        ? db.eventRegistration.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
              id: true, ticketId: true, name: true, email: true, phone: true,
              amount: true, status: true, createdAt: true, eventId: true,
            },
          })
        : [],
    ]);

    // Normalise into a single shape
    const all = [
      ...bookings.map((b) => ({
        id: b.id, ticketId: b.ticketId, kind: "workspace" as const,
        name: b.name, email: b.email, phone: b.phone,
        amount: b.amount, status: b.status,
        createdAt: b.createdAt.toISOString(),
        detail: `${b.date} ${b.startTime}–${b.endTime} (${b.type})`,
        refId: b.workspaceId,
      })),
      ...enrollments.map((e) => ({
        id: e.id, ticketId: e.ticketId, kind: "course" as const,
        name: e.name, email: e.email, phone: e.phone,
        amount: e.amount, status: e.status,
        createdAt: e.createdAt.toISOString(),
        detail: `Program: ${e.programId}`,
        refId: e.programId,
      })),
      ...registrations.map((r) => ({
        id: r.id, ticketId: r.ticketId, kind: "event" as const,
        name: r.name, email: r.email, phone: r.phone,
        amount: r.amount, status: r.status,
        createdAt: r.createdAt.toISOString(),
        detail: `Event: ${r.eventId}`,
        refId: r.eventId,
      })),
    ];

    // Sort newest first then apply date filter
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const filtered = all.filter((t) => {
      const day = t.createdAt.slice(0, 10);
      if (from && day < from) return false;
      if (to   && day > to)   return false;
      return true;
    });

    const total   = filtered.length;
    const revenue = filtered.reduce((s, t) => s + t.amount, 0);

    return NextResponse.json({ tickets: filtered, total, revenue });
  } catch (err) {
    console.error("Admin tickets error:", err);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
