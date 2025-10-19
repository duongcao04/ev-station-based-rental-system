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
router.put("/:id/checkin", checkin);
router.put("/:id/return", returnVehicle);
router.get("/:id", getBooking);
router.get("/me/history", myBookings);
router.put("/:id/cancel", cancelBooking);

export default router;
