import express from "express";
import {
  createBooking,
  checkin,
  returnVehicle,
  getBooking,
  myBookings,
  cancelBooking,
  getAllBookings,
} from "../controllers/BookingController.js";
import { authenticate, authorize, checkOwnership } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Renter routes
router.post("/", authorize('renter'), createBooking);
router.get("/me/history", authorize('renter'), myBookings);
router.put("/:id/cancel", authorize('renter'), cancelBooking);

// Staff routes - Specific routes first
router.put("/:id/checkin", authorize('staff', 'admin'), checkin);
router.put("/:id/return", authorize('staff', 'admin'), returnVehicle);
router.get("/all", authorize('staff', 'admin'), getAllBookings);

// Admin routes - Generic route last
router.get("/:id", authorize('renter', 'staff', 'admin'), getBooking);

export default router;
