import { Suspense } from "react";
import { getAvailableCountries, searchDestinations } from "@/actions/discovery";
import { DestinationCard } from "@/components/discovery/destination-card";
import { DiscoverySearch } from "@/components/discovery/discovery-search";

export const metadata = {
  title: "Discover Destinations | Traveloop",
};

interface DiscoverPageProps {
  searchParams: Promise<{ q?: string; country?: string }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const country = params.country || "all";

  const [destinations, countries] = await Promise.all([
    searchDestinations(q, country),
    getAvailableCountries(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover Destinations</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Find your next adventure. Explore top-rated cities and popular attractions.
        </p>
      </div>

      <DiscoverySearch countries={countries} />

      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        {destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold">No destinations found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Try adjusting your search query or removing country filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
