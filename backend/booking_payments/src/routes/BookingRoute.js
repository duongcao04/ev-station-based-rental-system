import express from "express";
import {
  createBooking,
  checkin,
  returnVehicle,
  getBooking,
  myBookings,
  cancelBooking,
} from "../controllers/BookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/me/history", myBookings);
router.put("/:id/checkin", checkin);
router.put("/:id/return", returnVehicle);
router.put("/:id/cancel", cancelBooking);
router.get("/:id", getBooking);

export default router;
