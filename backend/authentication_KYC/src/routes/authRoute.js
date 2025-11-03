import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/authController.js";
import { checkOwnership } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
//router.patch("/:id/change-password", checkOwnership, changePassword);

export default router;
