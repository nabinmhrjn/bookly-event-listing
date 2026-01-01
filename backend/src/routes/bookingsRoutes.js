import express from "express";
import { createBooking, getAllBookings, getBookingById, getUserBookings, cancelBooking } from "../controllers/bookingsControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

// all routes are protected (require authentication)
router.use(validateToken);

// create a new booking
router.post("/", createBooking);

// get all bookings for the authenticated user
router.get("/user", getUserBookings);

// get a specific booking by ID
router.get("/:id", getBookingById);

// get all bookings (admin only - you can add admin middleware later)
router.get("/", getAllBookings);

// cancel a booking
router.patch("/:id/cancel", cancelBooking);

export default router;
