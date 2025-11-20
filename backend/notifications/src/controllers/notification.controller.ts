import { Request, Response } from "express";
import { sendNotificationSchema } from "../validationSchemas/notification.schema";
import {
  sendNotificationService,
  getNotificationsByUserIdService,
  markNotificationAsReadService,
} from "../services/notification.service";

export const sendNotificationController = async (req: Request, res: Response) => {
  try {
    const validatedBody = await sendNotificationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await sendNotificationService(validatedBody);

    return res.json({
      success: true,
      notification: result.notification,
      fcm: result.fcm,
    });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    }

    console.error("sendNotificationController error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /notifications/:userId?limit=20&offset=0&onlyUnread=true
export const getNotificationsByUserIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const onlyUnread = req.query.onlyUnread === "true";

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const result = await getNotificationsByUserIdService({
      userId,
      limit,
      offset,
      onlyUnread,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("getNotificationsByUserIdController error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Optional: mark as read
// PATCH /notifications/:notificationId/read
export const markNotificationAsReadController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "notificationId is required",
      });
    }

    const updated = await markNotificationAsReadService(notificationId);

    return res.json({
      success: true,
      notification: updated,
    });
  } catch (err) {
    console.error("markNotificationAsReadController error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
