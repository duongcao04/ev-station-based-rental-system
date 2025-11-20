import express from "express";
import deviceRoutes from "../routes/device.route";
import notificationRoutes from "../routes/notification.route";

const router = express.Router();

router.use("/v1/notifications", notificationRoutes);
router.use("/v1/devices", deviceRoutes);

export default router;
