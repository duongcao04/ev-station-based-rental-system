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
    where: { 
      userId,
      fcmToken: { not: undefined } // Chỉ lấy devices có token
    },
  });

  const tokens = devices.map((d) => d.fcmToken).filter(Boolean) as string[];

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

  // 3. Build data payload (tất cả values phải là string)
  const dataPayload: Record<string, string> = {
    notificationId: notification.id.toString(),
    type: type,
    timestamp: new Date().toISOString(),
    ...(url && { url }), // Thêm URL để handle click
    ...(data && Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = String(value); // Convert tất cả về string
      return acc;
    }, {} as Record<string, string>))
  };

  // 4. Build FCM message
  const messagePayload: admin.messaging.MulticastMessage = {
    tokens,
    notification: {
      title: title || "Thông báo", // Fallback nếu title null
      body: message,
    },
    data: dataPayload,
    // Android options
    android: {
      priority: "high",
      notification: {
        icon: "notification_icon", // Icon trong res/drawable
        color: "#4F46E5", // Màu notification
        sound: "default",
        tag: `notification_${notification.id}`, // Tránh duplicate
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
      },
    },
    // iOS options
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
    // Web options
    webpush: {
      notification: {
        icon: "/favicon.ico", // Icon cho web
        badge: "/favicon.ico",
        tag: `notification_${notification.id}`,
        requireInteraction: false,
        ...(url && { 
          data: { url } // URL để mở khi click
        })
      },
      fcmOptions: {
        link: url || "/", // URL fallback
      },
    },
  };

  // 5. Send via FCM với error handling
  let response: admin.messaging.BatchResponse;
  try {
    response = await messaging.sendEachForMulticast(messagePayload);
  } catch (error) {
    console.error("FCM send error:", error);
    return {
      notification,
      fcm: {
        successCount: 0,
        failureCount: tokens.length,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }

  // 6. Cleanup invalid tokens
  const tokensToDelete: string[] = [];
  const failedTokenDetails: Array<{ token: string; error: string }> = [];

  response.responses.forEach((res, idx) => {
    if (!res.success && res.error) {
      const code = res.error.code;
      const token = tokens[idx];

      // Log chi tiết lỗi
      failedTokenDetails.push({
        token,
        error: `${code}: ${res.error.message}`,
      });

      // Xóa token không hợp lệ
      if (
        code === "messaging/invalid-registration-token" ||
        code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-argument"
      ) {
        tokensToDelete.push(token);
      }
    }
  });

  // 7. Delete invalid tokens from DB
  if (tokensToDelete.length > 0) {
    await prisma.userDevice.deleteMany({
      where: {
        fcmToken: { in: tokensToDelete },
      },
    });
    console.log(`Deleted ${tokensToDelete.length} invalid FCM tokens`);
  }

  return {
    notification,
    fcm: {
      successCount: response.successCount,
      failureCount: response.failureCount,
      removedTokens: tokensToDelete.length,
      ...(failedTokenDetails.length > 0 && { 
        failureDetails: failedTokenDetails 
      }),
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
