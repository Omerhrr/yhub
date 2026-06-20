import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlots, isSlotBooked, DEFAULT_CONFIG } from "@/lib/slots";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const rawDate = req.nextUrl.searchParams.get("date") ?? "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
    ? rawDate
    : new Date().toISOString().slice(0, 10);

  let cfg = { ...DEFAULT_CONFIG };
  try {
    const rows = await db.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM workspace_availability WHERE workspaceId = ${id}
    `;
    if (rows.length) {
      cfg = {
        availableDays: JSON.parse(rows[0].availableDays as string),
        openTime: rows[0].openTime as string,
        closeTime: rows[0].closeTime as string,
        slotDuration: rows[0].slotDuration as number,
        blackoutDates: JSON.parse(rows[0].blackoutDates as string),
      };
    }
  } catch { /* use default */ }

  const dayOfWeek = new Date(date + "T12:00:00Z").getDay();
  const isAvailableDay = cfg.availableDays.includes(dayOfWeek);
  const isBlackout = cfg.blackoutDates.includes(date);
  const isPast = date < new Date().toISOString().slice(0, 10);

  if (!isAvailableDay || isBlackout || isPast) {
    return NextResponse.json({ date, config: cfg, dayAvailable: false, slots: [] });
  }

  let bookings: { startTime: string; endTime: string }[] = [];
  try {
    bookings = await db.$queryRaw<{ startTime: string; endTime: string }[]>`
      SELECT startTime, endTime FROM workspace_bookings WHERE workspaceId=${id} AND date=${date}
    `;
  } catch { /* no bookings table yet */ }

  const slotTimes = generateSlots(cfg.openTime, cfg.closeTime, cfg.slotDuration);
  const slots = slotTimes.map(time => ({
    time,
    status: isSlotBooked(time, cfg.slotDuration, bookings) ? "booked" : "available",
  }));

  
  return NextResponse.json({ date, config: cfg, dayAvailable: true, slots });
}
