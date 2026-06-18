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

type BadgeVariant = "green" | "yellow";

function StatusPill({
  label,
  variant,
}: {
  label: string;
  variant: BadgeVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        variant === "green" &&
          "bg-green-500/20 text-green-600 border-green-500/30",
        variant === "yellow" &&
          "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      )}
    >
      {label}
    </span>
  );
}

export type StatusCardProps = {
  title: string;
  icon: string;
  badge: { label: string; variant: BadgeVariant };
  primary: string;
  secondary: string;
};

export function StatusCard({
  title,
  icon,
  badge,
  primary,
  secondary,
}: StatusCardProps) {
  const Icon = ICONS[icon] ?? Signal;
  return (
    <div className="rounded-lg border border-white/20 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
        </div>
        <StatusPill label={badge.label} variant={badge.variant} />
      </div>
      <div className="mt-2 text-lg font-bold text-foreground">{primary}</div>
      <div className="text-xs text-muted-foreground">{secondary}</div>
    </div>
  );
}

export function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: BadgeVariant;
}) {
  return <StatusPill label={label} variant={variant} />;
}
