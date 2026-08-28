import express from "express";
import { createTrip, getAllTrips, updateTrip, deleteTrip } from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createTrip);
router.get("/", protect, getAllTrips);
router.put("/:id", protect, adminOnly, updateTrip);
router.delete("/:id", protect, adminOnly, deleteTrip);

export default router;
