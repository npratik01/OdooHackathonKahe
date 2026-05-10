"use client";

import Image from "next/image";
import { DollarSign, MapPin, Star } from "lucide-react";
import { DiscoveredActivity } from "@/lib/data/mock-discovery";
import { AddToItineraryModal } from "@/components/discovery/add-to-itinerary-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityCardProps {
  activity: DiscoveredActivity;
}

const typeColors: Record<string, string> = {
  TOUR: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  FOOD: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  TRANSPORT: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  LODGING: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  OTHER: "bg-muted text-muted-foreground",
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const priceString = Array(activity.priceLevel).fill("$").join("");

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-md transition-shadow">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={activity.imageUrl}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={typeColors[activity.type] || typeColors.OTHER}>
            {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold line-clamp-2">{activity.title}</h3>
          <div className="flex items-center gap-1 text-sm shrink-0 font-medium">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {activity.rating}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 truncate max-w-[200px]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </span>
          <span className="flex items-center text-foreground font-medium">
            {priceString}
          </span>
          <span>({activity.reviews.toLocaleString()} reviews)</span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 flex-1">
          {activity.description}
        </p>

        <div className="mt-4 pt-4 border-t">
          <AddToItineraryModal activity={activity} />
        </div>
      </CardContent>
    </Card>
  );
}
