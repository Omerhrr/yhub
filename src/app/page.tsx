"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ModalsHost } from "@/components/site/modals/Modals";
import { HomePage } from "@/components/site/pages/HomePage";
import {
  BlogPage,
  PrivacyPage,
  TermsPage,
  YhConnectPage,
} from "@/components/site/pages/StaticPages";
import { AboutPage } from "@/components/site/pages/AboutPage";
import {
  WorkspacesPage,
  WorkspaceDetailPage,
  CoursesPage,
  CourseDetailPage,
  EventsListPage,
  EventDetailPage,
} from "@/components/site/pages/DetailPages";
import { AdminLoginPage } from "@/components/site/pages/AuthPages";
import { AdminDashboard } from "@/components/site/pages/AdminDashboard";
import { TicketTrackPage } from "@/components/site/pages/TicketTrackPage";
import { HubBot } from "@/components/site/HubBot";
import { useNav } from "@/store/nav";
import { useContent } from "@/store/content";
import { toast } from "sonner";

function NotFoundPage() {
  const { navigate } = useNav();
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <button
        onClick={() => navigate("home")}
        className="mt-6 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back to Home
      </button>
    </div>
  );
}

export default function Home() {
  const { view, adminAuthed, navigate } = useNav();
  const { fetchContent, lastFetched } = useContent();
  const [trackInitId, setTrackInitId] = useState<string | undefined>();

  useEffect(() => {
    if (!lastFetched) fetchContent();
  }, [lastFetched, fetchContent]);

  // Handle ?track=YH-WS-... links from confirmation emails
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("track");
    if (id) {
      setTrackInitId(id.trim().toUpperCase());
      navigate("track-ticket");
      // Clean the URL without reloading
      window.history.replaceState({}, "", window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === "admin-dashboard" && !adminAuthed) {
      toast.error("Access Denied", { description: "You do not have permission to access this page." });
      navigate("admin-login");
    }
  }, [view, adminAuthed, navigate]);

  if (view === "track-ticket") {
    return (
      <>
        <TicketTrackPage initialId={trackInitId} />
        <ModalsHost />
      </>
    );
  }

  if (view === "admin-login") {
    return (
      <div className="min-h-screen flex flex-col bg-muted/40">
        <AdminLoginPage />
        <ModalsHost />
      </div>
    );
  }

  if (view === "admin-dashboard" && adminAuthed) {
    return (
      <>
        <AdminDashboard />
        <ModalsHost />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {view === "home"             && <HomePage />}
        {view === "about"            && <AboutPage />}
        {view === "workspaces"       && <WorkspacesPage />}
        {view === "workspace-detail" && <WorkspaceDetailPage />}
        {view === "courses"          && <CoursesPage />}
        {view === "programs"         && <CoursesPage />}
        {view === "course-detail"    && <CourseDetailPage />}
        {view === "events"           && <EventsListPage />}
        {view === "event-detail"     && <EventDetailPage />}
        {view === "blog"             && <BlogPage />}
        {view === "privacy"          && <PrivacyPage />}
        {view === "terms"            && <TermsPage />}
        {view === "yh-connect"       && <YhConnectPage />}
        {view === "not-found"        && <NotFoundPage />}
      </main>
      <Footer />
      <ModalsHost />
      <HubBot />
    </div>
  );
}

