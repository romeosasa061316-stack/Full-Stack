import prisma from "../config/prisma.js";

export const createRoute = async (req, res) => {
  try {
    const { origin, destination, distance, duration } = req.body;

    if (!origin || !destination || !distance || !duration) {
      return res.status(400).json({ message: "origin, destination, distance, and duration are required." });
    }

    const route = await prisma.route.create({
      data: { origin, destination, distance, duration },
    });

    res.status(201).json({ message: "Route created successfully.", route });
  } catch (error) {
    console.error("Create route error:", error);
    res.status(500).json({ message: "Something went wrong creating the route." });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    res.status(200).json({ routes });
  } catch (error) {
    console.error("Get routes error:", error);
    res.status(500).json({ message: "Something went wrong fetching routes." });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { origin, destination, distance, duration } = req.body;

    const route = await prisma.route.update({
      where: { id },
      data: { origin, destination, distance, duration },
    });

    res.status(200).json({ message: "Route updated successfully.", route });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Route not found." });
    }
    console.error("Update route error:", error);
    res.status(500).json({ message: "Something went wrong updating the route." });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.route.delete({ where: { id } });

    res.status(200).json({ message: "Route deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Route not found." });
    }
    console.error("Delete route error:", error);
    res.status(500).json({ message: "Something went wrong deleting the route." });
  }
};
