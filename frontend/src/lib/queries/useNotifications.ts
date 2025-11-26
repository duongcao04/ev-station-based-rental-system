import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead } from "../api/notification.api";
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
        return Promise.resolve([]);
      }
      return getNotifications(user.id);
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

  return {
    notifications,
    isLoading,
    isError,
    error,
    markAsRead: markAsReadMutation,
  };
};
