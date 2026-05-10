"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { ActivityType } from "@prisma/client";
import { addActivity } from "@/actions/itinerary";
import { ActivityFormData, ActivitySchema } from "@/lib/validations/itinerary";
import { useItineraryStore } from "@/store/itinerary-store";
import { FormError } from "@/components/auth/form-error";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddActivityModalProps {
  stopId: string;
}

export function AddActivityModal({ stopId }: AddActivityModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const stops = useItineraryStore((s) => s.stops);
  const setStops = useItineraryStore((s) => s.setStops);

  const form = useForm<ActivityFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ActivitySchema) as any,
    defaultValues: {
      title: "",
      type: ActivityType.OTHER,
      location: "",
      linkUrl: "",
      startsAt: undefined,
      endsAt: undefined,
    },
  });

  const onSubmit = async (values: ActivityFormData) => {
    setError(undefined);
    const res = await addActivity(stopId, values);

    if (res.error) {
      setError(res.error);
    } else if (res.activity) {
      const newStops = stops.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: [...stop.activities, res.activity!],
          };
        }
        return stop;
      });
      setStops(newStops);
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground border border-dashed">
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            Add a flight, lodging, or tour to this stop.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title</Label>
            <Input
              id="title"
              placeholder="e.g. Visit Louvre Museum"
              {...form.register("title")}
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.title && (
              <p className="text-[10px] text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              defaultValue={ActivityType.OTHER} 
              onValueChange={(val: string) => form.setValue("type", val as ActivityType)}
              disabled={form.formState.isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ActivityType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Starts At</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                {...form.register("startsAt")}
                disabled={form.formState.isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endsAt">Ends At</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                {...form.register("endsAt")}
                disabled={form.formState.isSubmitting}
              />
            </div>
          </div>

          <FormError message={error} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save Activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
