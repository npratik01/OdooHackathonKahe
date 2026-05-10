"use client";

import { Bookmark, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Destination = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  tag: string;
  tagColor: string;
  rating: number;
  bestTime: string;
  emoji: string;
};

const DESTINATIONS: Destination[] = [
  { id: "1", name: "Santorini", country: "Greece", countryCode: "GR", tag: "Romantic", tagColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400", rating: 4.9, bestTime: "May–Sep", emoji: "🏛️" },
  { id: "2", name: "Kyoto", country: "Japan", countryCode: "JP", tag: "Culture", tagColor: "bg-red-500/10 text-red-600 dark:text-red-400", rating: 4.8, bestTime: "Mar–May", emoji: "⛩️" },
  { id: "3", name: "Banff", country: "Canada", countryCode: "CA", tag: "Nature", tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", rating: 4.9, bestTime: "Jun–Sep", emoji: "🏔️" },
  { id: "4", name: "Lisbon", country: "Portugal", countryCode: "PT", tag: "City Break", tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400", rating: 4.7, bestTime: "Apr–Oct", emoji: "🏙️" },
  { id: "5", name: "Maldives", country: "Maldives", countryCode: "MV", tag: "Beach", tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400", rating: 4.9, bestTime: "Nov–Apr", emoji: "🌊" },
  { id: "6", name: "Marrakech", country: "Morocco", countryCode: "MA", tag: "Adventure", tagColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400", rating: 4.6, bestTime: "Oct–Apr", emoji: "🕌" },
];

export function RecommendedDestinationsCard() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>Recommended Destinations</CardTitle>
        <CardAction>
          <Link href="/app/trips" className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline">
            Explore all
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {DESTINATIONS.map((dest, i) => (
            <div
              key={dest.id}
              className="group bg-muted/40 hover:bg-muted/80 relative flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Emoji avatar */}
              <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl shadow-sm">
                {dest.emoji}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{dest.name}</p>
                <p className="text-muted-foreground text-xs">{dest.country}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", dest.tagColor)}>
                    {dest.tag}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-0.5 text-[10px]">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    {dest.rating}
                  </span>
                </div>
              </div>

              {/* Bookmark */}
              <button
                aria-label={`Save ${dest.name}`}
                className="text-muted-foreground hover:text-foreground shrink-0 opacity-0 transition-all group-hover:opacity-100"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
