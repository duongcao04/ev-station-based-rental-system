import express from "express";
import paymentRoutes from "./PaymentRoute.js";

const router = express.Router();

router.use("/payments", paymentRoutes);

export default router;
