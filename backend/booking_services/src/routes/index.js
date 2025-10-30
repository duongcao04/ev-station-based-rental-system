import express from "express";
import bookingRoutes from "./BookingRoute.js";

const router = express.Router();

router.use("/v1/bookings", bookingRoutes);

export default router;
