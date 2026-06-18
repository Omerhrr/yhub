import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/content — public endpoint returning all site content for rendering
export async function GET() {
  try {
    const [home, footer, statusCards, workspaces, programs, events] = await Promise.all([
      db.homeContent.findUnique({ where: { id: "home" } }),
      db.footerContent.findUnique({ where: { id: "footer" } }),
      db.statusCard.findMany({ orderBy: { order: "asc" } }),
      db.workspace.findMany({ orderBy: { order: "asc" } }),
      db.program.findMany({ orderBy: { order: "asc" } }),
      db.eventItem.findMany({ orderBy: { order: "asc" } }),
    ]);

    return NextResponse.json({
      home,
      footer,
      statusCards,
      workspaces: workspaces.map((w) => ({
        ...w,
        amenities: JSON.parse(w.amenities || "[]"),
      })),
      programs,
      events,
    });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
