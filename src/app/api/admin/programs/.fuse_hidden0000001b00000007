import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

function pickProgram(b: Record<string, unknown>) {
  return {
    name:        typeof b.name        === "string"  ? b.name        : undefined,
    description: typeof b.description === "string"  ? b.description : undefined,
    category:    typeof b.category    === "string"  ? b.category    : undefined,
    duration:    typeof b.duration    === "string"  ? b.duration    : undefined,
    price:       typeof b.price       === "number"  ? b.price       : undefined,
    status:      typeof b.status      === "string"  ? b.status      : undefined,
    enrollable:  typeof b.enrollable  === "boolean" ? b.enrollable  : undefined,
    order:       typeof b.order       === "number"  ? b.order       : undefined,
    cohort:      b.cohort   === null ? null : (typeof b.cohort   === "string" ? b.cohort   : undefined),
    type:        b.type     === null ? null : (typeof b.type     === "string" ? b.type     : undefined),
    imageUrl:    b.imageUrl === null ? null : (typeof b.imageUrl === "string" ? b.imageUrl : undefined),
  };
}

export async function GET(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const items = await db.program.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/admin/programs", e);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const body = await req.json();
    const data = pickProgram(body);
    if (!data.name || !data.description || !data.category || !data.duration)
      return NextResponse.json({ error: "name, description, category, and duration are required" }, { status: 400 });
    const count = await db.program.count();
    const created = await db.program.create({
      data: {
        name: data.name!, description: data.description!,
        category: data.category!, duration: data.duration!,
        price: data.price ?? 0, status: data.status ?? "upcoming",
        cohort: data.cohort, type: data.type, ...({"imageUrl": data.imageUrl} as any),
        enrollable: data.enrollable ?? true, order: data.order ?? count,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/programs", e);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
