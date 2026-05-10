"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical, Trash } from "lucide-react";
import { TripStopWithActivities, deleteStop } from "@/actions/itinerary";
import { useItineraryStore } from "@/store/itinerary-store";
import { ActivityCard } from "@/components/itinerary/activity-card";
import { AddActivityModal } from "@/components/itinerary/forms/add-activity-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StopCardProps {
  stop: TripStopWithActivities;
}

export function StopCard({ stop }: StopCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const [isDeleting, setIsDeleting] = useState(false);
  const removeStop = useItineraryStore((s) => s.removeStop);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleDelete = async () => {
    if (!confirm("Delete this stop and all its activities?")) return;
    setIsDeleting(true);
    const res = await deleteStop(stop.id);
    if (res.success) {
      removeStop(stop.id);
    }
    setIsDeleting(false);
  };

  const dateRange = stop.startDate && stop.endDate 
    ? `${format(new Date(stop.startDate), "MMM d")} – ${format(new Date(stop.endDate), "MMM d")}`
    : "Dates TBD";

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`group overflow-hidden transition-all duration-200 ${isDragging ? "shadow-xl ring-2 ring-primary ring-offset-2 opacity-90" : "shadow-sm"} ${isDeleting ? "opacity-50" : ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-muted/30 border-b">
        <div className="flex items-center gap-3">
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground -ml-1 p-1"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">{stop.name}</h3>
            <p className="text-xs text-muted-foreground">{dateRange}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete stop
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 bg-background space-y-3">
        {stop.activities.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-2 text-center border border-dashed rounded-lg">
            No activities planned yet.
          </p>
        ) : (
          <div className="space-y-2">
            {stop.activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} stopId={stop.id} />
            ))}
          </div>
        )}
        
        <AddActivityModal stopId={stop.id} />
      </CardContent>
    </Card>
  );
}
