import { ActivityType } from "@prisma/client";
import { z } from "zod";

export const TripStopSchema = z.object({
  name: z.string().min(1, "Name is required").max(160, "Name is too long"),
  city: z.string().max(120).optional().nullable(),
  countryCode: z.string().max(2).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
});

export type TripStopFormData = z.infer<typeof TripStopSchema>;

export const ActivitySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  type: z.nativeEnum(ActivityType).default(ActivityType.OTHER),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  linkUrl: z.string().url("Must be a valid URL").max(2048).optional().nullable(),
});

export type ActivityFormData = z.infer<typeof ActivitySchema>;
