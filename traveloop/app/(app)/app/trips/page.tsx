<<<<<<< HEAD
import { listUserTrips } from "@/actions/trips";
import { TripsClient } from "@/components/trips/trips-client";

export const metadata = {
  title: "My Trips — Traveloop",
  description: "View and manage all your travel trips.",
};

export default async function TripsPage() {
  const trips = await listUserTrips();
=======
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTrips } from "@/actions/trips";
import { TripCard } from "@/components/trips/trip-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Trips | Traveloop",
};

async function TripsList() {
  const trips = await getTrips();

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
        <div className="bg-primary/5 flex h-16 w-16 items-center justify-center rounded-full text-3xl">
          🌍
        </div>
        <h3 className="mt-4 text-lg font-semibold">No trips planned yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Start your next adventure by creating a new trip. You can add stops, expenses, and travel notes later.
        </p>
        <Button asChild className="mt-6">
          <Link href="/app/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Trip
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
>>>>>>> 44267f479f2433a29123b499e50785e657bd0caf

  return (
<<<<<<< HEAD
    <TripsClient
      initialTrips={trips.map((t) => ({
        ...t,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
      }))}
    />
=======
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your past, present, and future adventures.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <TripsList />
      </Suspense>
    </div>
>>>>>>> 44267f479f2433a29123b499e50785e657bd0caf
  );
}
