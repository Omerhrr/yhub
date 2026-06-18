import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/events
export async function GET() {
  const items = await db.eventItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

// POST /api/admin/events
export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await db.eventItem.count();
  const created = await db.eventItem.create({
    data: { ...body, order: body.order ?? count },
  });
  return NextResponse.json(created, { status: 201 });
}
