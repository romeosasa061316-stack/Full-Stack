import prisma from "../config/prisma.js";
import { generateBookingReference } from "../utils/bookingReference.js";
import { hasTripDeparted, findNextAvailableTrip } from "../utils/tripTimeHelpers.js";

export const createBooking = async (req, res) => {
  try {
    const { tripId, seatNumber } = req.body;
    const userId = req.user.userId;

    if (!tripId || !seatNumber) {
      return res.status(400).json({ message: "tripId and seatNumber are required." });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { route: true, bus: true },
    });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    if (trip.status !== "SCHEDULED") {
      return res.status(400).json({ message: `This trip is ${trip.status.toLowerCase()} and cannot be booked.` });
    }

    if (hasTripDeparted(trip)) {
      const nextTrip = await findNextAvailableTrip(prisma, trip);

      const missedBooking = await prisma.booking.create({
        data: {
          bookingReference: generateBookingReference(),
          seatNumber: null,
          userId,
          tripId,
          status: "MISSED",
        },
      });

      const missedMessage = nextTrip
        ? `You missed the ${trip.departureTime} ${trip.route.origin} -> ${trip.route.destination} departure. Would you like to book the next available bus at ${nextTrip.departureTime}?`
        : `You missed the ${trip.departureTime} ${trip.route.origin} -> ${trip.route.destination} departure, and no further trips are scheduled on this route today.`;

      await prisma.notification.create({
        data: {
          title: "Missed Departure",
          message: missedMessage,
          userId,
        },
      });

      return res.status(400).json({
        message: missedMessage,
        missed: true,
        missedBooking,
        nextAvailableTrip: nextTrip || null,
      });
    }

    if (trip.availableSeats <= 0) {
      return res.status(400).json({ message: "This trip is fully booked." });
    }

    if (seatNumber < 1 || seatNumber > trip.availableSeats + (await prisma.booking.count({ where: { tripId, status: "CONFIRMED" } }))) {
      return res.status(400).json({ message: "Invalid seat number for this trip." });
    }

    let booking;
    try {
      booking = await prisma.$transaction(async (tx) => {
        const newBooking = await tx.booking.create({
          data: {
            bookingReference: generateBookingReference(),
            seatNumber,
            userId,
            tripId,
          },
        });

        await tx.trip.update({
          where: { id: tripId },
          data: { availableSeats: { decrement: 1 } },
        });

        return newBooking;
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "This seat is already booked for this trip." });
      }
      throw error;
    }

    await prisma.notification.create({
      data: {
        title: "Booking Confirmed",
        message: `Your booking ${booking.bookingReference} for ${trip.route.origin} -> ${trip.route.destination} at ${trip.departureTime} is confirmed. Seat ${booking.seatNumber}.`,
        userId,
      },
    });

    res.status(201).json({ message: "Booking confirmed.", booking });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Something went wrong creating the booking." });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          include: { route: true, bus: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: "Something went wrong fetching your bookings." });
  }
};

export const getBookedSeats = async (req, res) => {
  try {
    const { tripId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: { tripId, status: "CONFIRMED" },
      select: { seatNumber: true },
    });

    const bookedSeatNumbers = bookings.map((b) => b.seatNumber);

    res.status(200).json({ bookedSeats: bookedSeatNumbers });
  } catch (error) {
    console.error("Get booked seats error:", error);
    res.status(500).json({ message: "Something went wrong fetching seat availability." });
  }
};
