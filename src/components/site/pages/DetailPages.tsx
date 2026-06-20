"use client";

import React from "react";
import {
  ArrowLeft, MapPin, Clock, Calendar, Users, Ticket,
  BookOpen, Star, CheckCircle2, Instagram, ExternalLink,
  Armchair, LampDesk, Sofa, Tv, Projector, Presentation,
  PlayCircle, Video, Wifi,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "../StatusCard";
import { AmenityChip } from "../WorkspaceCard";
import { StarRating } from "../StarRating";
import { useNav } from "@/store/nav";
import { useContent } from "@/store/content";
import {
  workspaces,
  upcomingPrograms,
  completedPrograms,
  homeEvents,
  pastEvents,
  formatNaira,
  type Workspace,
  type Program,
  type EventItem,
} from "@/data/content";
import { cn } from "@/lib/utils";

/* ─── Back button ─── */
function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ─── Page hero band ─── */
function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════
   WORKSPACES PAGE
══════════════════════════════════════════ */
export function WorkspacesPage() {
  const { navigate, navigateToDetail } = useNav();
  const { workspaces: ws } = useContent();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <BackButton onClick={() => navigate("home")} label="Back to Home" />
      <PageHero
        title="Our Workspaces"
        subtitle="Modern, fully-equipped spaces designed to inspire productivity — from hot desks to private offices."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ws.map((w) => (
          <WorkspaceListCard
            key={w.id}
            workspace={w}
            onClick={() => navigateToDetail("workspace-detail", w.id)}
          />
        ))}
      </div>
    </div>
  );
}

function WorkspaceListCard({ workspace: w, onClick }: { workspace: Workspace; onClick: () => void }) {
  const { openModal } = useNav();
  const visibleAmenities = w.amenities.slice(0, 3);
  const hiddenCount = w.amenities.length - 3;

  return (
    <Card
      className="group flex flex-col overflow-hidden border-border/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
      onClick={onClick}
    >
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={w.imageUrl}
          alt={w.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!w.bookingEnabled && (
          <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Coming Soon
          </div>
        )}
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/20" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{w.name}</h3>
          <StarRating rating={w.rating} reviewCount={w.reviewCount} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{w.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleAmenities.map((a, i) => <AmenityChip key={i} amenity={a} />)}
          {hiddenCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              +{hiddenCount} more
            </span>
          )}
        </div>
        <div className="my-4 h-px w-full bg-border" />
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">
                {formatNaira(w.hourlyRate)} <span className="text-xs font-normal text-muted-foreground">/hr</span>
              </p>
              <p className="text-xs text-muted-foreground">{formatNaira(w.dailyRate)} /day</p>
            </div>
            <Button
              size="sm"
              className="rounded-full px-5"
              disabled={!w.bookingEnabled}
              onClick={(e) => {
                e.stopPropagation();
                openModal({ kind: "booking", workspaceId: w.id });
              }}
            >
              {w.bookingEnabled ? "Book Now" : "Unavailable"}
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); openModal({ kind: "check-availability", workspaceId: w.id }); }}
            className="w-full rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
          >
            Check Availability
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════
   WORKSPACE DETAIL PAGE
══════════════════════════════════════════ */
export function WorkspaceDetailPage() {
  const { navigate, selectedId, openModal } = useNav();
  const { workspaces: ws } = useContent();
  const workspace = ws.find((w) => w.id === selectedId);

  if (!workspace) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Workspace not found.</p>
        <Button className="mt-4" onClick={() => navigate("workspaces")}>Back to Workspaces</Button>
      </div>
    );
  }

  const w = workspace;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <BackButton onClick={() => navigate("workspaces")} label="All Workspaces" />

      {/* Image hero */}
      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-muted md:h-96">
        <img src={w.imageUrl} alt={w.name} className="h-full w-full object-cover" />
        {!w.bookingEnabled && (
          <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            Coming Soon
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{w.name}</h1>
              <StarRating rating={w.rating} reviewCount={w.reviewCount} />
            </div>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{w.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {w.amenities.map((a, i) => <AmenityChip key={i} amenity={a} />)}
            </div>
          </div>

          {/* What's included */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">What's included</h2>
            <ul className="mt-3 space-y-2">
              {["High-speed Starlink internet", "Air conditioning", "24/7 security", "Power backup (solar)"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking card */}
        <div className="lg:sticky lg:top-24 self-start">
          <Card className="p-6 shadow-lg border-border/60">
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-foreground">
                {formatNaira(w.hourlyRate)}
                <span className="text-sm font-normal text-muted-foreground"> / hr</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNaira(w.dailyRate)} / day
              </p>
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary" /> Available 9 AM – 8 PM</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" /> Yahya Hub, Kaduna</div>
            </div>
            <div className="mt-6 space-y-2">
              <Button
                className="w-full rounded-xl"
                disabled={!w.bookingEnabled}
                onClick={() => openModal({ kind: "booking", workspaceId: w.id })}
              >
                {w.bookingEnabled ? "Book This Space" : "Coming Soon"}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
                onClick={() => openModal({ kind: "check-availability", workspaceId: w.id })}
              >
                Check Availability
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => openModal({ kind: "view-space", workspaceId: w.id })}
              >
                View Gallery
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   COURSES PAGE
══════════════════════════════════════════ */
export function CoursesPage() {
  const { navigate, navigateToDetail } = useNav();
  const { upcomingPrograms: upcoming, completedPrograms: completed } = useContent();
  const [tab, setTab] = React.useState<"all" | "upcoming" | "completed">("all");

  const allCourses = [...upcoming, ...completed];
  const displayed =
    tab === "upcoming" ? upcoming :
    tab === "completed" ? completed :
    allCourses;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <BackButton onClick={() => navigate("home")} label="Back to Home" />
      <PageHero
        title="Courses & Programs"
        subtitle="Expert-led bootcamps and workshops to help you acquire in-demand skills and accelerate your career."
      />

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-xl bg-muted p-1 w-fit">
        {(["all", "upcoming", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "all" ? `All (${allCourses.length})` : t === "upcoming" ? `Upcoming (${upcoming.length})` : `Completed (${completed.length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayed.map((p) => (
          <CourseListCard
            key={p.id}
            program={p}
            onClick={() => navigateToDetail("course-detail", p.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CourseListCard({ program: p, onClick }: { program: Program; onClick: () => void }) {
  const { openModal } = useNav();
  const isUpcoming = p.status === "upcoming";

  return (
    <Card
      className="group flex flex-col overflow-hidden border-border/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
      onClick={onClick}
    >
      {p.imageUrl ? (
        <div className="relative h-44 w-full overflow-hidden">
          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3">
            <StatusBadge label={isUpcoming ? "Upcoming" : "Completed"} variant={isUpcoming ? "yellow" : "green"} />
          </div>
        </div>
      ) : (
        <div className={cn("h-1.5 w-full", isUpcoming ? "bg-gradient-to-r from-secondary to-primary" : "bg-gradient-to-r from-green-400 to-emerald-600")} />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          {!p.imageUrl && <StatusBadge label={isUpcoming ? "Upcoming" : "Completed"} variant={isUpcoming ? "yellow" : "green"} />}
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{p.name}</h3>
        {p.cohort && <p className="mt-0.5 text-xs font-medium text-secondary">{p.cohort}</p>}
        <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-secondary" />{p.duration}</div>
          <div className="flex items-center gap-2"><Users className="h-4 w-4 shrink-0 text-secondary" />{p.category}</div>
        </div>
        <div className="my-4 h-px w-full bg-border" />
        <div className="mt-auto flex items-center justify-between">
          <p className="text-xl font-bold text-foreground">{formatNaira(p.price)}</p>
          <Button
            size="sm"
            disabled={!p.enrollable}
            className={cn("rounded-full px-5", !p.enrollable && "cursor-not-allowed opacity-50")}
            onClick={(e) => {
              e.stopPropagation();
              openModal({ kind: "enroll", programId: p.id });
            }}
          >
            {p.enrollable ? "Enroll Now" : "Completed"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════
   COURSE DETAIL PAGE
══════════════════════════════════════════ */
export function CourseDetailPage() {
  const { navigate, selectedId, openModal } = useNav();
  const { upcomingPrograms: upcoming, completedPrograms: completed } = useContent();
  const allPrograms = [...upcoming, ...completed];
  const program = allPrograms.find((p) => p.id === selectedId);

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Course not found.</p>
        <Button className="mt-4" onClick={() => navigate("courses")}>Back to Courses</Button>
      </div>
    );
  }

  const p = program;
  const isUpcoming = p.status === "upcoming";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <BackButton onClick={() => navigate("courses")} label="All Courses" />

      {/* Header band / image hero */}
      {p.imageUrl ? (
        <div className="mb-8 relative rounded-2xl overflow-hidden">
          <img src={p.imageUrl} alt={p.name} className="h-56 md:h-72 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", isUpcoming ? "bg-secondary text-primary" : "bg-white/20 text-white")}>
                {isUpcoming ? "Upcoming" : "Completed"}
              </span>
              {p.cohort && <span className="text-xs text-white/70">{p.cohort}</span>}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{p.name}</h1>
          </div>
        </div>
      ) : (
        <div className={cn("mb-8 rounded-2xl p-8 text-white", isUpcoming ? "bg-primary" : "bg-gradient-to-br from-green-700 to-emerald-800")}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", isUpcoming ? "bg-secondary text-primary" : "bg-white/20 text-white")}>
              {isUpcoming ? "Upcoming" : "Completed"}
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">{p.name}</h1>
          {p.cohort && <p className="mt-1 text-sm text-white/70">{p.cohort}</p>}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">About this Course</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Who is it for?</h2>
            <p className="mt-3 text-muted-foreground">{p.category}</p>
          </div>
          {p.type && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Format</h2>
              <p className="mt-3 text-muted-foreground">{p.type}</p>
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="lg:sticky lg:top-24 self-start">
          <Card className="p-6 border-border/60 shadow-lg">
            <p className="text-2xl font-extrabold text-foreground">{formatNaira(p.price)}</p>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary" /> {p.duration}</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-secondary" /> {p.category}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" /> Yahya Hub, Kaduna</div>
            </div>
            <Button
              className="mt-6 w-full rounded-xl"
              disabled={!p.enrollable}
              onClick={() => openModal({ kind: "enroll", programId: p.id })}
            >
              {p.enrollable ? "Enroll Now" : "Enrollment Closed"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   EVENTS PAGE (all events)
══════════════════════════════════════════ */
export function EventsListPage() {
  const { navigate, navigateToDetail } = useNav();
  const { homeEvents: active, pastEvents: past } = useContent();
  const [tab, setTab] = React.useState<"active" | "past">("active");

  const displayed = tab === "active" ? active : past;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <BackButton onClick={() => navigate("home")} label="Back to Home" />
      <PageHero
        title="Events"
        subtitle="Networking events, conferences, and meetups that connect you with leaders, investors, and peers."
      />

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-xl bg-muted p-1 w-fit">
        {([["active", `Upcoming & Ongoing (${active.length})`], ["past", `Past Events (${past.length})`]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as "active" | "past")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayed.map((e) => (
          <EventListCard
            key={e.id}
            event={e}
            onClick={() => navigateToDetail("event-detail", e.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EventListCard({ event: e, onClick }: { event: EventItem; onClick: () => void }) {
  const { openModal } = useNav();
  const isOngoing = e.status === "ongoing";
  const isPast = e.status === "past";

  return (
    <Card
      className="group flex flex-col overflow-hidden border-border/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
      onClick={onClick}
    >
      {e.imageUrl ? (
        <div className="relative h-40 w-full overflow-hidden">
          <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
            <StatusBadge
              label={isOngoing ? "Ongoing" : isPast ? "Past" : "Upcoming"}
              variant={isOngoing ? "green" : isPast ? "gray" : "yellow"}
            />
            {e.mode === "Webinar" && (
              <span className="flex items-center gap-1 rounded-full bg-violet-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                <Wifi className="h-2.5 w-2.5" /> Webinar
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className={cn(
          "h-1.5 w-full",
          isOngoing ? "bg-gradient-to-r from-green-400 to-emerald-500" :
          isPast ? "bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20" :
          "bg-gradient-to-r from-accent to-secondary"
        )} />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            {e.mode === "Webinar" ? <Wifi className="h-4 w-4 text-violet-600" /> : <Ticket className="h-4 w-4 text-accent" />}
          </div>
          {!e.imageUrl && (
            <div className="flex flex-col items-end gap-1">
              <StatusBadge
                label={isOngoing ? "Ongoing" : isPast ? "Past" : "Upcoming"}
                variant={isOngoing ? "green" : isPast ? "gray" : "yellow"}
              />
              {e.isMostRecent && <span className="text-[10px] font-semibold text-primary">MOST RECENT</span>}
            </div>
          )}
        </div>
        <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground line-clamp-2">{e.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0 text-secondary" />{e.date}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-secondary" />{e.location}</div>
        </div>
        <div className="my-4 h-px w-full bg-border" />
        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-bold text-foreground">{e.fee === 0 ? "Free" : formatNaira(e.fee)}</p>
          <Button size="sm" variant="outline" className="rounded-full px-4 text-xs" onClick={(e2) => e2.stopPropagation()}>
            Read More
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════
   EVENT DETAIL PAGE
══════════════════════════════════════════ */
export function EventDetailPage() {
  const { navigate, selectedId, openModal } = useNav();
  const { homeEvents: active, pastEvents: past } = useContent();
  const allEvents = [...active, ...past];
  const event = allEvents.find((e) => e.id === selectedId);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Event not found.</p>
        <Button className="mt-4" onClick={() => navigate("events")}>Back to Events</Button>
      </div>
    );
  }

  const e = event;
  const isOngoing = e.status === "ongoing";
  const isPast = e.status === "past";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <BackButton onClick={() => navigate("events")} label="All Events" />

      {/* Header — image hero or solid band */}
      {e.imageUrl ? (
        <div className="mb-8 relative rounded-2xl overflow-hidden">
          <img src={e.imageUrl} alt={e.title} className="h-56 md:h-72 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{e.category}</span>
              {e.mode === "Webinar" ? (
                <span className="flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold">
                  <Wifi className="h-3 w-3" /> Webinar
                </span>
              ) : (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{e.mode}</span>
              )}
              <span className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                isOngoing ? "bg-green-400/30 text-green-100" :
                isPast ? "bg-white/20 text-white/80" :
                "bg-secondary text-primary"
              )}>
                {isOngoing ? "Ongoing" : isPast ? "Past" : "Upcoming"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{e.title}</h1>
          </div>
        </div>
      ) : (
        <div className={cn(
          "mb-8 rounded-2xl p-8 text-white",
          isOngoing ? "bg-gradient-to-br from-green-700 to-emerald-800" :
          isPast ? "bg-gradient-to-br from-slate-700 to-slate-800" :
          "bg-primary"
        )}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{e.category}</span>
              {e.mode === "Webinar" ? (
                <span className="flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold">
                  <Wifi className="h-3 w-3" /> Webinar
                </span>
              ) : (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{e.mode}</span>
              )}
            </div>
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              isOngoing ? "bg-green-400/30 text-green-100" :
              isPast ? "bg-white/20 text-white/80" :
              "bg-secondary text-primary"
            )}>
              {isOngoing ? "Ongoing" : isPast ? "Past" : "Upcoming"}
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">{e.title}</h1>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">About this Event</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{e.description}</p>
          </div>
          {e.longWriteUp && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Full Write-up</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground whitespace-pre-line">{e.longWriteUp}</p>
            </div>
          )}
          {e.videoUrl && (
            <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Watch the Replay</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Missed the event? Catch up with the full recording.</p>
              <a
                href={e.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Video className="h-4 w-4" />
                Watch Recording
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-foreground">Who should attend?</h2>
            <p className="mt-3 text-muted-foreground">{e.audience}</p>
          </div>
          {e.instagramUrl && (
            <a
              href={e.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Instagram className="h-4 w-4 text-pink-500" />
              View on Instagram
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          )}
        </div>

        {/* Details card */}
        <div className="lg:sticky lg:top-24 self-start">
          <Card className="p-6 border-border/60 shadow-lg">
            <p className="text-2xl font-extrabold text-foreground">{e.fee === 0 ? "Free" : formatNaira(e.fee)}</p>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-secondary shrink-0" />{e.date}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary shrink-0" />{e.time}</div>
              {e.mode === "Webinar" ? (
                <div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-violet-600 shrink-0" /><span className="text-violet-700 font-medium">Online Webinar</span></div>
              ) : (
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary shrink-0" />{e.location}</div>
              )}
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-secondary shrink-0" />{e.audience}</div>
            </div>
            <div className="mt-6 space-y-2">
              {isOngoing && (
                <Button className="w-full rounded-xl" onClick={() => openModal({ kind: "event-book", eventId: e.id })}>
                  Register Free
                </Button>
              )}
              {e.videoUrl && (
                <a
                  href={e.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <PlayCircle className="h-4 w-4" /> Watch Replay
                </a>
              )}
              {!isOngoing && !e.videoUrl && (
                <Button variant="outline" className="w-full rounded-xl" onClick={() => openModal({ kind: "event-details", eventId: e.id })}>
                  View Details
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
