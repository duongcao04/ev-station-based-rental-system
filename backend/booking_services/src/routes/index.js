import express from "express";
import bookingRoutes from "./BookingRoute.js";

const router = express.Router();

router.use("/bookings", bookingRoutes);

export default router;
