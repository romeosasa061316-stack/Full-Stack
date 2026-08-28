import express from "express";
import { createRoute, getAllRoutes, updateRoute, deleteRoute } from "../controllers/routeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createRoute);
router.get("/", protect, getAllRoutes);
router.put("/:id", protect, adminOnly, updateRoute);
router.delete("/:id", protect, adminOnly, deleteRoute);

export default router;
