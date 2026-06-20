"use client";

import {
  Armchair, LampDesk, Sofa, Tv, Projector, Presentation, Eye, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { useNav } from "@/store/nav";
import { formatNaira, type Workspace, type Amenity } from "@/data/content";
import { cn } from "@/lib/utils";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  armchair: Armchair, desk: LampDesk, sofa: Sofa, tv: Tv, projector: Projector, whiteboard: Presentation,
};

export function AmenityChip({ amenity }: { amenity: Amenity }) {
  const Icon = AMENITY_ICONS[amenity.icon] ?? Armchair;
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span>{amenity.label}</span>
    </div>
  );
}

export function WorkspaceCard({
  workspace,
  onViewDetail,
}: {
  workspace: Workspace;
  onViewDetail?: () => void;
}) {
  const { openModal } = useNav();
  const visibleAmenities = workspace.amenities.slice(0, 3);
  const hiddenCount = workspace.amenities.length - 3;

  return (
    <Card
      className="group flex flex-col overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      onClick={onViewDetail}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={workspace.imageUrl}
          alt={workspace.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors duration-300 group-hover:bg-primary/30">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" />
            View Details
          </div>
        </div>
        {!workspace.bookingEnabled && (
          <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Coming Soon
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{workspace.name}</h3>
          <StarRating rating={workspace.rating} reviewCount={workspace.reviewCount} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{workspace.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleAmenities.map((a, i) => (
            <AmenityChip key={i} amenity={a} />
          ))}
          {hiddenCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); openModal({ kind: "amenities", workspaceId: workspace.id }); }}
              className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              +{hiddenCount} more
            </button>
          )}
        </div>

        <div className="my-4 h-px w-full bg-border" />

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">
                {formatNaira(workspace.hourlyRate)}{" "}
                <span className="text-xs font-normal text-muted-foreground">/hr</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatNaira(workspace.dailyRate)} <span>/day</span>
              </p>
            </div>
            <Button
              size="sm"
              disabled={!workspace.bookingEnabled}
              onClick={(e) => { e.stopPropagation(); openModal({ kind: "booking", workspaceId: workspace.id }); }}
              className={cn("rounded-full px-5", !workspace.bookingEnabled && "cursor-not-allowed opacity-50")}
            >
              {workspace.bookingEnabled ? "Book Now" : "Unavailable"}
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); openModal({ kind: "check-availability", workspaceId: workspace.id }); }}
            className="w-full rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
          >
            Check Availability
          </Button>
        </div>
      </div>
    </Card>
  );
}
