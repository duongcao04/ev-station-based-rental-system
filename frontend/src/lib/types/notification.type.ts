export type NotificationType =
  | "NEW_MESSAGE"
  | "NEW_FOLLOWER"
  | "SYSTEM_ALERT"
  | "BOOKING_CONFIRMED"
  | "BOOKING_REMINDER"
  | "INFO";

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  url: string;
  createdAt: string;
  userId: string;
}
