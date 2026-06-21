import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const items = await db.statusCard.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/admin/status-cards", e);
    return NextResponse.json({ error: "Failed to fetch status cards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const body = await req.json();
    const count = await db.statusCard.count();
    const created = await db.statusCard.create({ data: { ...body, order: body.order ?? count } });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/status-cards", e);
    return NextResponse.json({ error: "Failed to create status card" }, { status: 500 });
  }
}
