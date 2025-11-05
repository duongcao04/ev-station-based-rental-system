import express from "express";
import { createPayment, getPaymentById, getPaymentsByUser, updatePaymentStatus, refundPayment, confirmCashPayment } from "../controllers/PaymentController.js";
import { authenticate, authorize, checkOwnership } from "../middleware/auth.js"

const router = express.Router();

// POST /v1/api/payments
router.post("/", authenticate, authorize("renter"), createPayment);

// GET /v1/api/payments/:id
router.get("/:id", authenticate, authorize("renter", "staff", "admin"), getPaymentById);

// GET /v1/api/payments/user/:user_id
router.get("/user/:user_id", authenticate, authorize("renter", "staff", "admin"), checkOwnership, getPaymentsByUser);

// PUT /v1/api/payments/:id/status
router.put("/:id/status", authenticate, authorize("staff", "admin"), updatePaymentStatus);

// POST /v1/api/payments/:id/refund
router.post("/:id/refund", authenticate, authorize("staff", "admin"), refundPayment);

// POST /v1/api/payments/:id/cash/confirm
router.post("/:id/cash/confirm", authenticate, authorize("staff", "admin"), confirmCashPayment);

export default router;
