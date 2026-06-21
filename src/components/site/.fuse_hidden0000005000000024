"use client";

import { Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusCard";
import { useNav } from "@/store/nav";
import { formatNaira, type Program } from "@/data/content";
import { cn } from "@/lib/utils";

export function ProgramCard({
  program,
  onViewDetail,
}: {
  program: Program;
  onViewDetail?: () => void;
}) {
  const { openModal } = useNav();
  const isUpcoming = program.status === "upcoming";
  const isCompleted = program.status === "completed";
  const secondaryLabel = isCompleted ? program.cohort ?? program.type ?? "—" : program.category;

  return (
    <Card
      className="group flex flex-col overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      onClick={onViewDetail}
    >
      <div className={cn("h-1.5 w-full", isUpcoming ? "bg-gradient-to-r from-secondary to-primary" : "bg-gradient-to-r from-green-400 to-emerald-600")} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <StatusBadge label={isUpcoming ? "Upcoming" : "Completed"} variant={isUpcoming ? "yellow" : "green"} />
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{program.name}</h3>

        <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{program.description}</p>

        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-secondary" />
            <span className="truncate">{secondaryLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-secondary" />
            <span>{program.duration}</span>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-border" />

        <div className="mt-auto flex items-center justify-between">
          <p className="text-xl font-bold text-foreground">{formatNaira(program.price)}</p>
          <Button
            size="sm"
            disabled={!program.enrollable}
            onClick={(e) => { e.stopPropagation(); openModal({ kind: "enroll", programId: program.id }); }}
            className={cn("rounded-full px-5", !program.enrollable && "cursor-not-allowed opacity-50")}
          >
            {program.enrollable ? "Enroll Now" : "Completed"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
