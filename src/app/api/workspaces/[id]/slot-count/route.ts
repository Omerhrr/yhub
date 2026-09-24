import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/workspaces/[id]/slot-count?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM
 *
 * Returns slot availability for a slot-enabled workspace.
 * { slotEnabled, totalSlots, bookedSlots, availableSlots, fullyBooked }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const date      = searchParams.get("date");
  const startTime = searchParams.get("startTime");
  const endTime   = searchParams.get("endTime");

  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  try {
    const ws = await db.workspace.findUnique({
      where: { id },
      select: { slotEnabled: true, totalSlots: true },
    });
    if (!ws) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!ws.slotEnabled) {
      return NextResponse.json({ slotEnabled: false });
    }

    const totalSlots = ws.totalSlots ?? 24;

    // Count overlapping bookings
    const bookings = await db.workspaceBooking.findMany({
      where: { workspaceId: id, date },
      select: { startTime: true, endTime: true },
    });

    let bookedSlots = bookings.length; // default: all bookings on that date

    if (startTime && endTime) {
      const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
      const newS = toMin(startTime), newE = toMin(endTime);
      bookedSlots = bookings.filter(b => {
        const bS = toMin(b.startTime), bE = toMin(b.endTime);
        return !(newE <= bS || newS >= bE);
      }).length;
    }

    const availableSlots = Math.max(0, totalSlots - bookedSlots);

    return NextResponse.json({
      slotEnabled: true,
      totalSlots,
      bookedSlots,
      availableSlots,
      fullyBooked: availableSlots === 0,
    });
  } catch (e) {
    console.error("slot-count error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
