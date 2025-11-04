import express from "express";
import { getProfile, updateProfile } from "../controllers/renterController.js";
import {
  authorize,
  checkOwnership,
  protectedRoute,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute, authorize("renter"));

router.get("/me", getProfile);
router.patch("/:id/update", checkOwnership, updateProfile);

export default router;
