"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";
import { useItineraryStore } from "@/store/itinerary-store";
import { Card, CardContent } from "@/components/ui/card";

export function CalendarView() {
  const stops = useItineraryStore((s) => s.stops);

  // Map stops and activities to calendar events
  const events = stops.flatMap((stop) => {
    const stopEvents = [];

    // Add a background event for the stop duration if dates exist
    if (stop.startDate && stop.endDate) {
      stopEvents.push({
        id: `stop-${stop.id}`,
        title: `📍 ${stop.name}`,
        start: format(new Date(stop.startDate), "yyyy-MM-dd"),
        end: format(new Date(stop.endDate), "yyyy-MM-dd"),
        allDay: true,
        display: "background",
        color: "#3b82f6",
      });
    }

    // Add individual activities
    const activityEvents = stop.activities.map((act) => ({
      id: `act-${act.id}`,
      title: `${act.title} ${act.location ? `(${act.location})` : ""}`,
      start: act.startsAt ? new Date(act.startsAt).toISOString() : undefined,
      end: act.endsAt ? new Date(act.endsAt).toISOString() : undefined,
      allDay: !act.startsAt,
      color: "#8b5cf6",
    })).filter(e => e.start); // Only render events with a start date

    return [...stopEvents, ...activityEvents];
  });

  return (
    <Card>
      <CardContent className="p-0 sm:p-4">
        {/* We use a wrapper to override some default fullcalendar styles to match shadcn */}
        <div className="fullcalendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            height="auto"
            contentHeight={600}
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            nowIndicator
            eventClassNames="rounded-md shadow-sm border-0"
            dayHeaderClassNames="bg-muted/50 border-border"
            slotLabelClassNames="text-muted-foreground text-xs"
            themeSystem="standard"
          />
        </div>
      </CardContent>
    </Card>
  );
}
