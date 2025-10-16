import express from "express";
import {
  createBooking,
  checkin,
  returnVehicle,
  getBooking,
  myBookings,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);              
router.put("/:id/checkin", checkin);          
router.put("/:id/return", returnVehicle);     
router.get("/:id", getBooking);              
router.get("/me/history", myBookings);        

export default router;
