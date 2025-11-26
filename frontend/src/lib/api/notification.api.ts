import { axiosClient } from "../axios";
import { type Notification } from "../types/notification.type";

const NOTIFICATION_API_URL = "/v1/notifications";
const DEVICE_API_URL = "/v1/devices";

export const registerDevice = async (fcmToken: string, platform: string, deviceName: string) => {
  const response = await axiosClient.post(`${DEVICE_API_URL}/register`, {
    fcmToken,
    platform,
    deviceName,
  });
  return response.data;
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const response = await axiosClient.get(`${NOTIFICATION_API_URL}/${userId}`, {
    withCredentials: true
  });
  return response.data;
};

export const markAsRead = async (notificationId: string) => {
  const response = await axiosClient.patch(`${NOTIFICATION_API_URL}/${notificationId}/read`);
  return response.data;
};
