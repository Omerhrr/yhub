import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/programs
export async function GET() {
  const items = await db.program.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

// POST /api/admin/programs
export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await db.program.count();
  const created = await db.program.create({
    data: { ...body, order: body.order ?? count },
  });
  return NextResponse.json(created, { status: 201 });
}
