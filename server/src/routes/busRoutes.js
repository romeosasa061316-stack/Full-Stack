import express from "express";
import { createBus, getAllBuses, updateBus, deleteBus } from "../controllers/busController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createBus);
router.get("/", protect, getAllBuses);
router.put("/:id", protect, adminOnly, updateBus);
router.delete("/:id", protect, adminOnly, deleteBus);

export default router;
