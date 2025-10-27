import { NextFunction, Request, Response } from "express";
import { ValidationError } from 'yup';
import notificationService from "../services/notification.service";
import { createNotificationSchema } from "../validationSchemas/notification.schema";

const sendNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedBody = await createNotificationSchema.validate(req.body, {
      abortEarly: false,
    });
    const result = await notificationService.create(validatedBody);

    res.status(201).json(result);

  } catch (error) {
    if (error instanceof ValidationError) {
      const errorMessage = error.errors.join(', ');
      return res.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: errorMessage,
      });
    }
    next(error);
  }
}

const notificationController = { sendNotification }
export default notificationController;