"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, CalendarDays, ChevronRight, Plus, NotebookText, CheckSquare, X } from "lucide-react";

import { createTrip } from "@/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TripStatus =
  | "DRAFT"
  | "PLANNED"
  | "BOOKED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

interface TripSummary {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  _count: { checklist: number; travelNotes: number };
}

interface TripsClientProps {
  initialTrips: TripSummary[];
}

const STATUS_STYLES: Record<TripStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PLANNED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  BOOKED:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  IN_PROGRESS:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  COMPLETED:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  CANCELLED: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
};

function formatDateRange(start: Date, end: Date) {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
      new Date(d),
    );
  return `${fmt(start)} → ${fmt(end)}`;
}

export function TripsClient({ initialTrips }: TripsClientProps) {
  const router = useRouter();
  const [trips] = useState<TripSummary[]>(initialTrips);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!form.name.trim() || !form.destination.trim() || !form.startDate || !form.endDate) {
      setFormError("All fields are required.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFormError("End date must be after start date.");
      return;
    }
    setFormError(null);

    startTransition(async () => {
      try {
        const trip = await createTrip(form);
        router.push(`/app/trips/${trip.id}?tab=checklist`);
      } catch (e) {
        setFormError(e instanceof Error ? e.message : "Failed to create trip.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Manage your trips, checklists, and travel notes.
          </p>
        </div>
        <Button id="new-trip-btn" onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Trip
        </Button>
      </div>

      {/* Create Trip Form */}
      {showCreate && (
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-medium">Create New Trip</p>
            <button
              onClick={() => setShowCreate(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Trip Name
              </label>
              <Input
                id="trip-name-input"
                placeholder="e.g. Summer in Japan"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Destination
              </label>
              <Input
                id="trip-destination-input"
                placeholder="e.g. Tokyo, Japan"
                value={form.destination}
                onChange={(e) =>
                  setForm((f) => ({ ...f, destination: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Start Date
              </label>
              <Input
                id="trip-start-date"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                End Date
              </label>
              <Input
                id="trip-end-date"
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          {formError && (
            <p className="mt-2 text-xs text-destructive">{formError}</p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              id="create-trip-submit"
              size="sm"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Creating…" : "Create Trip"}
            </Button>
          </div>
        </div>
      )}

      {/* Trips List */}
      {trips.length === 0 && !showCreate ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-5xl">✈️</span>
          <p className="mt-4 text-lg font-semibold">No trips yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Create your first trip to start planning!
          </p>
          <Button className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            Create a Trip
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/app/trips/${trip.id}?tab=checklist`}>
              <div className="group bg-card hover:border-primary/40 relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-200 hover:shadow-md">
                {/* Status badge */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      STATUS_STYLES[trip.status],
                    )}
                  >
                    {trip.status.replace("_", " ")}
                  </span>
                  <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>

                {/* Name & Destination */}
                <h3 className="truncate font-semibold">{trip.name}</h3>
                <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{trip.destination}</span>
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </span>
                </div>

                {/* Counters */}
                <div className="mt-4 flex items-center gap-3 border-t pt-3">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <CheckSquare className="h-3.5 w-3.5" />
                    {trip._count.checklist} items
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <NotebookText className="h-3.5 w-3.5" />
                    {trip._count.travelNotes} notes
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
