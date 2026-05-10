"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderStops as reorderStopsAction } from "@/actions/itinerary";
import { useItineraryStore } from "@/store/itinerary-store";
import { StopCard } from "@/components/itinerary/stop-card";
import { AddStopModal } from "@/components/itinerary/forms/add-stop-modal";

interface StopListProps {
  tripId: string;
}

export function StopList({ tripId }: StopListProps) {
  const stops = useItineraryStore((s) => s.stops);
  const reorderStops = useItineraryStore((s) => s.reorderStops);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderStops(active.id as string, over.id as string);
      
      // We need to pass the updated order to the server
      const oldIndex = stops.findIndex((s) => s.id === active.id);
      const newIndex = stops.findIndex((s) => s.id === over.id);
      
      // Calculate the new order array
      const newStops = [...stops];
      const [movedItem] = newStops.splice(oldIndex, 1);
      newStops.splice(newIndex, 0, movedItem);
      
      const newOrderIds = newStops.map(s => s.id);
      
      // Fire and forget server action
      await reorderStopsAction(tripId, newOrderIds);
    }
  };

  if (stops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-xl">
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold">Your itinerary is empty</h3>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          Start building your trip by adding your first stop. You can add cities, hotels, or specific layovers.
        </p>
        <AddStopModal tripId={tripId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={stops.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 max-w-2xl mx-auto">
            {stops.map((stop) => (
              <StopCard key={stop.id} stop={stop} />
            ))}
            
            <div className="flex justify-center pt-4">
              <AddStopModal tripId={tripId} />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
