import { notFound } from "next/navigation";
import { getTripById } from "@/actions/trips";
import { TripForm } from "@/components/trips/trip-form";

export const metadata = {
  title: "Edit Trip | Traveloop",
};

interface EditTripPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Trip</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update the details for your trip to {trip.destination}.
        </p>
      </div>
      <TripForm initialData={trip} />
    </div>
  );
}
