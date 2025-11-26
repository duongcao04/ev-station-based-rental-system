import { Router } from "express";
import deviceRoutes from "../routes/device.route";
import notificationRoutes from "../routes/notification.route";
import cronRoutes from "./cron.routes";

const router = Router();

router.use("/v1/notifications", notificationRoutes);
router.use("/v1/devices", deviceRoutes);
router.use("/v1/cron", cronRoutes);

export { router as rootRouter };
