import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = "demo@traveloop.app";

  // Reset demo tenant (cascades cleanly through all child tables).
  await prisma.user
    .delete({ where: { email: demoEmail } })
    .catch(() => undefined);

  const user = await prisma.user.create({
    data: {
      email: demoEmail,
      name: "Traveloop Demo",
      image: null,
    },
  });

  await prisma.savedDestination.createMany({
    data: [
      {
        userId: user.id,
        name: "Paris",
        city: "Paris",
        countryCode: "FR",
        region: "Île-de-France",
        latitude: "48.856613",
        longitude: "2.352222",
      },
      {
        userId: user.id,
        name: "Lisbon",
        city: "Lisbon",
        countryCode: "PT",
        region: "Lisbon",
        latitude: "38.722252",
        longitude: "-9.139337",
      },
      {
        userId: user.id,
        name: "Tokyo",
        city: "Tokyo",
        countryCode: "JP",
        region: "Tokyo",
        latitude: "35.676200",
        longitude: "139.650300",
      },
    ],
  });

  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: "Spring Europe Sprint",
      destination: "France & Portugal",
      startDate: new Date("2026-06-03T00:00:00.000Z"),
      endDate: new Date("2026-06-12T00:00:00.000Z"),
      status: "PLANNED",
    },
  });

  const parisStop = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      sortOrder: 1,
      name: "Paris",
      city: "Paris",
      countryCode: "FR",
      startDate: new Date("2026-06-03T00:00:00.000Z"),
      endDate: new Date("2026-06-07T00:00:00.000Z"),
    },
  });

  const lisbonStop = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      sortOrder: 2,
      name: "Lisbon",
      city: "Lisbon",
      countryCode: "PT",
      startDate: new Date("2026-06-07T00:00:00.000Z"),
      endDate: new Date("2026-06-12T00:00:00.000Z"),
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        tripStopId: parisStop.id,
        title: "Louvre tickets",
        type: "TOUR",
        startsAt: new Date("2026-06-04T10:00:00.000Z"),
        endsAt: new Date("2026-06-04T13:00:00.000Z"),
        location: "Musée du Louvre",
        linkUrl: "https://www.louvre.fr/en",
      },
      {
        tripStopId: parisStop.id,
        title: "Seine sunset cruise",
        type: "TOUR",
        startsAt: new Date("2026-06-05T18:30:00.000Z"),
        endsAt: new Date("2026-06-05T20:00:00.000Z"),
        location: "Port de la Bourdonnais",
        linkUrl: null,
      },
      {
        tripStopId: lisbonStop.id,
        title: "Tram 28 route",
        type: "TRANSPORT",
        startsAt: new Date("2026-06-08T09:30:00.000Z"),
        endsAt: new Date("2026-06-08T11:00:00.000Z"),
        location: "Alfama",
        linkUrl: null,
      },
      {
        tripStopId: lisbonStop.id,
        title: "Pastéis tasting",
        type: "FOOD",
        startsAt: new Date("2026-06-09T14:00:00.000Z"),
        endsAt: new Date("2026-06-09T15:00:00.000Z"),
        location: "Belém",
        linkUrl: null,
      },
    ],
  });

  await prisma.checklistItem.createMany({
    data: [
      {
        tripId: trip.id,
        title: "Confirm accommodation",
        isDone: false,
        dueDate: new Date("2026-05-20T00:00:00.000Z"),
      },
      {
        tripId: trip.id,
        tripStopId: parisStop.id,
        title: "Book museum tickets",
        isDone: true,
        dueDate: new Date("2026-05-25T00:00:00.000Z"),
      },
      {
        tripId: trip.id,
        tripStopId: lisbonStop.id,
        title: "Reserve airport transfer",
        isDone: false,
        dueDate: new Date("2026-05-28T00:00:00.000Z"),
      },
    ],
  });

  await prisma.travelNote.createMany({
    data: [
      {
        authorId: user.id,
        tripId: trip.id,
        title: "Packing priorities",
        content:
          "Pack light layers. Bring universal adapter and a small daypack.",
        visibility: "PRIVATE",
      },
      {
        authorId: user.id,
        tripId: trip.id,
        tripStopId: parisStop.id,
        title: "Neighborhood picks",
        content: "Stay central; consider Le Marais for walkability and cafes.",
        visibility: "SHARED",
      },
    ],
  });

  await prisma.expense.createMany({
    data: [
      {
        userId: user.id,
        tripId: trip.id,
        tripStopId: parisStop.id,
        amount: "42.50",
        currency: "EUR",
        category: "FOOD",
        paymentMethod: "CARD",
        occurredAt: new Date("2026-06-04T19:15:00.000Z"),
        merchant: "Bistro demo",
        description: "Dinner for two",
      },
      {
        userId: user.id,
        tripId: trip.id,
        tripStopId: lisbonStop.id,
        amount: "18.20",
        currency: "EUR",
        category: "TRANSPORT",
        paymentMethod: "CARD",
        occurredAt: new Date("2026-06-08T10:00:00.000Z"),
        merchant: "Metro Lisboa",
        description: "Day pass",
      },
    ],
  });

  console.log("Seeded:", { userId: user.id, tripId: trip.id });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
