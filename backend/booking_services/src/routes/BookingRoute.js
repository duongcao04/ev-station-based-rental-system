import express from "express";
import {
  createBooking,
  checkin,
  returnVehicle,
  getBooking,
  myBookings,
  cancelBooking,
  getAllBookings,
  updateBookingPayment,
} from "../controllers/BookingController.js";
import { authenticate, authorize, checkOwnership, checkCheckinPermission, checkReturnPermission } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Renter routes
router.post("/", authorize('renter'), createBooking);
router.get("/me/history", authorize('renter'), myBookings);
router.put("/:id/cancel", authorize('renter'), checkOwnership, cancelBooking);
router.put("/:id/payment", authorize('renter', 'staff', 'admin'), checkOwnership, updateBookingPayment);

// Staff routes
router.put("/:id/checkin", authorize('staff', 'admin'), checkCheckinPermission, checkin);
router.put("/:id/return", authorize('staff', 'admin'), checkReturnPermission, returnVehicle);
router.get("/all", authorize('staff', 'admin'), getAllBookings);

// Admin routes
router.get("/:id", authorize('renter', 'staff', 'admin'), checkOwnership, getBooking);

export default router;
