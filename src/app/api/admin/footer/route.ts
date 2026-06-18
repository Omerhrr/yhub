import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/admin/footer — update footer content
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await db.footerContent.upsert({
      where: { id: "footer" },
      update: {
        email: body.email,
        phone: body.phone,
        facebook: body.facebook,
        twitter: body.twitter,
        linkedin: body.linkedin,
      },
      create: {
        id: "footer",
        email: body.email,
        phone: body.phone,
        facebook: body.facebook,
        twitter: body.twitter,
        linkedin: body.linkedin,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/footer error:", error);
    return NextResponse.json({ error: "Failed to update footer" }, { status: 500 });
  }
}
