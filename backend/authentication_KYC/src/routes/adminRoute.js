import express from "express";
import { authorize, protectedRoute } from "../middlewares/authMiddleware.js";
import { createAccount } from "../controllers/adminController.js";

const router = express.Router();

router.use(protectedRoute, authorize("admin"));

router.post("/create-account", createAccount);
// router.get('/users', getAllUsers);
// router.get('/users/:id', getUser)
// router.patch('/users/:id/role', updateUserRole)
// router.get('/roles', getAllRoles)

export default router;
