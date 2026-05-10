"use server";
<<<<<<< HEAD

import { revalidatePath } from "next/cache";
import { TripStatus } from "@prisma/client";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
=======
>>>>>>> 44267f479f2433a29123b499e50785e657bd0caf

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { Trip, TripStatus, TripVisibility } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { TripFormData, TripSchema } from "@/lib/validations/trips";

// ── Upload Image ────────────────────────────────────────────────────────────

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const file = formData.get("image") as File;
    if (!file || !(file instanceof File)) return { error: "No file provided" };

    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File must be less than 5MB" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create unique filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${crypto.randomBytes(16).toString("hex")}${ext}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "trips");
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write file
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return { url: `/uploads/trips/${filename}` };
  } catch (error) {
    console.error("Failed to upload image:", error);
    return { error: "Failed to upload image" };
  }
}

// ── Trip Queries ────────────────────────────────────────────────────────────

export async function getTrips(): Promise<Trip[]> {
  if (!process.env.DATABASE_URL) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  return prisma.trip.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

<<<<<<< HEAD
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
=======
export async function getTripById(id: string): Promise<Trip | null> {
  if (!process.env.DATABASE_URL) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.trip.findUnique({
    where: { id, userId: user.id },
  });
}

// ── Trip Mutations ──────────────────────────────────────────────────────────

export async function createTrip(data: TripFormData): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = TripSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    await prisma.trip.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });

    revalidatePath("/app/trips");
    revalidatePath("/app");
    return { success: true };
  } catch (error) {
    console.error("Failed to create trip:", error);
    return { error: "Failed to create trip" };
  }
}

export async function updateTrip(id: string, data: TripFormData): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = TripSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    // Ensure user owns trip
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip || trip.userId !== user.id) return { error: "Trip not found or unauthorized" };

    await prisma.trip.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/app/trips");
    revalidatePath(`/app/trips/${id}`);
    revalidatePath("/app");
    return { success: true };
  } catch (error) {
    console.error("Failed to update trip:", error);
    return { error: "Failed to update trip" };
  }
}

export async function deleteTrip(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    // Ensure user owns trip
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip || trip.userId !== user.id) return { error: "Trip not found or unauthorized" };

    await prisma.trip.delete({ where: { id } });

    revalidatePath("/app/trips");
    revalidatePath("/app");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete trip:", error);
    return { error: "Failed to delete trip" };
  }
}

export async function duplicateTrip(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip || trip.userId !== user.id) return { error: "Trip not found or unauthorized" };

    await prisma.trip.create({
      data: {
        userId: user.id,
        name: `Copy of ${trip.name}`,
        destination: trip.destination,
        description: trip.description,
        coverImage: trip.coverImage,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: "DRAFT",
        visibility: "PRIVATE",
      },
    });

    revalidatePath("/app/trips");
    return { success: true };
  } catch (error) {
    console.error("Failed to duplicate trip:", error);
    return { error: "Failed to duplicate trip" };
  }
>>>>>>> 44267f479f2433a29123b499e50785e657bd0caf
}
