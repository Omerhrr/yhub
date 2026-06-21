"use client";

import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusCard";
import { useNav } from "@/store/nav";
import { formatNaira, type EventItem } from "@/data/content";
import { cn } from "@/lib/utils";

export function HomeEventCard({
  event,
  onViewDetail,
}: {
  event: EventItem;
  onViewDetail?: () => void;
}) {
  const { openModal } = useNav();
  const isOngoing = event.status === "ongoing";

  return (
    <Card
      className="group flex flex-col overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      onClick={onViewDetail}
    >
      <div className={cn("h-1.5 w-full", isOngoing ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-accent to-secondary")} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Ticket className="h-4 w-4 text-accent" />
          </div>
          <StatusBadge label={isOngoing ? "Ongoing" : "Upcoming"} variant={isOngoing ? "green" : "yellow"} />
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{event.title}</h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>

        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-secondary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-secondary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-secondary" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-border" />

        <div className="mt-auto flex items-center justify-between">
          <p className="text-xl font-bold text-foreground">{formatNaira(event.fee)}</p>
          <Button
            size="sm"
            disabled={!event.bookable}
            onClick={(e) => {
              e.stopPropagation();
              openModal({ kind: "event-book", eventId: event.id });
            }}
            className={cn("rounded-full px-5", !event.bookable && "cursor-not-allowed opacity-50")}
          >
            {isOngoing ? "Ongoing" : event.bookable ? "Book a Spot" : "Closed"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
