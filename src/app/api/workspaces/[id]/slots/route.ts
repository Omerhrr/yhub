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
    const avail = await db.workspaceAvailability.findUnique({ where: { workspaceId: id } });
    if (avail) {
      cfg = {
        availableDays: JSON.parse(avail.availableDays),
        openTime:      avail.openTime,
        closeTime:     avail.closeTime,
        slotDuration:  avail.slotDuration,
        blackoutDates: JSON.parse(avail.blackoutDates),
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
    bookings = await db.workspaceBooking.findMany({
      where: { workspaceId: id, date },
      select: { startTime: true, endTime: true },
    });
  } catch { /* no bookings yet */ }

  const slotTimes = generateSlots(cfg.openTime, cfg.closeTime, cfg.slotDuration);
  const slots = slotTimes.map(time => ({
    time,
    status: isSlotBooked(time, cfg.slotDuration, bookings) ? "booked" : "available",
  }));

  return NextResponse.json({ date, config: cfg, dayAvailable: true, slots });
}
