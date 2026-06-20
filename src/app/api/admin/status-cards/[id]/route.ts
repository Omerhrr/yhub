import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await db.statusCard.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/admin/status-cards/[id]", e);
    return NextResponse.json({ error: "Failed to update status card" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    await db.statusCard.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/status-cards/[id]", e);
    return NextResponse.json({ error: "Failed to delete status card" }, { status: 500 });
  }
}
