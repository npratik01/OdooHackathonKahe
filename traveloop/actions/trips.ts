"use server";

import { revalidatePath } from "next/cache";
import { TripStatus } from "@prisma/client";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function listRecentTrips() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  return prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      destination: true,
      startDate: true,
      endDate: true,
    },
  });
}

export async function listUserTrips() {
  const user = await requireAuth();

  return prisma.trip.findMany({
    where: { userId: user.id },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      name: true,
      destination: true,
      startDate: true,
      endDate: true,
      status: true,
      _count: {
        select: {
          checklist: true,
          travelNotes: true,
        },
      },
    },
  });
}

export async function createTrip(data: {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}) {
  const user = await requireAuth();

  if (!data.name.trim()) throw new Error("Trip name is required");
  if (!data.destination.trim()) throw new Error("Destination is required");
  if (!data.startDate) throw new Error("Start date is required");
  if (!data.endDate) throw new Error("End date is required");

  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: data.name.trim(),
      destination: data.destination.trim(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: TripStatus.PLANNED,
    },
  });

  revalidatePath("/app/trips");
  return trip;
}

export async function getTripById(tripId: string) {
  const user = await requireAuth();

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: user.id },
    select: {
      id: true,
      name: true,
      destination: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });

  if (!trip) throw new Error("Trip not found");
  return trip;
}
