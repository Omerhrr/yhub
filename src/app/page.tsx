"use client";

import { useEffect } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ModalsHost } from "@/components/site/modals/Modals";
import { HomePage } from "@/components/site/pages/HomePage";
import {
  AboutPage,
  ProgramsPage,
  EventsPage,
  BlogPage,
  PrivacyPage,
  TermsPage,
  ProductsPage,
  YhConnectPage,
} from "@/components/site/pages/StaticPages";
import {
  AdminLoginPage,
  ClientLoginPage,
  ClientRegisterPage,
  TalentLoginPage,
  TalentRegisterPage,
  AdminDashboard,
  ClientDashboard,
  TalentDashboard,
} from "@/components/site/pages/AuthPages";
import { useNav } from "@/store/nav";
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
  const { view, adminAuthed, clientAuthed, talentAuthed, navigate } = useNav();

  // Guard protected views
  useEffect(() => {
    if (view === "admin-dashboard" && !adminAuthed) {
      toast.error("Access Denied", {
        description: "You do not have permission to access this page.",
      });
      navigate("admin-login");
    } else if (view === "client-dashboard" && !clientAuthed) {
      toast.error("Access Denied", {
        description: "You do not have permission to access this page.",
      });
      navigate("client-login");
    } else if (view === "talent-dashboard" && !talentAuthed) {
      toast.error("Access Denied", {
        description: "You do not have permission to access this page.",
      });
      navigate("talent-login");
    }
  }, [view, adminAuthed, clientAuthed, talentAuthed, navigate]);

  // Auth views render standalone (no header/footer)
  const isAuthView =
    view === "admin-login" ||
    view === "client-login" ||
    view === "client-register" ||
    view === "talent-login" ||
    view === "talent-register";

  if (isAuthView) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/40">
        {view === "admin-login" && <AdminLoginPage />}
        {view === "client-login" && <ClientLoginPage />}
        {view === "client-register" && <ClientRegisterPage />}
        {view === "talent-login" && <TalentLoginPage />}
        {view === "talent-register" && <TalentRegisterPage />}
        <ModalsHost />
      </div>
    );
  }

  // Everything else has the header/footer chrome
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {view === "home" && <HomePage />}
        {view === "about" && <AboutPage />}
        {view === "programs" && <ProgramsPage />}
        {view === "events" && <EventsPage />}
        {view === "blog" && <BlogPage />}
        {view === "privacy" && <PrivacyPage />}
        {view === "terms" && <TermsPage />}
        {view === "products" && <ProductsPage />}
        {view === "yh-connect" && <YhConnectPage />}
        {view === "admin-dashboard" && adminAuthed && <AdminDashboard />}
        {view === "client-dashboard" && clientAuthed && <ClientDashboard />}
        {view === "talent-dashboard" && talentAuthed && <TalentDashboard />}
        {view === "not-found" && <NotFoundPage />}
      </main>
      <Footer />
      <ModalsHost />
    </div>
  );
}
