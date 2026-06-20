import { useQuery } from "@tanstack/react-query";
import {
  getAdminLoginLogs,
  getAllNotifications,
  getReadUserLogs,
  getUnreadUserLogs,
  getUserLoginLogs,
} from "./notification.service";

export const useAllNotificationsQuery = () => {
  return useQuery({
    queryKey: ["all-notifications"],
    queryFn: getAllNotifications,
  });
};

export const useUnreadUserLogsQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["unread-user-logs", limit, offset, search],
    queryFn: () =>
      getUnreadUserLogs({
        limit,
        offset,
        search,
      }),
  });
};

export const useReadUserLogsQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["read-user-logs", limit, offset, search],
    queryFn: () =>
      getReadUserLogs({
        limit,
        offset,
        search,
      }),
  });
};

export const useAdminLoginLogsQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["admin-login-logs", limit, offset, search],
    queryFn: () =>
      getAdminLoginLogs({
        limit,
        offset,
        search,
      }),
  });
};

export const useUserLoginLogsQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["user-login-logs", limit, offset, search],
    queryFn: () =>
      getUserLoginLogs({
        limit,
        offset,
        search,
      }),
  });
};
