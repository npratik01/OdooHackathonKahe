"use server";

import { revalidatePath } from "next/cache";
import { TripVisibility } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const hash = Math.random().toString(36).substring(2, 8);
  return `${base}-${hash}`;
}

export async function publishTrip(tripId: string) {
  const user = await requireAuth();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true, name: true, slug: true },
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.userId !== user.id) throw new Error("Unauthorized");

  // Only generate a new slug if it doesn't already have one
  const slug = trip.slug || generateSlug(trip.name);

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: {
      visibility: TripVisibility.PUBLIC,
      slug,
    },
  });

  revalidatePath(`/app/trips/${tripId}`);
  revalidatePath("/app/discover");
  return updated;
}

export async function unpublishTrip(tripId: string) {
  const user = await requireAuth();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.userId !== user.id) throw new Error("Unauthorized");

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      visibility: TripVisibility.PRIVATE,
    },
  });

  revalidatePath(`/app/trips/${tripId}`);
  revalidatePath("/app/discover");
}

export async function getPublicTrip(slug: string) {
  const trip = await prisma.trip.findUnique({
    where: {
      slug,
      visibility: TripVisibility.PUBLIC,
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
      stops: {
        orderBy: { sortOrder: "asc" },
        include: {
          activities: {
            orderBy: { startsAt: "asc" },
          },
        },
      },
      travelNotes: {
        where: { visibility: "SHARED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return trip;
}

export async function listPublicTrips() {
  const user = await requireAuth();

  return prisma.trip.findMany({
    where: {
      visibility: TripVisibility.PUBLIC,
      // Optional: hide user's own trips from their discovery page, or keep it to see how it looks
      // Let's keep all public trips for a rich social feel, or we can filter it. Let's keep it!
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
      _count: {
        select: {
          stops: true,
          travelNotes: true,
        },
      },
    },
  });
}
