import express from "express";
import {
  changePassword,
  getProfile,
  getMyStationId,
  login,
  logout,
  refreshToken,
  register
} from "../controllers/authController.js";
import {
  checkOwnership,
  protectedRoute,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protectedRoute, getProfile);
router.get("/my-station-id", protectedRoute, getMyStationId);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.patch(
  "/:id/change-password",
  protectedRoute,
  checkOwnership,
  changePassword
);

export default router;
