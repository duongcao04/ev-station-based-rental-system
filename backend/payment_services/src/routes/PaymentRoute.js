import express from "express";
import { createPayment } from "../controllers/PaymentController.js";
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router();

// POST /v1/api/payments
router.post("/", authenticate, authorize("renter"), createPayment);

export default router;
