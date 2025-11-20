import { Router } from "express";
import {
	sendNotificationController,
	getNotificationsByUserIdController,
	markNotificationAsReadController,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware"; // if you want auth

const router = Router();

// Send notification + push
router.post("/notifications/send", authMiddleware.authenticate, sendNotificationController);

// List notifications by userId
router.get(
	"/notifications/:userId",
	authMiddleware.authenticate,
	getNotificationsByUserIdController,
);

// Mark a notification as read
router.patch(
	"/notifications/:notificationId/read", authMiddleware.authenticate,
	markNotificationAsReadController,
);

export default router;
