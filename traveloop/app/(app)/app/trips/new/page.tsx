import { TripForm } from "@/components/trips/trip-form";

export const metadata = {
  title: "Create Trip | Traveloop",
};

export default function NewTripPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Trip</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Plan your next adventure by adding some basic details.
        </p>
      </div>
      <TripForm />
    </div>
  );
}
