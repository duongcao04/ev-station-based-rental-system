import express from "express";
import { createPaymentMomo, handleMomoReturn, handleMomoNotify } from "../controllers/MoMoController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/momo", authenticate, authorize("renter"), createPaymentMomo);
router.get("/momo/return", handleMomoReturn);
router.post("/momo/notify", handleMomoNotify); 

export default router;

