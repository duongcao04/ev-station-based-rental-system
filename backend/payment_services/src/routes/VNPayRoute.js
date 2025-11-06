import express from "express";
import { createPaymentVnpay, handleVnpayReturn } from "../controllers/VNPayController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/vnpay", authenticate, authorize("renter"), createPaymentVnpay);
router.get("/vnpay/return", handleVnpayReturn);

export default router;
