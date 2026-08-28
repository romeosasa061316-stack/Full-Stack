import prisma from "../config/prisma.js";

export const createBus = async (req, res) => {
  try {
    const { busNumber, registrationNumber, capacity } = req.body;

    if (!busNumber || !registrationNumber || !capacity) {
      return res.status(400).json({ message: "busNumber, registrationNumber, and capacity are required." });
    }

    const bus = await prisma.bus.create({
      data: { busNumber, registrationNumber, capacity },
    });

    res.status(201).json({ message: "Bus created successfully.", bus });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "A bus with this busNumber or registrationNumber already exists." });
    }
    console.error("Create bus error:", error);
    res.status(500).json({ message: "Something went wrong creating the bus." });
  }
};

export const getAllBuses = async (req, res) => {
  try {
    const buses = await prisma.bus.findMany();
    res.status(200).json({ buses });
  } catch (error) {
    console.error("Get buses error:", error);
    res.status(500).json({ message: "Something went wrong fetching buses." });
  }
};

export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { busNumber, registrationNumber, capacity, status } = req.body;

    const bus = await prisma.bus.update({
      where: { id },
      data: { busNumber, registrationNumber, capacity, status },
    });

    res.status(200).json({ message: "Bus updated successfully.", bus });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Bus not found." });
    }
    console.error("Update bus error:", error);
    res.status(500).json({ message: "Something went wrong updating the bus." });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.bus.delete({ where: { id } });

    res.status(200).json({ message: "Bus deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Bus not found." });
    }
    console.error("Delete bus error:", error);
    res.status(500).json({ message: "Something went wrong deleting the bus." });
  }
};
