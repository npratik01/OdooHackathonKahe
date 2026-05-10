"use client";

import { Calendar, MapPin, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { TripStatus } from "@prisma/client";
import type { RecentTrip } from "@/actions/dashboard";
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

// ── Status helpers ────────────────────────────────────────────────────────────

const statusConfig: Record<
  TripStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  PLANNED: {
    label: "Planned",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  BOOKED: {
    label: "Booked",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500",
  },
};

function formatDateRange(start: Date, end: Date): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en", opts)} – ${e.toLocaleDateString("en", { ...opts, year: "numeric" })}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface RecentTripsCardProps {
  trips: RecentTrip[];
}

export function RecentTripsCard({ trips }: RecentTripsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>Recent Trips</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/trips">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <span className="text-4xl">✈️</span>
            <p className="font-medium">No trips yet</p>
            <p className="text-muted-foreground text-sm">
              Create your first trip to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {trips.map((trip, i) => {
              const status = statusConfig[trip.status];
              return (
                <li
                  key={trip.id}
                  className="hover:bg-muted/50 group flex items-center gap-4 px-4 py-3 transition-colors"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Destination avatar */}
                  <div className="bg-primary/5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold">
                    {trip.destination.slice(0, 1)}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{trip.name}</p>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {trip.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={cn(
                      "hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium sm:block",
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>

                  {/* Action (accessible) */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Actions for ${trip.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentTripsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="p-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
