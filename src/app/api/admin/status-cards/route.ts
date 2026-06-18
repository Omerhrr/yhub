import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/status-cards
export async function GET() {
  const items = await db.statusCard.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

// POST /api/admin/status-cards
export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await db.statusCard.count();
  const created = await db.statusCard.create({
    data: { ...body, order: body.order ?? count },
  });
  return NextResponse.json(created, { status: 201 });
}
