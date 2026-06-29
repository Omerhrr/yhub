"use client";

import { useEffect } from "react";
import { AdminLoginPage } from "@/components/site/pages/AuthPages";
import { AdminDashboard } from "@/components/site/pages/AdminDashboard";
import { ModalsHost } from "@/components/site/modals/Modals";
import { useNav } from "@/store/nav";
import { useContent } from "@/store/content";

export default function AdminPage() {
  const { adminAuthed, view, navigate } = useNav();
  const { fetchContent, lastFetched } = useContent();

  useEffect(() => {
    if (!lastFetched) fetchContent();
  }, [lastFetched, fetchContent]);

  // Sync nav store view so modals + sub-navigation work correctly
  useEffect(() => {
    if (adminAuthed && view !== "admin-dashboard") {
      navigate("admin-dashboard");
    } else if (!adminAuthed && view !== "admin-login") {
      navigate("admin-login");
    }
  }, [adminAuthed, view, navigate]);

  if (adminAuthed) {
    return (
      <>
        <AdminDashboard />
        <ModalsHost />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <AdminLoginPage />
      <ModalsHost />
    </div>
  );
}
