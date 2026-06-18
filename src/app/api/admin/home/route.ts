import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/admin/home — update hero content
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await db.homeContent.upsert({
      where: { id: "home" },
      update: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroCtaPrimaryText: body.heroCtaPrimaryText,
        heroCtaPrimaryAnchor: body.heroCtaPrimaryAnchor,
        heroCtaSecondaryText: body.heroCtaSecondaryText,
        heroCtaSecondaryAnchor: body.heroCtaSecondaryAnchor,
        heroVideoUrl: body.heroVideoUrl,
      },
      create: {
        id: "home",
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroCtaPrimaryText: body.heroCtaPrimaryText,
        heroCtaPrimaryAnchor: body.heroCtaPrimaryAnchor,
        heroCtaSecondaryText: body.heroCtaSecondaryText,
        heroCtaSecondaryAnchor: body.heroCtaSecondaryAnchor,
        heroVideoUrl: body.heroVideoUrl,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/home error:", error);
    return NextResponse.json({ error: "Failed to update home content" }, { status: 500 });
  }
}
