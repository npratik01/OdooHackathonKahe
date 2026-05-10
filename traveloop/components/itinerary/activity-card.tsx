"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Clock, MapPin, MoreHorizontal, Trash } from "lucide-react";
import { Activity } from "@prisma/client";
import { deleteActivity } from "@/actions/itinerary";
import { useItineraryStore } from "@/store/itinerary-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActivityCardProps {
  activity: Activity;
  stopId: string;
}

const typeIcons: Record<string, string> = {
  FLIGHT: "✈️",
  LODGING: "🏨",
  TOUR: "📸",
  TRANSPORT: "🚂",
  FOOD: "🍽️",
  MEETING: "💼",
  OTHER: "📍",
};

export function ActivityCard({ activity, stopId }: ActivityCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const stops = useItineraryStore((s) => s.stops);
  const setStops = useItineraryStore((s) => s.setStops);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteActivity(activity.id);
    if (res.success) {
      const newStops = stops.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: stop.activities.filter((a) => a.id !== activity.id),
          };
        }
        return stop;
      });
      setStops(newStops);
    }
    setIsDeleting(false);
  };

  const startTime = activity.startsAt ? format(new Date(activity.startsAt), "h:mm a") : null;
  const icon = typeIcons[activity.type] || typeIcons.OTHER;

  return (
    <Card className={`group flex items-start gap-3 p-3 shadow-sm transition-opacity ${isDeleting ? "opacity-50" : ""}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{activity.title}</h4>
        
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {startTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {startTime}
            </span>
          )}
          {activity.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3" />
              {activity.location}
            </span>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
