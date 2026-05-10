"use server";

import { revalidatePath } from "next/cache";
import { TripVisibility } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function copyTrip(slug: string) {
  const user = await requireAuth();

  // 1. Fetch the public trip and all its contents
  const sourceTrip = await prisma.trip.findUnique({
    where: { slug, visibility: TripVisibility.PUBLIC },
    include: {
      stops: {
        include: {
          activities: true,
        },
      },
      checklist: true,
      travelNotes: {
        where: { visibility: "SHARED" },
      },
    },
  });

  if (!sourceTrip) throw new Error("Public trip not found");

  // 2. Create the new trip
  const newTrip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: `Copy of ${sourceTrip.name}`,
      destination: sourceTrip.destination,
      description: sourceTrip.description,
      coverImage: sourceTrip.coverImage,
      startDate: sourceTrip.startDate,
      endDate: sourceTrip.endDate,
      status: "DRAFT",
      visibility: "PRIVATE",
      budget: sourceTrip.budget,
    },
  });

  // 3. We need a map to map old stop IDs to new stop IDs
  // so that checklist items and notes can link to the right stop if needed.
  const stopIdMap = new Map<string, string>();

  for (const sourceStop of sourceTrip.stops) {
    const newStop = await prisma.tripStop.create({
      data: {
        tripId: newTrip.id,
        sortOrder: sourceStop.sortOrder,
        name: sourceStop.name,
        city: sourceStop.city,
        countryCode: sourceStop.countryCode,
        startDate: sourceStop.startDate,
        endDate: sourceStop.endDate,
      },
    });

    stopIdMap.set(sourceStop.id, newStop.id);

    // Create activities for this stop
    if (sourceStop.activities.length > 0) {
      await prisma.activity.createMany({
        data: sourceStop.activities.map((act) => ({
          tripStopId: newStop.id,
          title: act.title,
          type: act.type,
          startsAt: act.startsAt,
          endsAt: act.endsAt,
          location: act.location,
          linkUrl: act.linkUrl,
        })),
      });
    }
  }

  // 4. Copy Checklist Items
  if (sourceTrip.checklist.length > 0) {
    await prisma.checklistItem.createMany({
      data: sourceTrip.checklist.map((item) => ({
        tripId: newTrip.id,
        tripStopId: item.tripStopId ? stopIdMap.get(item.tripStopId) : null,
        title: item.title,
        category: item.category,
        isDone: false, // Reset done status for the new user
        dueDate: item.dueDate,
      })),
    });
  }

  // 5. Copy Travel Notes
  if (sourceTrip.travelNotes.length > 0) {
    await prisma.travelNote.createMany({
      data: sourceTrip.travelNotes.map((note) => ({
        authorId: user.id,
        tripId: newTrip.id,
        tripStopId: note.tripStopId ? stopIdMap.get(note.tripStopId) : null,
        title: note.title,
        content: note.content,
        visibility: "PRIVATE", // New notes are private by default
      })),
    });
  }

  revalidatePath("/app/trips");
  return newTrip;
}
