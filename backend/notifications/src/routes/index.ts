import express from "express";
import notificationRoutes from "../routes/notification.route";

const router = express.Router();

router.use("/v1/notifications", notificationRoutes);

export default router;
