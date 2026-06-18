import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/workspaces
export async function GET() {
  const items = await db.workspace.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(
    items.map((w) => ({ ...w, amenities: JSON.parse(w.amenities || "[]") }))
  );
}

// POST /api/admin/workspaces
export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await db.workspace.count();
  const created = await db.workspace.create({
    data: {
      ...body,
      amenities: JSON.stringify(body.amenities || []),
      order: body.order ?? count,
    },
  });
  return NextResponse.json(
    { ...created, amenities: JSON.parse(created.amenities || "[]") },
    { status: 201 }
  );
}
