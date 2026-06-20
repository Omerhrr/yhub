import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

function pickProgram(b: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  if (typeof b.name        === "string")  data.name        = b.name;
  if (typeof b.description === "string")  data.description = b.description;
  if (typeof b.category    === "string")  data.category    = b.category;
  if (typeof b.duration    === "string")  data.duration    = b.duration;
  if (typeof b.price       === "number")  data.price       = b.price;
  if (typeof b.status      === "string")  data.status      = b.status;
  if (typeof b.enrollable  === "boolean") data.enrollable  = b.enrollable;
  if (typeof b.order       === "number")  data.order       = b.order;
  if ("cohort"   in b) data.cohort   = typeof b.cohort   === "string" ? b.cohort   : null;
  if ("type"     in b) data.type     = typeof b.type     === "string" ? b.type     : null;
  if ("imageUrl" in b) data.imageUrl = typeof b.imageUrl === "string" ? b.imageUrl : null;
  return data;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await db.program.update({ where: { id }, data: pickProgram(body) });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/admin/programs/[id]", e);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    await db.program.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/programs/[id]", e);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
