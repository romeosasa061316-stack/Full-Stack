import prisma from "../config/prisma.js";

export const sendDepartureReminders = async () => {
  try {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    const candidateTrips = await prisma.trip.findMany({
      where: {
        status: "SCHEDULED",
        reminderSent: false,
      },
      include: { route: true },
    });

    for (const trip of candidateTrips) {
      const [hours, minutes] = trip.departureTime.split(":").map(Number);
      const departureDateTime = new Date(trip.departureDate);
      departureDateTime.setHours(hours, minutes, 0, 0);

      const isWithinFiveMinutes = departureDateTime > now && departureDateTime <= fiveMinutesFromNow;

      if (!isWithinFiveMinutes) {
        continue;
      }

      const confirmedBookings = await prisma.booking.findMany({
        where: { tripId: trip.id, status: "CONFIRMED" },
      });

      for (const booking of confirmedBookings) {
        await prisma.notification.create({
          data: {
            title: "Departure Reminder",
            message: `Your bus for ${trip.route.origin} ? ${trip.route.destination} departs at ${trip.departureTime}, in about 5 minutes. Seat ${booking.seatNumber}.`,
            userId: booking.userId,
          },
        });
      }

      await prisma.trip.update({
        where: { id: trip.id },
        data: { reminderSent: true },
      });

      console.log(`Departure reminders sent for trip ${trip.id} (${trip.route.origin} ? ${trip.route.destination} at ${trip.departureTime}), ${confirmedBookings.length} passenger(s) notified.`);
    }
  } catch (error) {
    console.error("Departure reminder job error:", error);
  }
};
