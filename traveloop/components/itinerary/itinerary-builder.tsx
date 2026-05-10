"use client";

import { useEffect } from "react";
import { CalendarIcon, ListIcon } from "lucide-react";
import { TripStopWithActivities } from "@/actions/itinerary";
import { useItineraryStore } from "@/store/itinerary-store";
import { CalendarView } from "@/components/itinerary/calendar-view";
import { StopList } from "@/components/itinerary/stop-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ItineraryBuilderProps {
  tripId: string;
  initialStops: TripStopWithActivities[];
}

export function ItineraryBuilder({ tripId, initialStops }: ItineraryBuilderProps) {
  const setStops = useItineraryStore((s) => s.setStops);
  const view = useItineraryStore((s) => s.view);
  const setView = useItineraryStore((s) => s.setView);

  // Initialize store with server data on mount
  useEffect(() => {
    setStops(initialStops);
  }, [initialStops, setStops]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Itinerary</h2>
          <p className="text-muted-foreground text-sm">
            Drag and drop to reorder stops. Add activities to build your schedule.
          </p>
        </div>

        <Tabs value={view} onValueChange={(v: string) => setView(v as "list" | "calendar")}>
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              <span className="hidden sm:inline">List View</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar View</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6">
        {view === "list" ? (
          <StopList tripId={tripId} />
        ) : (
          <CalendarView />
        )}
      </div>
    </div>
  );
}
