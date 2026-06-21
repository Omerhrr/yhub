import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

function pickWorkspace(b: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  if (typeof b.name           === "string")  data.name           = b.name;
  if (typeof b.description    === "string")  data.description    = b.description;
  if (typeof b.imageUrl       === "string")  data.imageUrl       = b.imageUrl;
  if (typeof b.rating         === "number")  data.rating         = b.rating;
  if (typeof b.reviewCount    === "number")  data.reviewCount    = b.reviewCount;
  if (typeof b.hourlyRate     === "number")  data.hourlyRate     = b.hourlyRate;
  if (typeof b.dailyRate      === "number")  data.dailyRate      = b.dailyRate;
  if (typeof b.bookingEnabled === "boolean") data.bookingEnabled = b.bookingEnabled;
  if (typeof b.order          === "number")  data.order          = b.order;
  if (Array.isArray(b.amenities))            data.amenities      = JSON.stringify(b.amenities);
  return data;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await db.workspace.update({ where: { id }, data: pickWorkspace(body) });
    return NextResponse.json({ ...updated, amenities: JSON.parse(updated.amenities || "[]") });
  } catch (e) {
    console.error("PUT /api/admin/workspaces/[id]", e);
    return NextResponse.json({ error: "Failed to update workspace" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    await db.workspace.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/workspaces/[id]", e);
    return NextResponse.json({ error: "Failed to delete workspace" }, { status: 500 });
  }
}
