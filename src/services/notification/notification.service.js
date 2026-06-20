import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getAllNotifications = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const payload = {
    token,
  };

  const data = await securePost(API_ENDPOINT.NOTIFICATION.GET_ALL_NOTIFICATION, payload, {
    log: false,
  });

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch notifications");
  }

  return data;
};

export const markNotificationAsRead = async ({ notification_id }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const payload = {
    token,
    notification_id: Number(notification_id),
  };

  const data = await securePost(API_ENDPOINT.NOTIFICATION.READ_NOTIFICATION_BY_ID, payload, {
    log: false,
  });

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to mark notification as read");
  }

  return data;
};

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const payload = {
    token,
  };

  const data = await securePost(API_ENDPOINT.NOTIFICATION.READ_ALL_NOTIFICATION, payload, {
    log: false,
  });

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to mark notifications as read");
  }

  return data;
};

export const getUnreadUserLogs = async ({ limit = 10, offset = 0, search = "" }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    limit,
    offset,
    search: search?.trim() || "",
  };

  const data = await securePost(API_ENDPOINT.NOTIFICATION.UNREAD_USER_LOG, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch unread logs");
  }

  return data;
};

export const getReadUserLogs = async ({ limit = 10, offset = 0, search = "" }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    limit,
    offset,
    search: search?.trim() || "",
  };

  const data = await securePost(API_ENDPOINT.NOTIFICATION.READ_USER_LOG, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch read logs");
  }

  return data;
};

export const markUserLogAsRead = async ({ id }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    id,
  };

  const data = await securePost(API_ENDPOINT.NOTIFICATION.READ_LOG_ACTION, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to mark log as read");
  }

  return data;
};

const getNotificationList = async ({
  endpoint,
  payloadLabel,
  errorMessage,
  limit,
  offset,
  search,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    limit,
    offset,
    search: search?.trim() || "",
  };

  const data = await securePost(endpoint, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || errorMessage);
  }

  return data;
};

export const getAdminLoginLogs = ({ limit = 10, offset = 0, search = "" }) => {
  return getNotificationList({
    endpoint: API_ENDPOINT.NOTIFICATION.ADMIN_LOGIN_LOG,
    payloadLabel: "GET ADMIN LOGIN LOGS",
    errorMessage: "Unable to fetch admin login logs",
    limit,
    offset,
    search,
  });
};

export const getUserLoginLogs = ({ limit = 10, offset = 0, search = "" }) => {
  return getNotificationList({
    endpoint: API_ENDPOINT.NOTIFICATION.USER_LOGIN_LOGS,
    payloadLabel: "GET USER LOGIN LOGS",
    errorMessage: "Unable to fetch user login logs",
    limit,
    offset,
    search,
  });
};
