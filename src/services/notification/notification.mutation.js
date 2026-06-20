import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markUserLogAsRead,
} from "./notification.service";

const invalidateNotificationQueries = queryClient => {
  queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
  queryClient.invalidateQueries({ queryKey: ["unread-user-logs"] });
  queryClient.invalidateQueries({ queryKey: ["read-user-logs"] });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      invalidateNotificationQueries(queryClient);
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      invalidateNotificationQueries(queryClient);
    },
  });
};

export const useMarkUserLogAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markUserLogAsRead,
    onSuccess: () => {
      invalidateNotificationQueries(queryClient);
    },
  });
};
