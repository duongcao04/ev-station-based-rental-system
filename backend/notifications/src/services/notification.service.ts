import { PrismaClient, NotificationType } from "@prisma/client";
import { messaging } from "../helpers/firebase/config";
import { SendNotificationDto } from "../validationSchemas/notification.schema";
import * as admin from "firebase-admin";

const prisma = new PrismaClient();

export async function sendNotificationService(input: SendNotificationDto) {
  const { userId, title, message, type = "INFO", url, data } = input;

  // 1. Create notification record in DB
  const notification = await prisma.notification.create({
    data: {
      userId,
      title: title ?? null,
      message,
      type: type as NotificationType,
      url: url ?? null,
    },
  });

  // 2. Get user devices
  const devices = await prisma.userDevice.findMany({
    where: { userId },
  });

  const tokens = devices.map((d) => d.fcmToken).filter(Boolean);

  if (!tokens.length) {
    return {
      notification,
      fcm: {
        successCount: 0,
        failureCount: 0,
        message: "No FCM tokens for this user",
      },
    };
  }

  // 3. Build FCM message
  const messagePayload: admin.messaging.MulticastMessage = {
    tokens,
    notification: {
      title: title ?? "Notification",
      body: message,
    },
    data: (data ?? {}) as Record<string, string>,
  };

  // 4. Send via FCM
  const response = await messaging.sendEachForMulticast(messagePayload);

  // 5. Cleanup invalid tokens
  const tokensToDelete: string[] = [];
  response.responses.forEach((res, idx) => {
    if (!res.success) {
      const code = res.error?.code;
      if (
        code === "messaging/invalid-registration-token" ||
        code === "messaging/registration-token-not-registered"
      ) {
        tokensToDelete.push(tokens[idx]);
      }
    }
  });

  if (tokensToDelete.length) {
    await prisma.userDevice.deleteMany({
      where: {
        fcmToken: { in: tokensToDelete },
      },
    });
  }

  return {
    notification,
    fcm: {
      successCount: response.successCount,
      failureCount: response.failureCount,
      removedTokens: tokensToDelete,
    },
  };
}

export async function getNotificationsByUserIdService(options: {
  userId: string;
  limit?: number;
  offset?: number;
  onlyUnread?: boolean;
}) {
  const { userId, limit = 20, offset = 0, onlyUnread = false } = options;

  const where = {
    userId,
    ...(onlyUnread ? { isRead: false } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    items,
    total,
    limit,
    offset,
  };
}

// Optional: mark notification as read
export async function markNotificationAsReadService(notificationId: string) {
  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return updated;
}

export async function sendNotificationToAllUsers(
  title: string,
  message: string,
  type: NotificationType = "PROMOTION",
  url?: string
) {
  const devices = await prisma.userDevice.findMany({
    distinct: ["userId"],
  });
  const userIds = devices.map((d) => d.userId);

  const results = [];
  for (const userId of userIds) {
    const result = await sendNotificationService({
      userId,
      title,
      message,
      type: type,
      url,
    });
    results.push(result);
  }

  return results;
}
