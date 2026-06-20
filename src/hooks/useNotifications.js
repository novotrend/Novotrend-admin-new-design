// hooks/useNotifications.js

import { useAllNotificationsQuery } from "@/services/notification/notification.query";
import { useMemo } from "react";

export const useNotifications = () => {
  const { data, isLoading, error } = useAllNotificationsQuery();

  const notifications = useMemo(() => {
    const raw = Array.isArray(data?.response) ? data.response : [];

    return raw.map(item => ({
      id: item.id || item.log_id || item.notification_id || item?.id,
      message:
        item.notification ||
        item.message ||
        item.details ||
        item.activity ||
        item.description ||
        "",
      description:
        item.notification ||
        item.message ||
        item.details ||
        item.activity ||
        item.description ||
        "",
      unread:
        item.read_status === "0" ||
        item.read_status === 0 ||
        item.read === "0" ||
        item.read === 0 ||
        item.status === "unread",
      date: item.date || item.created_at || item.log_date || item.req_date || item.time || "",
      time: item.time || item.date || item.created_at || item.log_date || item.req_date || "",
    }));
  }, [data]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
  };
};
