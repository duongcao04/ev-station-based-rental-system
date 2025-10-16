import express from "express";
import bookingRoutes from "./booking.routes.js";

const router = express.Router();

router.use("/bookings", bookingRoutes);

export default (app) => app.use("/v1/api", router);
