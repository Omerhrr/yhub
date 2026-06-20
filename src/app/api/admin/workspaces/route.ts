import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

function pickWorkspace(b: Record<string, unknown>) {
  return {
    name:           typeof b.name           === "string"  ? b.name           : undefined,
    description:    typeof b.description    === "string"  ? b.description    : undefined,
    imageUrl:       typeof b.imageUrl       === "string"  ? b.imageUrl       : undefined,
    rating:         typeof b.rating         === "number"  ? b.rating         : undefined,
    reviewCount:    typeof b.reviewCount    === "number"  ? b.reviewCount    : undefined,
    hourlyRate:     typeof b.hourlyRate     === "number"  ? b.hourlyRate     : undefined,
    dailyRate:      typeof b.dailyRate      === "number"  ? b.dailyRate      : undefined,
    bookingEnabled: typeof b.bookingEnabled === "boolean" ? b.bookingEnabled : undefined,
    order:          typeof b.order          === "number"  ? b.order          : undefined,
    amenities: Array.isArray(b.amenities) ? JSON.stringify(b.amenities) : undefined,
  };
}

export async function GET(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const items = await db.workspace.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items.map(w => ({ ...w, amenities: JSON.parse(w.amenities || "[]") })));
  } catch (e) {
    console.error("GET /api/admin/workspaces", e);
    return NextResponse.json({ error: "Failed to fetch workspaces" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const body = await req.json();
    const data = pickWorkspace(body);
    if (!data.name || !data.description || !data.imageUrl)
      return NextResponse.json({ error: "name, description, and imageUrl are required" }, { status: 400 });
    const count = await db.workspace.count();
    const created = await db.workspace.create({
      data: {
        name: data.name!, description: data.description!, imageUrl: data.imageUrl!,
        rating: data.rating ?? 4.5, reviewCount: data.reviewCount ?? 0,
        hourlyRate: data.hourlyRate ?? 0, dailyRate: data.dailyRate ?? 0,
        bookingEnabled: data.bookingEnabled ?? true,
        amenities: data.amenities ?? "[]",
        order: data.order ?? count,
      },
    });
    return NextResponse.json(
      { ...created, amenities: JSON.parse(created.amenities || "[]") },
      { status: 201 },
    );
  } catch (e) {
    console.error("POST /api/admin/workspaces", e);
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}
