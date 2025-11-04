import express from "express";
import paymentRoutes from "./PaymentRoute.js";
import vnPayRoutes from "./VNPayRoute.js";
import momoRoutes from "./MoMoRoute.js";

const router = express.Router();

router.use("/v1/payments", paymentRoutes);
router.use("/v1/payments", vnPayRoutes);
router.use("/v1/payments", momoRoutes);

export default router;
