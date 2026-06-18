"use client";

import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusCard } from "../StatusCard";
import { WorkspaceCard } from "../WorkspaceCard";
import { ProgramCard } from "../ProgramCard";
import { HomeEventCard } from "../EventCard";
import { useNav } from "@/store/nav";
import { useContent } from "@/store/content";
import { HERO_VIDEO_URL } from "@/data/content";

export function HomePage() {
  const { navigate, homeAnchor } = useNav();
  const {
    home,
    statusCards,
    workspaces,
    upcomingPrograms,
    homeEvents,
  } = useContent();

  // scroll to anchor when navigating with one
  useEffect(() => {
    if (!homeAnchor) return;
    const el = document.getElementById(homeAnchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [homeAnchor]);

  const heroTitle = home?.heroTitle ?? "Welcome to Yahya Hub";
  const heroSubtitle = home?.heroSubtitle ?? "A vibrant space for ideas, creativity, and collaboration. We offer coworking spaces, run skill-building programs, and host events that inspire innovation across every field.";
  const heroVideoUrl = home?.heroVideoUrl ?? HERO_VIDEO_URL;
  const primaryCtaText = home?.heroCtaPrimaryText ?? "Explore Workspaces";
  const primaryCtaAnchor = home?.heroCtaPrimaryAnchor ?? "workspaces";
  const secondaryCtaText = home?.heroCtaSecondaryText ?? "Our Programs";
  const secondaryCtaAnchor = home?.heroCtaSecondaryAnchor ?? "programs";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[640px] items-center overflow-hidden bg-primary">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster=""
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        {/* Navy overlay */}
        <div className="absolute inset-0 bg-primary/70" />

        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy + CTAs */}
            <div className="space-y-6 text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {heroTitle}
              </h1>
              <p className="text-base text-white/90 sm:text-lg max-w-xl">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="h-11 px-8"
                  onClick={() => navigate("home", primaryCtaAnchor)}
                >
                  {primaryCtaText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 border-white px-8 text-white hover:bg-white hover:text-black"
                  onClick={() => navigate("home", secondaryCtaAnchor)}
                >
                  {secondaryCtaText}
                </Button>
              </div>
            </div>

            {/* Right: status cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {statusCards.map((s) => (
                <StatusCard key={s.id} {...s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workspaces */}
      <section id="workspaces" className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-3xl">Workspaces</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((w) => (
              <WorkspaceCard key={w.id} workspace={w} />
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-3xl">Programs</h2>
            <button
              onClick={() => navigate("programs")}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Completed
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingPrograms.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-3xl">Events</h2>
            <button
              onClick={() => navigate("events")}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Past
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {homeEvents.map((e) => (
              <HomeEventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
