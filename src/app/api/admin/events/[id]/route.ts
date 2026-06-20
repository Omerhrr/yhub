import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

function pickEvent(b: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  const strs = ["title","description","category","mode","status","date","time","location","audience","instagramUrl","list"];
  for (const k of strs) if (typeof b[k] === "string") data[k] = b[k];
  if (typeof b.fee         === "number")  data.fee         = b.fee;
  if (typeof b.order       === "number")  data.order       = b.order;
  if (typeof b.bookable    === "boolean") data.bookable    = b.bookable;
  if (typeof b.isMostRecent === "boolean") data.isMostRecent = b.isMostRecent;
  if ("longWriteUp" in b) data.longWriteUp = typeof b.longWriteUp === "string" ? b.longWriteUp : null;
  if ("imageUrl"    in b) data.imageUrl    = typeof b.imageUrl    === "string" ? b.imageUrl    : null;
  if ("videoUrl"    in b) data.videoUrl    = typeof b.videoUrl    === "string" ? b.videoUrl    : null;
  return data;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await db.eventItem.update({ where: { id }, data: pickEvent(body) });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/admin/events/[id]", e);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const { id } = await params;
    await db.eventItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/events/[id]", e);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
