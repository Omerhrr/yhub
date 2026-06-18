"use client";

import { Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusCard";
import { useNav } from "@/store/nav";
import { formatNaira, type Program } from "@/data/content";

export function ProgramCard({ program }: { program: Program }) {
  const { openModal } = useNav();
  const isUpcoming = program.status === "upcoming";
  const isCompleted = program.status === "completed";

  const secondaryLabel = isCompleted
    ? program.cohort ?? program.type ?? "—"
    : program.category;

  return (
    <Card className="flex flex-col">
      <div className="flex flex-col space-y-3 p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="cursor-pointer text-xl font-semibold tracking-tight hover:underline">
            {program.name}
          </h3>
          <StatusBadge
            label={isUpcoming ? "Upcoming" : "Completed"}
            variant={isUpcoming ? "yellow" : "green"}
          />
        </div>
        <p className="line-clamp-3 text-sm text-foreground">
          {program.description}
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{secondaryLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{program.duration}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="shrink-0 bg-border h-[1px] w-full" />
      </div>

      <div className="flex items-center justify-between p-6 pt-0 mt-auto">
        <p className="text-xl font-bold text-foreground">
          {formatNaira(program.price)}
        </p>
        <Button
          disabled={!program.enrollable}
          onClick={() =>
            openModal({ kind: "enroll", programId: program.id })
          }
          className={!program.enrollable ? "cursor-not-allowed opacity-60" : ""}
        >
          {program.enrollable ? "Enroll Now" : "Completed"}
        </Button>
      </div>
    </Card>
  );
}
