"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { addStop } from "@/actions/itinerary";
import { TripStopFormData, TripStopSchema } from "@/lib/validations/itinerary";
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

interface AddStopModalProps {
  tripId: string;
}

export function AddStopModal({ tripId }: AddStopModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const addStopToStore = useItineraryStore((s) => s.addStop);

  const form = useForm<TripStopFormData>({
    resolver: zodResolver(TripStopSchema) as any,
    defaultValues: {
      name: "",
      city: "",
      countryCode: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = async (values: TripStopFormData) => {
    setError(undefined);
    const res = await addStop(tripId, values);

    if (res.error) {
      setError(res.error);
    } else if (res.stop) {
      addStopToStore({ ...res.stop, activities: [] });
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Stop
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Stop</DialogTitle>
          <DialogDescription>
            Add a new destination or layover to your itinerary.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Stop Name</Label>
            <Input
              id="name"
              placeholder="e.g. Paris"
              {...form.register("name")}
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-[10px] text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
                disabled={form.formState.isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...form.register("endDate")}
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
              Save Stop
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
