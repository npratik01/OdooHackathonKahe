import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { TripStopWithActivities } from "@/actions/itinerary";

interface ItineraryState {
  stops: TripStopWithActivities[];
  view: "list" | "calendar";
  
  // Actions
  setStops: (stops: TripStopWithActivities[]) => void;
  setView: (view: "list" | "calendar") => void;
  
  // Optimistic UI updates
  reorderStops: (activeId: string, overId: string) => void;
  addStop: (stop: TripStopWithActivities) => void;
  updateStop: (id: string, data: Partial<TripStopWithActivities>) => void;
  removeStop: (id: string) => void;
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  stops: [],
  view: "list",
  
  setStops: (stops) => set({ stops }),
  setView: (view) => set({ view }),
  
  reorderStops: (activeId, overId) => set((state) => {
    const oldIndex = state.stops.findIndex((s) => s.id === activeId);
    const newIndex = state.stops.findIndex((s) => s.id === overId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newStops = arrayMove(state.stops, oldIndex, newIndex);
      // Update sortOrder locally
      newStops.forEach((stop, index) => {
        stop.sortOrder = index;
      });
      return { stops: newStops };
    }
    return state;
  }),
  
  addStop: (stop) => set((state) => ({ stops: [...state.stops, stop] })),
  
  updateStop: (id, data) => set((state) => ({
    stops: state.stops.map((s) => s.id === id ? { ...s, ...data } : s)
  })),
  
  removeStop: (id) => set((state) => ({
    stops: state.stops.filter((s) => s.id !== id)
  })),
}));
