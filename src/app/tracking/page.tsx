"use client";

import { useEffect, useState } from "react";
import { TicketTrackPage } from "@/components/site/pages/TicketTrackPage";
import { ModalsHost } from "@/components/site/modals/Modals";
import { useContent } from "@/store/content";

export default function TrackingPage() {
  const { fetchContent, lastFetched } = useContent();
  const [initialId, setInitialId] = useState<string | undefined>();

  useEffect(() => {
    if (!lastFetched) fetchContent();
  }, [lastFetched, fetchContent]);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("track");
    if (id) {
      setInitialId(id.trim().toUpperCase());
      window.history.replaceState({}, "", "/tracking");
    }
  }, []);

  return (
    <>
      <TicketTrackPage initialId={initialId} />
      <ModalsHost />
    </>
  );
}
