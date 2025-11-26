import express from "express";
import { authorize, protectedRoute } from "../middlewares/authMiddleware.js";
import {
  createAccount,
  getAllRoles,
  getAllUsers,
  getUser,
  updateUserProfile,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protectedRoute, authorize("admin,staff"));

router.post("/create-account", createAccount);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id", updateUserProfile);
router.get("/roles", getAllRoles);

export default router;
