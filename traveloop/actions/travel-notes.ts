"use server";

import { revalidatePath } from "next/cache";

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

async function verifyNoteOwnership(noteId: string, userId: string) {
  const note = await prisma.travelNote.findFirst({
    where: { id: noteId, authorId: userId },
    select: { id: true, tripId: true },
  });
  if (!note) throw new Error("Note not found or access denied");
  return note;
}

// ── Read ───────────────────────────────────────────────────────────────────

export async function getTravelNotes(tripId: string) {
  const user = await requireAuth();

  await verifyTripOwnership(tripId, user.id);

  return prisma.travelNote.findMany({
    where: { tripId, authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      visibility: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// ── Create ─────────────────────────────────────────────────────────────────

export async function createTravelNote(
  tripId: string,
  title: string,
  content: string,
) {
  const user = await requireAuth();

  if (!content.trim()) throw new Error("Content is required");

  await verifyTripOwnership(tripId, user.id);

  const note = await prisma.travelNote.create({
    data: {
      tripId,
      authorId: user.id,
      title: title.trim() || null,
      content,
    },
  });

  revalidatePath(`/app/trips/${tripId}`);
  return note;
}

// ── Update ─────────────────────────────────────────────────────────────────

export async function updateTravelNote(
  noteId: string,
  title: string,
  content: string,
) {
  const user = await requireAuth();

  if (!content.trim()) throw new Error("Content is required");

  const note = await verifyNoteOwnership(noteId, user.id);

  await prisma.travelNote.update({
    where: { id: noteId },
    data: { title: title.trim() || null, content },
  });

  revalidatePath(`/app/trips/${note.tripId}`);
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteTravelNote(noteId: string) {
  const user = await requireAuth();

  const note = await verifyNoteOwnership(noteId, user.id);

  await prisma.travelNote.delete({ where: { id: noteId } });

  revalidatePath(`/app/trips/${note.tripId}`);
}
