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
  faqs: [
    { q: "What is Yahya Hub?", a: "Yahya Hub is a co-working space, innovation center, and community hub in Abuja, Nigeria. We provide flexible workspaces, training programs, and networking events designed to help entrepreneurs, freelancers, and professionals grow." },
    { q: "How do I book a workspace?", a: "Browse available spaces on our website, choose your preferred date and time (hourly or full-day), complete payment via Paystack, and you'll receive an email confirmation with your ticket." },
    { q: "What payment methods do you accept?", a: "We accept card payments (Visa, Mastercard, Verve) and bank transfers through Paystack. Payment is required upfront to confirm your booking or registration." },
    { q: "Can I get a refund if I cancel?", a: "Cancellations made at least 48 hours before your scheduled date are eligible for a refund. Please contact us via email or WhatsApp to initiate a cancellation." },
    { q: "Do I need to be a member to attend events?", a: "No, most of our events are open to the public. Some events may require registration or have a fee. Check the event details on our Events page for specific requirements." },
    { q: "What amenities are available at the hub?", a: "We offer high-speed Wi-Fi, power backup, printing/scanning, meeting rooms, a lounge area, and on-site support. Specific amenities vary by workspace type." },
    { q: "How do I track my booking or registration ticket?", a: "After booking or registering, you'll receive a ticket ID via email. Visit the Track page on our website and enter your ticket ID to check the status at any time." },
    { q: "How can I reach you quickly?", a: "You can reach us by email, call or WhatsApp us, or simply walk in during our operating hours. We typically respond to WhatsApp messages within a few hours." },
  ],
  whatsapp: "https://wa.me/2347043925169",
  socialFacebook: "https://www.facebook.com/share/1913yPdrYe/",
  socialTwitter: "https://x.com/YahyaHub",
  socialLinkedin: "https://www.linkedin.com/company/yahyahub/posts",
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
