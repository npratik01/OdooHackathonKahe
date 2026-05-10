"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Trip, TripVisibility } from "@prisma/client";
import { createTrip, updateTrip, uploadImage } from "@/actions/trips";
import { cn } from "@/lib/utils";
import { TripFormData, TripSchema } from "@/lib/validations/trips";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TripFormProps {
  initialData?: Trip | null;
}

export function TripForm({ initialData }: TripFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<TripFormData>({
    resolver: zodResolver(TripSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      destination: initialData?.destination || "",
      description: initialData?.description || "",
      coverImage: initialData?.coverImage || "",
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(),
      visibility: initialData?.visibility || TripVisibility.PRIVATE,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(undefined);

    const formData = new FormData();
    formData.append("image", file);

    const res = await uploadImage(formData);
    
    if (res.error) {
      setError(res.error);
    } else if (res.url) {
      form.setValue("coverImage", res.url);
    }
    
    setIsUploading(false);
  };

  const onSubmit = async (values: TripFormData) => {
    setError(undefined);
    setSuccess(undefined);

    try {
      if (initialData) {
        const res = await updateTrip(initialData.id, values);
        if (res?.error) throw new Error(res.error);
      } else {
        await createTrip(values);
      }
      
      setSuccess(`Trip ${initialData ? "updated" : "created"} successfully!`);
      router.push("/app/trips");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const coverImage = form.watch("coverImage");

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Trip" : "Create a new trip"}</CardTitle>
        <CardDescription>
          {initialData ? "Update your trip details below." : "Start planning your next adventure."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            
            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="relative flex aspect-[21/9] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted/80">
                {coverImage ? (
                  <Image src={coverImage} alt="Cover preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-50" />
                    <span className="text-sm font-medium">Click to upload cover image</span>
                  </div>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleImageUpload}
                  disabled={isUploading || isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Trip Name</Label>
                <Input
                  id="name"
                  placeholder="Summer in Italy"
                  {...form.register("name")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.name && (
                  <p className="text-[10px] text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Rome, Italy"
                  {...form.register("destination")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.destination && (
                  <p className="text-[10px] text-destructive">{form.formState.errors.destination.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...form.register("startDate")}
                  disabled={isSubmitting}
                  defaultValue={initialData ? format(new Date(initialData.startDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                />
                {form.formState.errors.startDate && (
                  <p className="text-[10px] text-destructive">{form.formState.errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...form.register("endDate")}
                  disabled={isSubmitting}
                  defaultValue={initialData ? format(new Date(initialData.endDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                />
                {form.formState.errors.endDate && (
                  <p className="text-[10px] text-destructive">{form.formState.errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select 
                defaultValue={initialData?.visibility || TripVisibility.PRIVATE} 
                onValueChange={(val: string) => form.setValue("visibility", val as TripVisibility)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TripVisibility.PRIVATE}>Private (Only me)</SelectItem>
                  <SelectItem value={TripVisibility.PUBLIC}>Public (Shareable link)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.visibility && (
                <p className="text-[10px] text-destructive">{form.formState.errors.visibility.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of this trip..."
                className="min-h-[100px]"
                {...form.register("description")}
                disabled={isSubmitting}
              />
              {form.formState.errors.description && (
                <p className="text-[10px] text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create Trip"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
