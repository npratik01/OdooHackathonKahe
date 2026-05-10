"use server";

import { revalidatePath } from "next/cache";
import { Activity, TripStop } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import {
  ActivityFormData,
  ActivitySchema,
  TripStopFormData,
  TripStopSchema,
} from "@/lib/validations/itinerary";

export type TripStopWithActivities = TripStop & {
  activities: Activity[];
};

// ── Stops ───────────────────────────────────────────────────────────────────

export async function getItinerary(tripId: string): Promise<TripStopWithActivities[]> {
  if (!process.env.DATABASE_URL) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  // Ensure user owns trip
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== user.id) return [];

  return prisma.tripStop.findMany({
    where: { tripId },
    orderBy: { sortOrder: "asc" },
    include: {
      activities: {
        orderBy: { startsAt: "asc" },
      },
    },
  });
}

export async function addStop(
  tripId: string,
  data: TripStopFormData,
): Promise<{ success?: boolean; error?: string; stop?: TripStop }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = TripStopSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) return { error: "Trip not found or unauthorized" };

    // Get max sortOrder
    const lastStop = await prisma.tripStop.findFirst({
      where: { tripId },
      orderBy: { sortOrder: "desc" },
    });
    const nextSortOrder = lastStop ? lastStop.sortOrder + 1 : 0;

    const stop = await prisma.tripStop.create({
      data: {
        ...parsed.data,
        tripId,
        sortOrder: nextSortOrder,
      },
    });

    revalidatePath(`/app/trips/${tripId}`);
    return { success: true, stop };
  } catch (error) {
    console.error("Failed to add stop:", error);
    return { error: "Failed to add stop" };
  }
}

export async function updateStop(
  stopId: string,
  data: TripStopFormData,
): Promise<{ success?: boolean; error?: string; stop?: TripStop }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = TripStopSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });
    if (!stop || stop.trip.userId !== user.id) return { error: "Unauthorized" };

    const updated = await prisma.tripStop.update({
      where: { id: stopId },
      data: parsed.data,
    });

    revalidatePath(`/app/trips/${stop.tripId}`);
    return { success: true, stop: updated };
  } catch (error) {
    console.error("Failed to update stop:", error);
    return { error: "Failed to update stop" };
  }
}

export async function deleteStop(stopId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });
    if (!stop || stop.trip.userId !== user.id) return { error: "Unauthorized" };

    await prisma.tripStop.delete({ where: { id: stopId } });

    revalidatePath(`/app/trips/${stop.tripId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete stop:", error);
    return { error: "Failed to delete stop" };
  }
}

export async function reorderStops(
  tripId: string,
  stopIdsInOrder: string[],
): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) return { error: "Unauthorized" };

    // Use a transaction to update all sort orders
    await prisma.$transaction(
      stopIdsInOrder.map((id, index) =>
        prisma.tripStop.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    revalidatePath(`/app/trips/${tripId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder stops:", error);
    return { error: "Failed to reorder stops" };
  }
}

// ── Activities ──────────────────────────────────────────────────────────────

export async function addActivity(
  stopId: string,
  data: ActivityFormData,
): Promise<{ success?: boolean; error?: string; activity?: Activity }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = ActivitySchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });
    if (!stop || stop.trip.userId !== user.id) return { error: "Unauthorized" };

    const activity = await prisma.activity.create({
      data: {
        ...parsed.data,
        tripStopId: stopId,
      },
    });

    revalidatePath(`/app/trips/${stop.tripId}`);
    return { success: true, activity };
  } catch (error) {
    console.error("Failed to add activity:", error);
    return { error: "Failed to add activity" };
  }
}

export async function updateActivity(
  activityId: string,
  data: ActivityFormData,
): Promise<{ success?: boolean; error?: string; activity?: Activity }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = ActivitySchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { tripStop: { include: { trip: true } } },
    });
    if (!activity || activity.tripStop.trip.userId !== user.id) return { error: "Unauthorized" };

    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: parsed.data,
    });

    revalidatePath(`/app/trips/${activity.tripStop.tripId}`);
    return { success: true, activity: updated };
  } catch (error) {
    console.error("Failed to update activity:", error);
    return { error: "Failed to update activity" };
  }
}

export async function deleteActivity(activityId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { tripStop: { include: { trip: true } } },
    });
    if (!activity || activity.tripStop.trip.userId !== user.id) return { error: "Unauthorized" };

    await prisma.activity.delete({ where: { id: activityId } });

    revalidatePath(`/app/trips/${activity.tripStop.tripId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return { error: "Failed to delete activity" };
  }
}
