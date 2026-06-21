"use client";

import { create } from "zustand";
import {
  workspaces as defaultWorkspaces,
  upcomingPrograms as defaultUpcomingPrograms,
  completedPrograms as defaultCompletedPrograms,
  homeEvents as defaultHomeEvents,
  pastEvents as defaultPastEvents,
  statusCards as defaultStatusCards,
  type Workspace,
  type Program,
  type EventItem,
} from "@/data/content";

// Types matching what /api/content returns
export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimaryText: string;
  heroCtaPrimaryAnchor: string;
  heroCtaSecondaryText: string;
  heroCtaSecondaryAnchor: string;
  heroVideoUrl: string;
};

export type FooterContent = {
  email: string;
  phone: string;
  facebook: string;
  twitter: string;
  linkedin: string;
};

export type StatusCardData = {
  id: string;
  title: string;
  icon: string;
  badgeLabel: string;
  badgeVariant: "green" | "yellow";
  primary: string;
  secondary: string;
  order: number;
};

export type AboutStat = { value: string; label: string };
export type AboutTimelineItem = { year: string; title: string; desc: string };
export type AboutValue = { title: string; desc: string; icon: string; color: string };
export type AboutFaq = { q: string; a: string };

export type AboutConfig = {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroLocation: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  stats: AboutStat[];
  missionText: string;
  missionSub: string;
  missionTags: string[];
  visionText: string;
  visionSub: string;
  visionTags: string[];
  timeline: AboutTimelineItem[];
  values: AboutValue[];
  visitTitle: string;
  visitSubtitle: string;
  visitHours: string;
  visitFeatures: string[];
  address: string;
  ctaTitle: string;
  ctaSub: string;
  ctaCtaPrimary: string;
  ctaCtaSecondary: string;
  faqs: AboutFaq[];
  whatsapp: string;
  socialFacebook: string;
  socialTwitter: string;
  socialLinkedin: string;
};

type ContentState = {
  // Data
  home: HomeContent | null;
  footer: FooterContent | null;
  aboutConfig: AboutConfig | null;
  statusCards: StatusCardData[];
  workspaces: Workspace[];
  upcomingPrograms: Program[];
  completedPrograms: Program[];
  homeEvents: EventItem[];
  pastEvents: EventItem[];

  // Loading state
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchContent: () => Promise<void>;
  setContent: (data: Partial<ContentState>) => void;
};

export const useContent = create<ContentState>((set, get) => ({
  home: null,
  footer: null,
  aboutConfig: null,
  statusCards: defaultStatusCards,
  workspaces: defaultWorkspaces,
  upcomingPrograms: defaultUpcomingPrograms,
  completedPrograms: defaultCompletedPrograms,
  homeEvents: defaultHomeEvents,
  pastEvents: defaultPastEvents,

  loading: false,
  error: null,
  lastFetched: null,

  fetchContent: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      set({
        home: data.home ?? null,
        footer: data.footer ?? null,
        aboutConfig: data.aboutConfig ?? null,
        statusCards: data.statusCards?.length
          ? data.statusCards
          : get().statusCards,
        workspaces: data.workspaces?.length
          ? data.workspaces
          : get().workspaces,
        upcomingPrograms: data.programs
          ? data.programs.filter((p: Program) => p.status === "upcoming")
          : get().upcomingPrograms,
        completedPrograms: data.programs
          ? data.programs.filter((p: Program) => p.status === "completed")
          : get().completedPrograms,
        homeEvents: data.events
          ? data.events.filter((e: EventItem) => e.list === "home")
          : get().homeEvents,
        pastEvents: data.events
          ? data.events.filter((e: EventItem) => e.list === "past")
          : get().pastEvents,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to fetch content",
      });
    }
  },

  setContent: (data) => set(data),
}));
