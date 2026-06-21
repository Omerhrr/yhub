"use client";

import {
  Signal,
  Zap,
  Thermometer,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  signal: Signal,
  zap: Zap,
  thermometer: Thermometer,
  "briefcase-business": BriefcaseBusiness,
};

type BadgeVariant = "green" | "yellow" | "gray";

function StatusPill({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        variant === "green" && "bg-green-500/20 text-green-600 border-green-500/30",
        variant === "yellow" && "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
        variant === "gray" && "bg-muted text-muted-foreground border-border"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", variant === "green" ? "bg-green-500" : variant === "yellow" ? "bg-yellow-500" : "bg-muted-foreground")} />
      {label}
    </span>
  );
}

export type StatusCardProps = {
  title: string;
  icon: string;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  primary: string;
  secondary: string;
};

export function StatusCard({ title, icon, badgeLabel, badgeVariant, primary, secondary }: StatusCardProps) {
  const Icon = ICONS[icon] ?? Signal;
  return (
    <div className="rounded-2xl border border-white/25 bg-white/15 p-4 shadow-lg backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-medium text-white/80">{title}</span>
        </div>
        <StatusPill label={badgeLabel} variant={badgeVariant} />
      </div>
      <div className="mt-3 text-lg font-bold text-white">{primary}</div>
      <div className="text-xs text-white/60 mt-0.5">{secondary}</div>
    </div>
  );
}

export function StatusBadge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return <StatusPill label={label} variant={variant} />;
}
