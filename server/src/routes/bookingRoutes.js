import express from "express";
import { createBooking, getMyBookings, getBookedSeats } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/trip/:tripId/seats", protect, getBookedSeats);

export default router;
