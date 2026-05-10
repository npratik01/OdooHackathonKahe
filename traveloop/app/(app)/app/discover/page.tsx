import { Suspense } from "react";
import { getAvailableCountries, searchDestinations } from "@/actions/discovery";
import { listPublicTrips } from "@/actions/share";
import { DestinationCard } from "@/components/discovery/destination-card";
import { DiscoverySearch } from "@/components/discovery/discovery-search";
import { CommunityTripCard } from "@/components/discovery/community-trip-card";

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

  const [destinations, countries, publicTrips] = await Promise.all([
    searchDestinations(q, country),
    getAvailableCountries(),
    listPublicTrips(),
  ]);

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Discover Destinations</h1>
        <p className="text-muted-foreground text-base">
          Find your next adventure. Explore top-rated cities and popular attractions.
        </p>
      </div>

      <DiscoverySearch countries={countries} />

      {/* Shared Community Trips Section */}
      {!q && country === "all" && publicTrips && publicTrips.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Community Shared Trips</h2>
            <p className="text-muted-foreground text-sm">
              Explore read-to-go itineraries shared by other travelers in the community. Clone them with a single click!
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {publicTrips.map((trip) => (
              <CommunityTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      )}

      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        {destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold">No destinations found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Try adjusting your search query or removing country filters to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {(q || country !== "all") && (
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Search Results</h2>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}
