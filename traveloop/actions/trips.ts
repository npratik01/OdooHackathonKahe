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
