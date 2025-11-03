import express from "express";
import paymentRoutes from "./PaymentRoute.js";
import vnPayRoutes from "./VNPayRoute.js";

const router = express.Router();

router.use("/v1/payments", paymentRoutes);
router.use("/v1/payments", vnPayRoutes);

export default router;
