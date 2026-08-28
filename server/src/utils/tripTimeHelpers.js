export const hasTripDeparted = (trip) => {
  const now = new Date();

  const [hours, minutes] = trip.departureTime.split(":").map(Number);

  const departureDateTime = new Date(trip.departureDate);
  departureDateTime.setHours(hours, minutes, 0, 0);

  return now > departureDateTime;
};

export const findNextAvailableTrip = async (prisma, currentTrip) => {
  const nextTrip = await prisma.trip.findFirst({
    where: {
      routeId: currentTrip.routeId,
      status: "SCHEDULED",
      id: { not: currentTrip.id },
      OR: [
        {
          departureDate: currentTrip.departureDate,
          departureTime: { gt: currentTrip.departureTime },
        },
        {
          departureDate: { gt: currentTrip.departureDate },
        },
      ],
    },
    orderBy: [
      { departureDate: "asc" },
      { departureTime: "asc" },
    ],
    include: { route: true, bus: true },
  });

  return nextTrip;
};
