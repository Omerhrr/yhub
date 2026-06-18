import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/admin/programs/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await db.program.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

// DELETE /api/admin/programs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.program.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
