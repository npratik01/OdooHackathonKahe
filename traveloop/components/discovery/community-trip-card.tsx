"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, Compass, Copy, Loader2, Plane, MessageSquare, MapPinOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { copyTrip } from "@/actions/copy-trip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CommunityTripCardProps {
  trip: {
    id: string;
    name: string;
    destination: string;
    startDate: Date | string;
    endDate: Date | string;
    coverImage: string | null;
    slug: string | null;
    user: {
      name: string | null;
      image: string | null;
    } | null;
    _count: {
      stops: number;
      travelNotes: number;
    };
  };
}

export function CommunityTripCard({ trip }: CommunityTripCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const dateRange = `${format(new Date(trip.startDate), "MMM d")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`;

  function handleImport(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const slug = trip.slug;
    if (!slug) return;
 
    startTransition(async () => {
      try {
        setError(null);
        const cloned = await copyTrip(slug);
        router.push(`/app/trips/${cloned.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to import trip");
      }
    });
  }

  return (
    <div className="group relative h-[380px] w-full overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 bg-card border border-border/40">
      {/* Cover Image */}
      {trip.coverImage ? (
        <Image
          src={trip.coverImage}
          alt={trip.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 flex justify-center items-center">
          <Plane className="h-16 w-16 text-white/10" />
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      {/* Top Bar (Curator / Owner) */}
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-10">
        {trip.user && (
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {trip.user.image ? (
              <Image
                src={trip.user.image}
                alt={trip.user.name || "User"}
                width={20}
                height={20}
                className="rounded-full border border-white/40"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-white">
                {trip.user.name?.slice(0, 2).toUpperCase() || "TR"}
              </div>
            )}
            <span className="text-xs font-semibold text-white truncate max-w-[120px]">
              By {trip.user.name || "Explorer"}
            </span>
          </div>
        )}

        <div className="flex gap-1.5">
          <Badge className="bg-white/10 text-white backdrop-blur-md border border-white/10 text-[10px] py-0.5 px-2">
            <Compass className="h-3 w-3 mr-1" />
            {trip._count.stops} {trip._count.stops === 1 ? "Stop" : "Stops"}
          </Badge>
          {trip._count.travelNotes > 0 && (
            <Badge className="bg-white/10 text-white backdrop-blur-md border border-white/10 text-[10px] py-0.5 px-2">
              <MessageSquare className="h-3 w-3 mr-1" />
              {trip._count.travelNotes} Notes
            </Badge>
          )}
        </div>
      </div>

      {/* Bottom Information & Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end">
        <div className="flex items-center gap-1.5 text-accent font-medium text-xs mb-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{trip.destination}</span>
        </div>

        <h3 className="line-clamp-2 text-2xl font-bold text-white tracking-tight leading-snug mb-2 drop-shadow">
          {trip.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mb-5 bg-white/5 backdrop-blur-sm border border-white/5 w-fit px-2.5 py-1 rounded-md">
          <Calendar className="h-3.5 w-3.5" />
          <span>{dateRange}</span>
        </div>

        <div className="flex items-center gap-2 mt-2 w-full">
          <Link href={`/t/${trip.slug}`} target="_blank" className="flex-1">
            <Button variant="outline" className="w-full rounded-2xl h-11 border-white/20 text-white bg-black/20 hover:bg-white/10 hover:text-white transition-all text-sm font-semibold">
              View Itinerary
            </Button>
          </Link>

          <Button 
            disabled={isPending} 
            onClick={handleImport} 
            className="flex-1 rounded-2xl h-11 bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-semibold shadow-lg shadow-primary/25 border-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1.5" />
                Clone Trip
              </>
            )}
          </Button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}
