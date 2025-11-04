import express from "express";
import { protectedRoute, authorize } from "../middlewares/authMiddleware.js";
import { uploadKYCFiles } from "../middlewares/upload.js";
import {
  getKYCStatus,
  getKYCSubmissions,
  uploadKYC,
  verifyKYCSubmission,
} from "../controllers/kycController.js";

const router = express.Router();
router.use(protectedRoute);

//kyc of renter routes
router.post("/upload", authorize("renter"), uploadKYCFiles, uploadKYC);
router.get("/me", authorize("renter"), getKYCStatus);

//kyc of admin & staff routes
router.get("/submissions", authorize("staff", "admin"), getKYCSubmissions);
router.put(
  "/verify/:submissionId",
  authorize("staff", "admin"),
  verifyKYCSubmission
);

export default router;
