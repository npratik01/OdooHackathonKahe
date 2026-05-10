import { listUserTrips } from "@/actions/trips";
import { TripsClient } from "@/components/trips/trips-client";

export const metadata = {
  title: "My Trips — Traveloop",
  description: "View and manage all your travel trips.",
};

export default async function TripsPage() {
  const trips = await listUserTrips();

  return (
    <TripsClient
      initialTrips={trips.map((t) => ({
        ...t,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
      }))}
    />
  );
}
