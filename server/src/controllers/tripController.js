import prisma from "../config/prisma.js";

export const createTrip = async (req, res) => {
  try {
    const { routeId, busId, departureDate, departureTime, fare } = req.body;

    if (!routeId || !busId || !departureDate || !departureTime || !fare) {
      return res.status(400).json({ message: "routeId, busId, departureDate, departureTime, and fare are required." });
    }

    const bus = await prisma.bus.findUnique({ where: { id: busId } });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    const route = await prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    const trip = await prisma.trip.create({
      data: {
        routeId,
        busId,
        departureDate: new Date(departureDate),
        departureTime,
        availableSeats: bus.capacity,
        fare,
      },
      include: { route: true, bus: true },
    });

    res.status(201).json({ message: "Trip created successfully.", trip });
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({ message: "Something went wrong creating the trip." });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: { route: true, bus: true },
    });
    res.status(200).json({ trips });
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ message: "Something went wrong fetching trips." });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { departureDate, departureTime, fare, status } = req.body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        departureDate: departureDate ? new Date(departureDate) : undefined,
        departureTime,
        fare,
        status,
      },
      include: { route: true, bus: true },
    });

    res.status(200).json({ message: "Trip updated successfully.", trip });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Trip not found." });
    }
    console.error("Update trip error:", error);
    res.status(500).json({ message: "Something went wrong updating the trip." });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.trip.delete({ where: { id } });

    res.status(200).json({ message: "Trip deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Trip not found." });
    }
    console.error("Delete trip error:", error);
    res.status(500).json({ message: "Something went wrong deleting the trip." });
  }
};
