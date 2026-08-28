import prisma from "../src/config/prisma.js";

async function main() {
  // 1. Create the 2 routes
  const masvingoRoute = await prisma.route.create({
    data: {
      origin: "Harare",
      destination: "Masvingo",
      distance: 292,
      duration: 240, // minutes
    },
  });

  const bulawayoRoute = await prisma.route.create({
    data: {
      origin: "Harare",
      destination: "Bulawayo",
      distance: 439,
      duration: 300, // minutes
    },
  });

  // 2. Create the 4 buses
  const bus1 = await prisma.bus.create({
    data: { busNumber: "BUS-01", registrationNumber: "AEX-1234", capacity: 60 },
  });
  const bus2 = await prisma.bus.create({
    data: { busNumber: "BUS-02", registrationNumber: "AEX-1235", capacity: 60 },
  });
  const bus3 = await prisma.bus.create({
    data: { busNumber: "BUS-03", registrationNumber: "AEX-1236", capacity: 60 },
  });
  const bus4 = await prisma.bus.create({
    data: { busNumber: "BUS-04", registrationNumber: "AEX-1237", capacity: 60 },
  });

  // 3. Create trips: each route gets an 08:00 and 12:00 departure
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.trip.create({
    data: {
      routeId: masvingoRoute.id,
      busId: bus1.id,
      departureDate: today,
      departureTime: "08:00",
      availableSeats: bus1.capacity,
      fare: 15.0,
    },
  });

  await prisma.trip.create({
    data: {
      routeId: masvingoRoute.id,
      busId: bus2.id,
      departureDate: today,
      departureTime: "12:00",
      availableSeats: bus2.capacity,
      fare: 15.0,
    },
  });

  await prisma.trip.create({
    data: {
      routeId: bulawayoRoute.id,
      busId: bus3.id,
      departureDate: today,
      departureTime: "08:00",
      availableSeats: bus3.capacity,
      fare: 20.0,
    },
  });

  await prisma.trip.create({
    data: {
      routeId: bulawayoRoute.id,
      busId: bus4.id,
      departureDate: today,
      departureTime: "12:00",
      availableSeats: bus4.capacity,
      fare: 20.0,
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });