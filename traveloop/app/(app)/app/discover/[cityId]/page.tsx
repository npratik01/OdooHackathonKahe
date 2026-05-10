import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, TrendingUp } from "lucide-react";
import { ActivityType } from "@prisma/client";
import { getActivitiesByDestination, getDestinationById } from "@/actions/discovery";
import { ActivityCard } from "@/components/discovery/activity-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Explore City | Traveloop",
};

interface CityExplorerPageProps {
  params: Promise<{ cityId: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function CityExplorerPage({ params, searchParams }: CityExplorerPageProps) {
  const { cityId } = await params;
  const sp = await searchParams;
  const category = sp.category || "all";

  const [destination, activities] = await Promise.all([
    getDestinationById(cityId),
    getActivitiesByDestination(cityId, category),
  ]);

  if (!destination) {
    notFound();
  }

  const categories = ["all", ...Object.values(ActivityType)];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-2xl h-[300px] sm:h-[400px]">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        
        <div className="absolute top-4 left-4 z-10">
          <Button asChild variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-md">
            <Link href="/app/discover">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10 max-w-3xl space-y-3">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90">
            <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
            Popularity Score: {destination.popularityScore}
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {destination.name}
          </h1>
          
          <div className="flex items-center gap-1.5 text-white/90 font-medium drop-shadow">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{destination.country}</span>
          </div>
          
          <p className="text-white/80 max-w-2xl leading-relaxed drop-shadow-sm line-clamp-2">
            {destination.description}
          </p>
        </div>
      </div>

      {/* Activities Explorer */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Top Activities</h2>
          
          <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2">
            {categories.map((cat) => {
              const isActive = category === cat;
              return (
                <Button
                  key={cat}
                  asChild
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="rounded-full whitespace-nowrap"
                >
                  <Link href={`/app/discover/${cityId}${cat !== "all" ? `?category=${cat}` : ""}`}>
                    {cat === "all" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-lg font-semibold">No activities found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Try exploring a different category for {destination.name}.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
