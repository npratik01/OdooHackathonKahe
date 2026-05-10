"use server";

import { TripStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DashboardStats = {
  totalTrips: number;
  upcomingTrips: number;
  totalExpenses: number;
  savedDestinations: number;
  tripsChange: number; // % change vs last 30 days
  expensesChange: number;
};

export type RecentTrip = {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  stopCount: number;
};

export type UpcomingTrip = {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  daysUntil: number;
};

export type MonthlyExpense = {
  month: string;
  amount: number;
};

export type BudgetCategory = {
  category: string;
  amount: number;
  color: string;
};

export type TripStatusBreakdown = {
  status: TripStatus;
  count: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  if (!process.env.DATABASE_URL) return null;
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const userId = await getUserId();

  if (!userId) {
    // Return rich demo data when DB isn't connected
    return {
      totalTrips: 12,
      upcomingTrips: 3,
      totalExpenses: 4280.5,
      savedDestinations: 8,
      tripsChange: 20,
      expensesChange: -8,
    };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalTrips,
    upcomingTrips,
    expenses,
    savedDestinations,
    recentTrips,
    prevTrips,
  ] = await Promise.all([
    prisma.trip.count({ where: { userId } }),
    prisma.trip.count({
      where: { userId, startDate: { gte: now }, status: { not: "CANCELLED" } },
    }),
    prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.savedDestination.count({ where: { userId } }),
    prisma.trip.count({ where: { userId, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.trip.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          lt: thirtyDaysAgo,
        },
      },
    }),
  ]);

  const totalExpenses = Number(expenses._sum.amount ?? 0);
  const tripsChange =
    prevTrips > 0
      ? Math.round(((recentTrips - prevTrips) / prevTrips) * 100)
      : recentTrips > 0
        ? 100
        : 0;

  return {
    totalTrips,
    upcomingTrips,
    totalExpenses,
    savedDestinations,
    tripsChange,
    expensesChange: -8, // placeholder – implement with real period comparison
  };
}

export async function getRecentTrips(): Promise<RecentTrip[]> {
  const userId = await getUserId();

  if (!userId) {
    return [
      {
        id: "1",
        name: "Spring Europe Sprint",
        destination: "France & Portugal",
        startDate: new Date("2026-06-03"),
        endDate: new Date("2026-06-12"),
        status: "PLANNED",
        stopCount: 2,
      },
      {
        id: "2",
        name: "Tokyo Tech Summit",
        destination: "Japan",
        startDate: new Date("2026-04-10"),
        endDate: new Date("2026-04-18"),
        status: "COMPLETED",
        stopCount: 3,
      },
      {
        id: "3",
        name: "Bali Recharge",
        destination: "Indonesia",
        startDate: new Date("2026-02-14"),
        endDate: new Date("2026-02-24"),
        status: "COMPLETED",
        stopCount: 1,
      },
      {
        id: "4",
        name: "NYC Winter Meetup",
        destination: "USA",
        startDate: new Date("2026-01-20"),
        endDate: new Date("2026-01-23"),
        status: "COMPLETED",
        stopCount: 1,
      },
    ];
  }

  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      destination: true,
      startDate: true,
      endDate: true,
      status: true,
      _count: { select: { stops: true } },
    },
  });

  return trips.map((t) => ({
    id: t.id,
    name: t.name,
    destination: t.destination,
    startDate: t.startDate,
    endDate: t.endDate,
    status: t.status,
    stopCount: t._count.stops,
  }));
}

export async function getUpcomingTrips(): Promise<UpcomingTrip[]> {
  const userId = await getUserId();
  const now = new Date();

  if (!userId) {
    return [
      {
        id: "1",
        name: "Spring Europe Sprint",
        destination: "France & Portugal",
        startDate: new Date("2026-06-03"),
        endDate: new Date("2026-06-12"),
        status: "PLANNED",
        daysUntil: 24,
      },
      {
        id: "5",
        name: "Maldives Escape",
        destination: "Maldives",
        startDate: new Date("2026-07-15"),
        endDate: new Date("2026-07-25"),
        status: "DRAFT",
        daysUntil: 66,
      },
      {
        id: "6",
        name: "Iceland Northern Lights",
        destination: "Iceland",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-09-10"),
        status: "DRAFT",
        daysUntil: 114,
      },
    ];
  }

  const trips = await prisma.trip.findMany({
    where: { userId, startDate: { gte: now }, status: { not: "CANCELLED" } },
    orderBy: { startDate: "asc" },
    take: 4,
    select: {
      id: true,
      name: true,
      destination: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });

  return trips.map((t) => ({
    ...t,
    daysUntil: Math.ceil(
      (t.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    ),
  }));
}

export async function getMonthlyExpenses(): Promise<MonthlyExpense[]> {
  const userId = await getUserId();

  // Always return 6 months of demo data (real query would group by month)
  const demoData: MonthlyExpense[] = [
    { month: "Dec", amount: 820 },
    { month: "Jan", amount: 1240 },
    { month: "Feb", amount: 980 },
    { month: "Mar", amount: 560 },
    { month: "Apr", amount: 1480 },
    { month: "May", amount: 2100 },
  ];

  if (!userId) return demoData;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const expenses = await prisma.expense.findMany({
    where: { userId, occurredAt: { gte: sixMonthsAgo } },
    select: { amount: true, occurredAt: true },
    orderBy: { occurredAt: "asc" },
  });

  if (expenses.length === 0) return demoData;

  // Group by month
  const grouped: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.occurredAt.toLocaleString("en", {
      month: "short",
      timeZone: "UTC",
    });
    grouped[key] = (grouped[key] ?? 0) + Number(e.amount);
  });

  return Object.entries(grouped).map(([month, amount]) => ({ month, amount }));
}

export async function getBudgetByCategory(): Promise<BudgetCategory[]> {
  const userId = await getUserId();

  const colors: Record<string, string> = {
    TRANSPORT: "#3b82f6",
    LODGING: "#8b5cf6",
    FOOD: "#f59e0b",
    ACTIVITIES: "#10b981",
    GEAR: "#ec4899",
    FEES: "#6366f1",
    OTHER: "#94a3b8",
  };

  const demoData: BudgetCategory[] = [
    { category: "Transport", amount: 1240, color: colors.TRANSPORT },
    { category: "Lodging", amount: 980, color: colors.LODGING },
    { category: "Food", amount: 640, color: colors.FOOD },
    { category: "Activities", amount: 820, color: colors.ACTIVITIES },
    { category: "Gear", amount: 380, color: colors.GEAR },
    { category: "Other", amount: 220, color: colors.OTHER },
  ];

  if (!userId) return demoData;

  const raw = await prisma.expense.groupBy({
    by: ["category"],
    where: { userId },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  if (raw.length === 0) return demoData;

  return raw.map((r) => ({
    category:
      r.category.charAt(0) + r.category.slice(1).toLowerCase().replace("_", " "),
    amount: Number(r._sum.amount ?? 0),
    color: colors[r.category] ?? colors.OTHER,
  }));
}
