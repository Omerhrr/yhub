import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

export type FreeDay = { date: string; label?: string };

async function getFreeDays(): Promise<FreeDay[]> {
  try {
    const rows = await db.$queryRaw<{ id: string; data: string }[]>`
      SELECT id, data FROM about_config WHERE id = 'free-days' LIMIT 1
    `;
    if (rows.length > 0) return JSON.parse(rows[0].data) as FreeDay[];
  } catch {}
  return [];
}

export async function GET(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  return NextResponse.json(await getFreeDays());
}

export async function PUT(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const body = await req.json();
    if (!Array.isArray(body))
      return NextResponse.json({ error: "Expected array of free days" }, { status: 400 });

    // Validate each entry
    const days: FreeDay[] = body.map((d: { date: string; label?: string }) => ({
      date:  d.date,
      label: d.label ?? "",
    })).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d.date));

    const data = JSON.stringify(days);
    await db.$executeRaw`
      INSERT INTO about_config (id, data) VALUES ('free-days', ${data})
      ON CONFLICT(id) DO UPDATE SET data = ${data}
    `;
    return NextResponse.json(days);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save free days" }, { status: 500 });
  }
}
