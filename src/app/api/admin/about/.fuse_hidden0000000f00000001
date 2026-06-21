import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-auth";

const DEFAULT_ABOUT = {
  heroTitle: "Where Ideas",
  heroHighlight: "Become Reality",
  heroSubtitle: "Yahya Hub is more than a coworking space — it's a launchpad for talent, ideas, and community in the heart of Northern Nigeria.",
  heroLocation: "Based in Abuja, Nigeria",
  heroCtaPrimary: "Explore Workspaces",
  heroCtaSecondary: "Our Courses",
  stats: [
    { value: "500+", label: "Community Members" },
    { value: "50+",  label: "Events Hosted" },
    { value: "3+",   label: "Years of Impact" },
    { value: "98%",  label: "Satisfaction Rate" },
  ],
  missionText: "Yahya Hub exists to lower the cost of turning ideas into reality. We bring together workspaces, skill-building programs, and a community of builders under one roof so that a young engineer, a solo founder, and a small architecture studio can all find the conditions they need to do their best work.",
  missionSub: "Our mission is to be the connective tissue between talent, opportunity, and the infrastructure that lets both thrive.",
  missionTags: ["Talent Development", "Collaboration", "Access", "Innovation"],
  visionText: "We see a Northern Nigeria where ambition is not gated by access. Where a teenager can walk into a space and learn robotics, where a freelancer can rent an office of one and ship a product the same week, and where built-environment professionals can find clients without leaving their city.",
  visionSub: "Yahya Hub is building toward that future — one program, one event, one workspace at a time.",
  visionTags: ["Northern Nigeria", "Empowerment", "Accessibility", "Future-Ready"],
  timeline: [
    { year: "2021", title: "The Idea", desc: "Yahya Hub was born from a simple belief: that access to great workspace and education shouldn't be a privilege." },
    { year: "2022", title: "Opening Day", desc: "We opened our first coworking space in Abuja, welcoming our first cohort of members and running our first tech bootcamp." },
    { year: "2023", title: "YH Connect Launches", desc: "We extended our reach into the built environment with YH Connect — a vetted marketplace for built-environment professionals." },
    { year: "2024", title: "Growing Community", desc: "500+ active members, 50+ events hosted, and a growing roster of programs reaching talent across Northern Nigeria." },
    { year: "2025+", title: "The Future", desc: "Expanding programs, new workspace locations, and building toward a Northern Nigeria where ambition is never gated by access." },
  ],
  values: [
    { title: "Innovation", desc: "We embrace new ideas and challenge conventional thinking to drive progress in everything we do.", icon: "lightbulb", color: "amber" },
    { title: "Community", desc: "We believe great things happen when talented people work alongside each other and share knowledge.", icon: "users", color: "sky" },
    { title: "Integrity", desc: "We operate transparently and honestly, building trust with our members, partners, and community.", icon: "shield", color: "green" },
    { title: "Growth", desc: "We are committed to helping every individual and organisation that walks through our doors level up.", icon: "rocket", color: "purple" },
  ],
  visitTitle: "Come Visit Us",
  visitSubtitle: "We're located in the heart of Abuja. Come in for a tour, grab a hot desk for the day, or just say hello — the door's always open.",
  visitHours: "Open 9:00 AM – 8:00 PM",
  visitFeatures: [
    "High-speed Starlink internet",
    "Dedicated desks & private offices",
    "Event & workshop space",
    "Collaborative open floor",
  ],
  address: "Abuja, Nigeria",
  ctaTitle: "Join Our Community",
  ctaSub: "Whether you're looking for a place to work, a skill to learn, or a network to grow with — you have a home at Yahya Hub. Become part of our story today.",
  ctaCtaPrimary: "Get Started",
  ctaCtaSecondary: "Upcoming Events",
};

async function getAbout() {
  try {
    const rows = await db.$queryRaw<{ id: string; data: string }[]>`
      SELECT id, data FROM about_config WHERE id = 'about' LIMIT 1
    `;
    if (rows.length > 0) {
      return { ...DEFAULT_ABOUT, ...JSON.parse(rows[0].data) };
    }
  } catch {}
  return DEFAULT_ABOUT;
}

export async function GET() {
  return NextResponse.json(await getAbout());
}

export async function PUT(req: NextRequest) {
  const authErr = requireAdminAuth(req); if (authErr) return authErr;
  try {
    const body = await req.json();
    const merged = { ...DEFAULT_ABOUT, ...body };
    const data = JSON.stringify(merged);

    await db.$executeRaw`
      INSERT INTO about_config (id, data) VALUES ('about', ${data})
      ON CONFLICT(id) DO UPDATE SET data = ${data}
    `;
    return NextResponse.json(merged);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
