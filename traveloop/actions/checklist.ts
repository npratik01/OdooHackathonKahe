"use server";

import { revalidatePath } from "next/cache";
import { ChecklistCategory } from "@prisma/client";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

// ── Helpers ────────────────────────────────────────────────────────────────

async function verifyTripOwnership(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    select: { id: true },
  });
  if (!trip) throw new Error("Trip not found or access denied");
  return trip;
}

async function verifyItemOwnership(itemId: string, userId: string) {
  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, trip: { userId } },
    select: { id: true, tripId: true },
  });
  if (!item) throw new Error("Item not found or access denied");
  return item;
}

// ── Read ───────────────────────────────────────────────────────────────────

export async function getChecklistItems(tripId: string) {
  const user = await requireAuth();

  await verifyTripOwnership(tripId, user.id);

  const items = await prisma.checklistItem.findMany({
    where: { tripId },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      category: true,
      isDone: true,
      createdAt: true,
    },
  });

  return items;
}

// ── Create ─────────────────────────────────────────────────────────────────

export async function addChecklistItem(
  tripId: string,
  title: string,
  category: ChecklistCategory = ChecklistCategory.OTHER,
) {
  const user = await requireAuth();

  if (!title.trim()) throw new Error("Title is required");

  await verifyTripOwnership(tripId, user.id);

  const item = await prisma.checklistItem.create({
    data: { tripId, title: title.trim(), category, isDone: false },
  });

  revalidatePath(`/app/trips/${tripId}`);
  return item;
}

// ── Toggle packed state ───────────────────────────────────────────────────

export async function toggleChecklistItem(itemId: string, isDone: boolean) {
  const user = await requireAuth();

  const item = await verifyItemOwnership(itemId, user.id);

  await prisma.checklistItem.update({
    where: { id: itemId },
    data: { isDone },
  });

  revalidatePath(`/app/trips/${item.tripId}`);
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteChecklistItem(itemId: string) {
  const user = await requireAuth();

  const item = await verifyItemOwnership(itemId, user.id);

  await prisma.checklistItem.delete({ where: { id: itemId } });

  revalidatePath(`/app/trips/${item.tripId}`);
}

// ── Reset (unpack all) ─────────────────────────────────────────────────────

export async function resetChecklist(tripId: string) {
  const user = await requireAuth();

  await verifyTripOwnership(tripId, user.id);

  await prisma.checklistItem.updateMany({
    where: { tripId },
    data: { isDone: false },
  });

  revalidatePath(`/app/trips/${tripId}`);
}
