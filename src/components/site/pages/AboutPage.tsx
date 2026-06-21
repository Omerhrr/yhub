"use client";

import React, { useState } from "react";
import {
  Lightbulb, Telescope, Building2, BookOpen, CalendarDays,
  Mail, Phone, MapPin, Users, Star, Award, Zap,
  ArrowRight, Heart, Globe, Shield, Rocket, type LucideIcon,
  Facebook, Twitter, Linkedin, MessageCircle, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNav } from "@/store/nav";
import { useContent, type AboutConfig } from "@/store/content";
import { SITE } from "@/data/content";
import { cn } from "@/lib/utils";

/* ─── Icon map ─── */
const ICON_MAP: Record<string, LucideIcon> = {
  lightbulb: Lightbulb, users: Users, shield: Shield, rocket: Rocket,
  star: Star, award: Award, heart: Heart, zap: Zap, globe: Globe,
  building: Building2, book: BookOpen, calendar: CalendarDays,
};

const COLOR_MAP: Record<string, { icon: string; bg: string }> = {
  amber:  { icon: "text-amber-500",  bg: "bg-amber-50" },
  sky:    { icon: "text-sky-500",    bg: "bg-sky-50" },
  green:  { icon: "text-green-500",  bg: "bg-green-50" },
  purple: { icon: "text-purple-500", bg: "bg-purple-50" },
  blue:   { icon: "text-blue-500",   bg: "bg-blue-50" },
  rose:   { icon: "text-rose-500",   bg: "bg-rose-50" },
  orange: { icon: "text-orange-500", bg: "bg-orange-50" },
};

/* ─── Defaults (mirrors API defaults) ─── */
const DEFAULTS: AboutConfig = {
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
  faqs: [],
  whatsapp: "https://wa.me/2347043925169",
  socialFacebook: "https://www.facebook.com/share/1913yPdrYe/",
  socialTwitter: "https://x.com/YahyaHub",
  socialLinkedin: "https://www.linkedin.com/company/yahyahub/posts",
};

const OFFERINGS = [
  { icon: Building2, title: "Flexible Workspaces", desc: "Modern, fully-equipped coworking spaces designed for deep work and spontaneous collaboration — from hot desks to private offices.", cta: "Explore Spaces", view: "workspaces" as const, accent: "border-t-primary" },
  { icon: BookOpen,  title: "Expert-Led Courses",  desc: "Cutting-edge tech bootcamps and workshops led by industry practitioners. Data Science, Cybersecurity, UI/UX, AI Automation, and more.", cta: "View Courses", view: "courses" as const, accent: "border-t-secondary" },
  { icon: CalendarDays, title: "Inspiring Events", desc: "A vibrant calendar of conferences, networking meetups, and workshops that connect you with leaders, investors, and peers.", cta: "See Events", view: "events" as const, accent: "border-t-amber-400" },
];

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export function AboutPage() {
  const { navigate } = useNav();
  const { aboutConfig: raw } = useContent();
  const cfg: AboutConfig = { ...DEFAULTS, ...(raw ?? {}) };
  const [activeTab, setActiveTab] = useState<"mission" | "vision">("mission");

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-primary py-24 md:py-32 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03]" />

        <div className="container relative mx-auto max-w-5xl px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur mb-6">
            <Globe className="h-3.5 w-3.5" />
            {cfg.heroLocation}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            {cfg.heroTitle}
            <span className="block text-secondary">{cfg.heroHighlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">{cfg.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold rounded-full px-8 shadow-lg" onClick={() => navigate("workspaces")}>
              {cfg.heroCtaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8" onClick={() => navigate("courses")}>
              {cfg.heroCtaSecondary}
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 40L1440 40L1440 10C1200 35 960 0 720 15C480 30 240 5 0 20L0 40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {cfg.stats.map(({ value, label }, i) => {
              const icons = [Users, CalendarDays, Award, Star];
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="group flex flex-col items-center rounded-2xl border border-border/60 bg-background p-6 text-center shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-3xl font-extrabold text-primary">{value}</span>
                  <span className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold md:text-4xl">Why We Exist</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Every decision we make is guided by a clear purpose and a bold vision for what's possible.</p>
          </div>
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full border border-border bg-background p-1 shadow-sm">
              {(["mission", "vision"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={cn("rounded-full px-6 py-2 text-sm font-semibold capitalize transition-all duration-200",
                    activeTab === tab ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}>
                  Our {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            {activeTab === "mission" && (
              <Card className="mx-auto max-w-3xl p-8 md:p-12 border-border/60 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Lightbulb className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-foreground leading-relaxed text-lg">{cfg.missionText}</p>
                <p className="mt-4 text-muted-foreground leading-relaxed">{cfg.missionSub}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {cfg.missionTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{tag}</span>
                  ))}
                </div>
              </Card>
            )}
            {activeTab === "vision" && (
              <Card className="mx-auto max-w-3xl p-8 md:p-12 border-border/60 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10"><Telescope className="h-6 w-6 text-secondary" /></div>
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-foreground leading-relaxed text-lg">{cfg.visionText}</p>
                <p className="mt-4 text-muted-foreground leading-relaxed">{cfg.visionSub}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {cfg.visionTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">{tag}</span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">What We Offer</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Three pillars, one community — everything you need to learn, work, and connect.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {OFFERINGS.map(({ icon: Icon, title, desc, cta, view, accent }) => (
              <Card key={title} className={cn("group relative flex flex-col overflow-hidden border-t-4 border-border/60 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1", accent)}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <button onClick={() => navigate(view)} className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-200 hover:gap-2.5">
                  {cta} <ArrowRight className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Our Story</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">From a single idea to a growing community of builders.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5" />
            <div className="space-y-10">
              {cfg.timeline.map(({ year, title, desc }, i) => (
                <div key={year + i} className={cn("relative flex gap-6 md:gap-0", i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse")}>
                  <div className="absolute left-6 z-10 flex h-4 w-4 -translate-x-1.5 items-center justify-center rounded-full border-2 border-primary bg-white mt-1 md:left-1/2 md:-translate-x-2" />
                  <div className="hidden md:block md:w-1/2" />
                  <div className={cn("ml-10 md:ml-0 md:w-1/2", i % 2 === 0 ? "md:pl-10" : "md:pr-10 md:text-right")}>
                    <span className="inline-block rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-white mb-2">{year}</span>
                    <h4 className="text-lg font-bold">{title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Our Core Values</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">The principles that guide how we build, collaborate, and serve.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cfg.values.map(({ icon, color, title, desc }, i) => {
              const Icon = ICON_MAP[icon] ?? Lightbulb;
              const c = COLOR_MAP[color] ?? COLOR_MAP.amber;
              return (
                <div key={i} className="group flex flex-col items-center rounded-2xl border border-border/60 p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110", c.bg)}>
                    <Icon className={cn("h-7 w-7", c.icon)} />
                  </div>
                  <h3 className="text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LOCATION + CONTACT ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">{cfg.visitTitle}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{cfg.visitSubtitle}</p>
              <div className="mt-8 space-y-4">
                <a href={`mailto:${SITE.email}`} className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Email Us</p><p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{SITE.email}</p></div>
                </a>
                <a href={`tel:${SITE.phone}`} className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10"><Phone className="h-5 w-5 text-secondary" /></div>
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Call Us</p><p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{SITE.phone}</p></div>
                </a>
                <a href={cfg.whatsapp || `https://wa.me/234${SITE.phone.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-green-500/40 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50"><MessageCircle className="h-5 w-5 text-green-500" /></div>
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">WhatsApp Us</p><p className="text-sm font-semibold text-foreground group-hover:text-green-500 transition-colors">{SITE.phone}</p></div>
                </a>
                <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50"><MapPin className="h-5 w-5 text-amber-500" /></div>
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Find Us</p><p className="text-sm font-semibold text-foreground">{cfg.address}</p></div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <a href={cfg.socialFacebook || SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"><Facebook className="h-4 w-4 text-muted-foreground" /></a>
                <a href={cfg.socialTwitter || SITE.social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"><Twitter className="h-4 w-4 text-muted-foreground" /></a>
                <a href={cfg.socialLinkedin || SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"><Linkedin className="h-4 w-4 text-muted-foreground" /></a>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl">
              <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/5" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">
                  <Zap className="h-3.5 w-3.5 text-secondary" />{cfg.visitHours}
                </div>
                <h3 className="text-2xl font-bold">Ready to visit?</h3>
                <p className="mt-3 text-white/80 text-sm leading-relaxed">Drop by for a free tour of our spaces. No appointment needed — just walk in and see what Yahya Hub is all about.</p>
                <div className="mt-6 space-y-3">
                  {cfg.visitFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/90">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />{f}
                    </div>
                  ))}
                </div>
                <Button className="mt-8 bg-white text-primary hover:bg-white/90 font-semibold rounded-full w-full" onClick={() => navigate("workspaces")}>
                  Book a Space <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection faqs={cfg.faqs} />

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-white/5" />
        </div>
        <div className="container relative mx-auto max-w-3xl px-4 text-center text-white">
          <Heart className="mx-auto h-10 w-10 text-secondary mb-4" />
          <h2 className="text-3xl font-bold md:text-4xl">{cfg.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80 leading-relaxed">{cfg.ctaSub}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold rounded-full px-8 shadow-lg" onClick={() => navigate("workspaces")}>
              {cfg.ctaCtaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8" onClick={() => navigate("events")}>
              {cfg.ctaCtaSecondary}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   FAQ SECTION
───────────────────────────────────────────────────────────────────── */
const DEFAULT_FAQS = [
  {
    q: "What is Yahya Hub?",
    a: "Yahya Hub is a co-working space, innovation center, and community hub in Abuja, Nigeria. We provide flexible workspaces, training programs, and networking events designed to help entrepreneurs, freelancers, and professionals grow.",
  },
  {
    q: "How do I book a workspace?",
    a: "You can book a workspace directly on our website. Browse available spaces, choose your preferred date and time (hourly or full-day), complete payment via Paystack, and you'll receive an email confirmation with your ticket.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept card payments (Visa, Mastercard, Verve) and bank transfers through Paystack. Payment is required upfront to confirm your booking or registration.",
  },
  {
    q: "Can I get a refund if I cancel?",
    a: "Cancellations made at least 48 hours before your scheduled date are eligible for a refund. Please contact us via email or WhatsApp to initiate a cancellation.",
  },
  {
    q: "Do I need to be a member to attend events?",
    a: "No, most of our events are open to the public. Some events may require registration or have a fee. Check the event details on our Events page for specific requirements.",
  },
  {
    q: "What amenities are available at the hub?",
    a: "We offer high-speed Wi-Fi, power backup, printing/scanning, meeting rooms, a lounge area, and on-site support. Specific amenities vary by workspace type.",
  },
  {
    q: "How do I track my booking or registration ticket?",
    a: "After booking or registering, you'll receive a ticket ID via email. Visit the Track page on our website and enter your ticket ID to check the status at any time.",
  },
  {
    q: "How can I reach you quickly?",
    a: `You can reach us by email at ${SITE.email}, call or WhatsApp us on ${SITE.phone}, or simply walk in during our operating hours. We typically respond to WhatsApp messages within a few hours.`,
  },
];

function FaqSection({ faqs }: { faqs?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-4">FAQ</span>
          <h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">Everything you need to know about Yahya Hub. Can&apos;t find an answer? Reach out to us directly.</p>
        </div>

        <div className="space-y-3">
          {items.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                    {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
