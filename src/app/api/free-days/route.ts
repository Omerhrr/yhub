import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export type FreeDay = { date: string; label?: string };

export async function GET() {
  try {
    const rows = await db.$queryRaw<{ id: string; data: string }[]>`
      SELECT id, data FROM about_config WHERE id = 'free-days' LIMIT 1
    `;
    if (rows.length > 0) return NextResponse.json(JSON.parse(rows[0].data) as FreeDay[]);
  } catch {}
  return NextResponse.json([]);
}
