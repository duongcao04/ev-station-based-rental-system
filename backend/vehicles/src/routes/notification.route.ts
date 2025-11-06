import express from "express";
import notificationController from "../controllers/notification.controller";

const router = express.Router();
router.post("/send", notificationController.sendNotification);

export default router;
