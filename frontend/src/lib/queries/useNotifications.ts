import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, sendNotification, type ISendNotificationPayload } from "../api/notification.api";
import { useProfile } from "./useAuth";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/error";

export const useNotifications = () => {
  const { data: user } = useProfile();
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve({});
      }
      return getNotifications(user.id);
    },
    select(data) {
      return data?.items;
    },
    enabled: !!user?.id, // Only run query if user.id is available
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to mark notification as read"));
    },
  });

  const { mutate: sendNotificationMutation } = useMutation({
    mutationFn: (payload: ISendNotificationPayload) => sendNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to send notification"));
    },
  });

  return {
    notifications,
    isLoading,
    isError,
    error,
    markAsRead: markAsReadMutation,
    sendNotification: sendNotificationMutation,
  };
};
