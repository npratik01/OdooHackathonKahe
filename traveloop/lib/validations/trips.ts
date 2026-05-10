import { TripVisibility } from "@prisma/client";
import { z } from "zod";

export const TripSchema = z
  .object({
    name: z.string().min(1, "Trip name is required").max(160, "Name is too long"),
    destination: z.string().min(1, "Destination is required").max(160, "Destination is too long"),
    description: z.string().max(2000, "Description is too long").optional().nullable(),
    coverImage: z.string().url("Must be a valid URL").max(2048).optional().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    visibility: z.nativeEnum(TripVisibility).default(TripVisibility.PRIVATE),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be the same as or after start date",
    path: ["endDate"],
  });

export type TripFormData = z.infer<typeof TripSchema>;
