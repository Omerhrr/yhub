import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/admin/workspaces/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = { ...body };
  if (body.amenities !== undefined) {
    data.amenities = JSON.stringify(body.amenities);
  }
  const updated = await db.workspace.update({ where: { id }, data });
  return NextResponse.json({
    ...updated,
    amenities: JSON.parse(updated.amenities || "[]"),
  });
}

// DELETE /api/admin/workspaces/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.workspace.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
