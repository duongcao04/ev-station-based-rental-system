import express from "express";
import paymentRoutes from "./PaymentRoute.js";

const router = express.Router();

router.use("/v1/payments", paymentRoutes);

export default router;
