import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/content — public endpoint returning all site content for rendering
export async function GET() {
  try {
    const [home, footer, statusCards, workspaces, programs, events, aboutRows] = await Promise.all([
      db.homeContent.findUnique({ where: { id: "home" } }),
      db.footerContent.findUnique({ where: { id: "footer" } }),
      db.statusCard.findMany({ orderBy: { order: "asc" } }),
      db.workspace.findMany({ orderBy: { order: "asc" } }),
      db.program.findMany({ orderBy: { order: "asc" } }),
      db.eventItem.findMany({ orderBy: { order: "asc" } }),
      db.$queryRaw<{ data: string }[]>`SELECT data FROM about_config WHERE id = 'about' LIMIT 1`,
    ]);

    const aboutConfig = aboutRows.length > 0 ? JSON.parse(aboutRows[0].data) : null;

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
      aboutConfig,
    });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
