"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  reviewCount,
  showCount = true,
  size = "sm",
}: {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-4.5 w-4.5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              dim,
              i <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
