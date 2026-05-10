"use server";

import { revalidatePath } from "next/cache";
import { Expense } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { BudgetFormData, BudgetSchema, ExpenseFormData, ExpenseSchema } from "@/lib/validations/finances";

export async function getExpenses(tripId: string): Promise<Expense[]> {
  if (!process.env.DATABASE_URL) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== user.id) return [];

  return prisma.expense.findMany({
    where: { tripId },
    orderBy: { occurredAt: "desc" },
    include: { tripStop: true },
  });
}

export async function addExpense(
  tripId: string,
  data: ExpenseFormData
): Promise<{ success?: boolean; error?: string; expense?: Expense }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = ExpenseSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) return { error: "Trip not found or unauthorized" };

    const expense = await prisma.expense.create({
      data: {
        ...parsed.data,
        tripId,
        userId: user.id,
      },
    });

    revalidatePath(`/app/trips/${tripId}`);
    return { success: true, expense };
  } catch (error) {
    console.error("Failed to add expense:", error);
    return { error: "Failed to add expense" };
  }
}

export async function deleteExpense(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.userId !== user.id) return { error: "Unauthorized" };

    await prisma.expense.delete({ where: { id } });

    revalidatePath(`/app/trips/${expense.tripId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete expense:", error);
    return { error: "Failed to delete expense" };
  }
}

export async function updateTripBudget(
  tripId: string,
  data: BudgetFormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = BudgetSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid data" };

    if (!process.env.DATABASE_URL) return { error: "Database not connected" };

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== user.id) return { error: "Unauthorized" };

    await prisma.trip.update({
      where: { id: tripId },
      data: { budget: parsed.data.budget },
    });

    revalidatePath(`/app/trips/${tripId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update budget:", error);
    return { error: "Failed to update budget" };
  }
}
