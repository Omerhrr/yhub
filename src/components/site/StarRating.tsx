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
  const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={cn(dim, "text-yellow-500 fill-current")}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
