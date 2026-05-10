"use client";

import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { TripStatus } from "@prisma/client";
import type { UpcomingTrip } from "@/actions/dashboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ── Helpers ───────────────────────────────────────────────────────────────────

function urgencyClass(daysUntil: number): string {
  if (daysUntil <= 7) return "border-l-red-400 bg-red-500/5";
  if (daysUntil <= 30) return "border-l-amber-400 bg-amber-500/5";
  return "border-l-blue-400 bg-blue-500/5";
}

function urgencyLabel(daysUntil: number): string {
  if (daysUntil === 0) return "Today!";
  if (daysUntil === 1) return "Tomorrow";
  if (daysUntil <= 7) return `${daysUntil}d away`;
  if (daysUntil <= 30) return `${daysUntil}d away`;
  return `${daysUntil}d away`;
}

function urgencyBadge(daysUntil: number): string {
  if (daysUntil <= 7)
    return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (daysUntil <= 30)
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusLabel: Record<TripStatus, string> = {
  DRAFT: "Draft",
  PLANNED: "Planned",
  BOOKED: "Booked",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// ── Component ─────────────────────────────────────────────────────────────────

interface UpcomingTripsCardProps {
  trips: UpcomingTrip[];
}

export function UpcomingTripsCard({ trips }: UpcomingTripsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>Upcoming Trips</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/trips">Plan a trip</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <span className="text-4xl">🗓️</span>
            <p className="font-medium">Nothing on the horizon</p>
            <p className="text-muted-foreground text-sm">
              Plan your next adventure.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {trips.map((trip, i) => (
              <li
                key={trip.id}
                className={cn(
                  "group flex items-center gap-4 border-l-4 px-4 py-3 transition-colors hover:bg-muted/30",
                  urgencyClass(trip.daysUntil),
                )}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {/* Days countdown */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-center",
                    urgencyBadge(trip.daysUntil),
                  )}
                >
                  <Clock className="mb-0.5 h-3.5 w-3.5" />
                  <span className="text-xs font-bold leading-none">
                    {urgencyLabel(trip.daysUntil)}
                  </span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{trip.name}</p>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    <span>
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {trip.destination} · {statusLabel[trip.status]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function UpcomingTripsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="p-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
