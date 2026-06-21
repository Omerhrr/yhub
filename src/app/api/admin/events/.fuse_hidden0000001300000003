import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

function pickEvent(b: Record<string, unknown>) {
  return {
    title:        typeof b.title        === "string"  ? b.title        : undefined,
    description:  typeof b.description  === "string"  ? b.description  : undefined,
    category:     typeof b.category     === "string"  ? b.category     : undefined,
    mode:         typeof b.mode         === "string"  ? b.mode         : undefined,
    status:       typeof b.status       === "string"  ? b.status       : undefined,
    date:         typeof b.date         === "string"  ? b.date         : undefined,
    time:         typeof b.time         === "string"  ? b.time         : undefined,
    location:     typeof b.location     === "string"  ? b.location     : undefined,
    audience:     typeof b.audience     === "string"  ? b.audience     : undefined,
    instagramUrl: typeof b.instagramUrl === "string"  ? b.instagramUrl : undefined,
    list:         typeof b.list         === "string"  ? b.list         : undefined,
    fee:          typeof b.fee          === "number"  ? b.fee          : undefined,
    bookable:     typeof b.bookable     === "boolean" ? b.bookable     : undefined,
    isMostRecent: typeof b.isMostRecent === "boolean" ? b.isMostRecent : undefined,
    order:        typeof b.order        === "number"  ? b.order        : undefined,
    longWriteUp:  b.longWriteUp === null ? null : (typeof b.longWriteUp === "string" ? b.longWriteUp : undefined),
    imageUrl:     b.imageUrl    === null ? null : (typeof b.imageUrl    === "string" ? b.imageUrl    : undefined),
    videoUrl:     b.videoUrl    === null ? null : (typeof b.videoUrl    === "string" ? b.videoUrl    : undefined),
  };
}

export async function GET(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const items = await db.eventItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/admin/events", e);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const body = await req.json();
    const data = pickEvent(body);
    if (!data.title || !data.description || !data.category || !data.date || !data.time || !data.location || !data.audience)
      return NextResponse.json({ error: "title, description, category, date, time, location, and audience are required" }, { status: 400 });
    const count = await db.eventItem.count();
    const created = await db.eventItem.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        title: data.title!, description: data.description!, category: data.category!,
        date: data.date!, time: data.time!, location: data.location!, audience: data.audience!,
        mode: data.mode ?? "Physical", status: data.status ?? "upcoming",
        fee: data.fee ?? 0, bookable: data.bookable ?? true,
        isMostRecent: data.isMostRecent ?? false,
        instagramUrl: data.instagramUrl ?? "https://www.instagram.com/yahyahub/",
        list: data.list ?? "home", order: data.order ?? count,
        longWriteUp: data.longWriteUp, ...({"imageUrl": data.imageUrl, "videoUrl": data.videoUrl} as any),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/events", e);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
