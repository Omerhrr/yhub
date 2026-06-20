import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlots, isSlotBooked, DEFAULT_CONFIG } from "@/lib/slots";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const now = new Date();

  // Clamp year/month to prevent NaN or garbage monthStr in queries
  const rawYear  = parseInt(req.nextUrl.searchParams.get("year")  ?? "", 10);
  const rawMonth = parseInt(req.nextUrl.searchParams.get("month") ?? "", 10);
  const year  = Number.isFinite(rawYear)  ? Math.max(2020, Math.min(2100, rawYear))  : now.getFullYear();
  const month = Number.isFinite(rawMonth) ? Math.max(1,    Math.min(12,   rawMonth)) : now.getMonth() + 1;

  let cfg = { ...DEFAULT_CONFIG };
  try {
    const rows = await db.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM workspace_availability WHERE workspaceId = ${id}
    `;
    if (rows.length) cfg = {
      availableDays: JSON.parse(rows[0].availableDays as string),
      openTime:      rows[0].openTime as string,
      closeTime:     rows[0].closeTime as string,
      slotDuration:  rows[0].slotDuration as number,
      blackoutDates: JSON.parse(rows[0].blackoutDates as string),
    };
  } catch { /* use default config */ }

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  let bookings: { date: string; startTime: string; endTime: string }[] = [];
  try {
    bookings = await db.$queryRaw<{ date: string; startTime: string; endTime: string }[]>`
      SELECT date, startTime, endTime FROM workspace_bookings
      WHERE workspaceId = ${id} AND date LIKE ${monthStr + "-%"}
    `;
  } catch { /* table may not exist yet */ }

  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr    = now.toISOString().slice(0, 10);
  const days: Record<string, string> = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr  = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayOfWeek = new Date(dateStr + "T12:00:00Z").getDay();

    if (dateStr < todayStr)                        { days[dateStr] = "past";        continue; }
    if (!cfg.availableDays.includes(dayOfWeek))    { days[dateStr] = "unavailable"; continue; }
    if (cfg.blackoutDates.includes(dateStr))        { days[dateStr] = "blackout";    continue; }

    const dayBookings = bookings.filter(b => b.date === dateStr);
    const allSlots    = generateSlots(cfg.openTime, cfg.closeTime, cfg.slotDuration);
    const bookedCount = allSlots.filter(t => isSlotBooked(t, cfg.slotDuration, dayBookings)).length;

    if (bookedCount === 0)              days[dateStr] = "available";
    else if (bookedCount === allSlots.length) days[dateStr] = "full";
    else                                days[dateStr] = "partial";
  }

  return NextResponse.json({ year, month, config: cfg, days });
}
