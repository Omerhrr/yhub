"use client";

import {
  Image as ImageIcon,
  Armchair,
  LampDesk,
  Sofa,
  Tv,
  Projector,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { useNav } from "@/store/nav";
import {
  formatNaira,
  type Workspace,
  type Amenity,
} from "@/data/content";
import { cn } from "@/lib/utils";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  armchair: Armchair,
  desk: LampDesk,
  sofa: Sofa,
  tv: Tv,
  projector: Projector,
  whiteboard: Presentation,
};

export function AmenityChip({ amenity }: { amenity: Amenity }) {
  const Icon = AMENITY_ICONS[amenity.icon] ?? Armchair;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span>{amenity.label}</span>
    </div>
  );
}

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const { openModal } = useNav();
  const visibleAmenities = workspace.amenities.slice(0, 2);
  const hiddenCount = workspace.amenities.length - 2;

  return (
    <Card className="flex flex-col">
      <div className="flex flex-col space-y-3 p-6">
        <div className="flex items-start justify-between">
          <div className="tracking-tight text-xl font-semibold text-foreground">
            {workspace.name}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => openModal({ kind: "view-space", workspaceId: workspace.id })}
          >
            <ImageIcon className="mr-1 h-4 w-4" />
            View Space
          </Button>
        </div>
        <div className="line-clamp-2 text-sm text-foreground">
          {workspace.description}
        </div>
      </div>

      <div className="px-6 pb-3 flex-grow space-y-3">
        <StarRating
          rating={workspace.rating}
          reviewCount={workspace.reviewCount}
        />
        <div className="flex flex-wrap items-center gap-3">
          {visibleAmenities.map((a, i) => (
            <AmenityChip key={i} amenity={a} />
          ))}
          {hiddenCount > 0 && (
            <button
              onClick={() =>
                openModal({ kind: "amenities", workspaceId: workspace.id })
              }
              className="text-xs font-medium text-primary hover:underline"
            >
              +{hiddenCount} more
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="shrink-0 bg-border h-[1px] w-full" />
      </div>

      <div className="flex items-center justify-between p-6 pt-0 mt-auto">
        <div>
          <p className="text-xl font-bold text-foreground">
            {formatNaira(workspace.hourlyRate)}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              /hour
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {formatNaira(workspace.dailyRate)}{" "}
            <span className="text-xs">/day</span>
          </p>
        </div>
        <Button
          disabled={!workspace.bookingEnabled}
          onClick={() =>
            openModal({ kind: "booking", workspaceId: workspace.id })
          }
          className={cn(!workspace.bookingEnabled && "cursor-not-allowed opacity-60")}
        >
          Check Availability
        </Button>
      </div>
    </Card>
  );
}
