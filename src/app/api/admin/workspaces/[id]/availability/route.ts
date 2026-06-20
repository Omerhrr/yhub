import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_CONFIG } from "@/lib/slots";
import { requireAdminAuth } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

const TIME_RE = /^\d{2}:\d{2}$/;
const VALID_DURATIONS = [30, 60, 90, 120];
const VALID_DAYS = new Set([0, 1, 2, 3, 4, 5, 6]);

export async function GET(req: NextRequest, { params }: Params) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  const { id } = await params;
  try {
    const rows = await db.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM workspace_availability WHERE workspaceId = ${id}
    `;
    if (!rows.length) return NextResponse.json({ workspaceId: id, ...DEFAULT_CONFIG });
    const row = rows[0];
    return NextResponse.json({
      ...row,
      availableDays: JSON.parse(row.availableDays as string),
      blackoutDates: JSON.parse(row.blackoutDates as string),
    });
  } catch {
    return NextResponse.json({ workspaceId: id, ...DEFAULT_CONFIG });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  const { id } = await params;

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  // ── Input validation ──────────────────────────────────────────────────
  const openTime     = String(body.openTime  ?? DEFAULT_CONFIG.openTime);
  const closeTime    = String(body.closeTime ?? DEFAULT_CONFIG.closeTime);
  const slotDuration = Number(body.slotDuration ?? DEFAULT_CONFIG.slotDuration);

  if (!TIME_RE.test(openTime) || !TIME_RE.test(closeTime))
    return NextResponse.json({ error: "Invalid time format (expected HH:MM)" }, { status: 400 });

  if (!VALID_DURATIONS.includes(slotDuration))
    return NextResponse.json({ error: `Slot duration must be one of: ${VALID_DURATIONS.join(", ")} minutes` }, { status: 400 });

  const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  if (toMin(openTime) >= toMin(closeTime))
    return NextResponse.json({ error: "Open time must be before close time" }, { status: 400 });

  const rawDays = Array.isArray(body.availableDays) ? body.availableDays : DEFAULT_CONFIG.availableDays;
  const availableDays = rawDays.filter((d: unknown) => typeof d === "number" && VALID_DAYS.has(d));

  const rawBlackout = Array.isArray(body.blackoutDates) ? body.blackoutDates : [];
  const blackoutDates = rawBlackout.filter((d: unknown) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d));

  const availStr    = JSON.stringify(availableDays);
  const blackoutStr = JSON.stringify(blackoutDates);

  try {
    const existing = await db.$queryRaw<{ id: string }[]>`
      SELECT id FROM workspace_availability WHERE workspaceId = ${id}
    `;
    if (existing.length) {
      await db.$executeRaw`
        UPDATE workspace_availability
        SET availableDays=${availStr}, openTime=${openTime},
            closeTime=${closeTime}, slotDuration=${slotDuration}, blackoutDates=${blackoutStr}
        WHERE workspaceId=${id}
      `;
    } else {
      const newId = crypto.randomUUID();
      await db.$executeRaw`
        INSERT INTO workspace_availability (id,workspaceId,availableDays,openTime,closeTime,slotDuration,blackoutDates)
        VALUES (${newId},${id},${availStr},${openTime},${closeTime},${slotDuration},${blackoutStr})
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/admin/workspaces/[id]/availability", e);
    return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
  }
}
