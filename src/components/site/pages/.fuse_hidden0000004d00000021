"use client";

import { useEffect } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusCard } from "../StatusCard";
import { WorkspaceCard } from "../WorkspaceCard";
import { ProgramCard } from "../ProgramCard";
import { HomeEventCard } from "../EventCard";
import { useNav } from "@/store/nav";
import { useContent } from "@/store/content";
import { HERO_VIDEO_URL } from "@/data/content";

function SectionHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function HomePage() {
  const { navigate, navigateToDetail, homeAnchor } = useNav();
  const { home, statusCards, workspaces, upcomingPrograms, homeEvents } = useContent();

  useEffect(() => {
    if (!homeAnchor) return;
    const el = document.getElementById(homeAnchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [homeAnchor]);

  const heroTitle = home?.heroTitle ?? "Welcome to Yahya Hub";
  const heroSubtitle = home?.heroSubtitle ?? "A vibrant space for ideas, creativity, and collaboration. We offer coworking spaces, run skill-building programs, and host events that inspire innovation across every field.";
  const heroVideoUrl = home?.heroVideoUrl ?? HERO_VIDEO_URL;
  const primaryCtaText = home?.heroCtaPrimaryText ?? "Explore Workspaces";
  const secondaryCtaText = home?.heroCtaSecondaryText ?? "Our Courses";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[680px] items-center overflow-hidden bg-primary">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" poster="">
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-7 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                Kaduna&apos;s Creative &amp; Tech Hub
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                {heroTitle}
              </h1>
              <p className="text-base leading-relaxed text-white/85 sm:text-lg max-w-lg">{heroSubtitle}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 bg-secondary text-primary hover:bg-secondary/90"
                  onClick={() => navigate("workspaces")}
                >
                  {primaryCtaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/50 px-8 text-sm font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transition-all"
                  onClick={() => navigate("courses")}
                >
                  {secondaryCtaText}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {statusCards.map((s) => (
                <StatusCard key={s.id} {...s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workspaces */}
      <section id="workspaces" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Workspaces"
            subtitle="Modern, fully-equipped spaces designed to inspire productivity — from hot desks to private offices."
            action={
              <button
                onClick={() => navigate("workspaces")}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0"
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            }
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.slice(0, 3).map((w) => (
              <WorkspaceCard
                key={w.id}
                workspace={w}
                onViewDetail={() => navigateToDetail("workspace-detail", w.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Courses"
            subtitle="Expert-led bootcamps and workshops to help you acquire in-demand skills and accelerate your career."
            action={
              <button
                onClick={() => navigate("courses")}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0"
              >
                All Courses <ChevronRight className="h-4 w-4" />
              </button>
            }
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingPrograms.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                onViewDetail={() => navigateToDetail("course-detail", p.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Events"
            subtitle="Networking events, conferences, and meetups that connect you with leaders, investors, and peers."
            action={
              <button
                onClick={() => navigate("events")}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0"
              >
                All Events <ChevronRight className="h-4 w-4" />
              </button>
            }
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {homeEvents.map((e) => (
              <HomeEventCard
                key={e.id}
                event={e}
                onViewDetail={() => navigateToDetail("event-detail", e.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
