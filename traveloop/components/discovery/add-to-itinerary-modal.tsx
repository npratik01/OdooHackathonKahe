"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Trip } from "@prisma/client";
import { addActivity, getItinerary, TripStopWithActivities } from "@/actions/itinerary";
import { getTrips } from "@/actions/trips";
import { DiscoveredActivity } from "@/lib/data/mock-discovery";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddToItineraryModalProps {
  activity: DiscoveredActivity;
}

export function AddToItineraryModal({ activity }: AddToItineraryModalProps) {
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stops, setStops] = useState<TripStopWithActivities[]>([]);
  
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedStopId, setSelectedStopId] = useState<string>("");
  
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [isLoadingStops, setIsLoadingStops] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  useEffect(() => {
    if (open && trips.length === 0) {
      setIsLoadingTrips(true);
      getTrips().then((data) => {
        setTrips(data);
        setIsLoadingTrips(false);
      });
    }
  }, [open, trips.length]);

  useEffect(() => {
    if (selectedTripId) {
      setIsLoadingStops(true);
      setSelectedStopId("");
      getItinerary(selectedTripId).then((data) => {
        setStops(data);
        setIsLoadingStops(false);
      });
    }
  }, [selectedTripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    if (!selectedStopId) {
      setError("Please select a stop.");
      return;
    }

    setIsSubmitting(true);
    const res = await addActivity(selectedStopId, {
      title: activity.title,
      type: activity.type,
      location: activity.location,
      linkUrl: activity.linkUrl || "",
    });

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Successfully added to your itinerary!");
      setTimeout(() => {
        setOpen(false);
        setSuccess(undefined);
        setSelectedTripId("");
        setSelectedStopId("");
      }, 2000);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add to Itinerary
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Itinerary</DialogTitle>
          <DialogDescription>
            Select a trip and a destination stop to add "{activity.title}" to your plans.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Trip</Label>
            <Select
              disabled={isLoadingTrips || isSubmitting || !!success}
              value={selectedTripId}
              onValueChange={setSelectedTripId}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTrips ? "Loading trips..." : "Choose a trip"} />
              </SelectTrigger>
              <SelectContent>
                {trips.length === 0 && !isLoadingTrips ? (
                  <div className="p-2 text-sm text-muted-foreground">No trips found.</div>
                ) : (
                  trips.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Stop / Destination</Label>
            <Select
              disabled={!selectedTripId || isLoadingStops || isSubmitting || !!success}
              value={selectedStopId}
              onValueChange={setSelectedStopId}
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={
                    !selectedTripId ? "Select a trip first" : 
                    isLoadingStops ? "Loading stops..." : "Choose a stop"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {stops.length === 0 && !isLoadingStops ? (
                  <div className="p-2 text-sm text-muted-foreground">No stops in this trip.</div>
                ) : (
                  stops.map((stop) => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting || !!success}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedStopId || isSubmitting || !!success}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
