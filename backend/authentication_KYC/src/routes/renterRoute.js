import express from "express";
import {
  getKYCStatus,
  getProfile,
  updateProfile,
  uploadKYC,
} from "../controllers/renterController.js";
import {
  authorize,
  checkOwnership,
  protectedRoute,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute, authorize("renter"));

router.get("/me", getProfile);
router.patch("/:id/update", checkOwnership, updateProfile);
router.post("/upload-kyc", uploadKYC);
router.get("/kyc-status", getKYCStatus);

export default router;
