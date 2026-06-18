"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusCard";
import { useNav } from "@/store/nav";
import { formatNaira, type EventItem } from "@/data/content";

export function HomeEventCard({ event }: { event: EventItem }) {
  const { openModal } = useNav();
  const isOngoing = event.status === "ongoing";

  return (
    <Card className="flex flex-col">
      <div className="flex flex-col space-y-3 p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold tracking-tight">{event.title}</h3>
          <StatusBadge
            label={event.status === "ongoing" ? "Ongoing" : "Upcoming"}
            variant={event.status === "ongoing" ? "green" : "yellow"}
          />
        </div>
        <p className="line-clamp-3 text-sm text-foreground">
          {event.description}
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="shrink-0 bg-border h-[1px] w-full" />
      </div>

      <div className="flex items-center justify-between p-6 pt-0 mt-auto">
        <p className="text-lg font-bold text-foreground">
          {formatNaira(event.fee)}
        </p>
        <Button
          disabled={!event.bookable}
          onClick={() =>
            openModal({ kind: "event-book", eventId: event.id })
          }
          className={!event.bookable ? "cursor-not-allowed opacity-60" : ""}
        >
          {isOngoing ? "Ongoing" : event.bookable ? "Book a Spot" : "Closed"}
        </Button>
      </div>
    </Card>
  );
}
