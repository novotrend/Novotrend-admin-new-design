import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getDashboardData = async ({ limit = 10, offset = 0 } = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    limit,
    offset,
  };

  const data = await securePost(API_ENDPOINT.DASHBOARD.DASHBOARD, payload, {
    logName: "DASHBOARD DATA",
  });
  const dashboardData = data?.data ?? data;

  if (dashboardData?.status !== 200) {
    throw new Error(dashboardData?.result || "Unable to fetch dashboard data");
  }

  return dashboardData;
};

export const assignDashboardTicket = async ({ sid, user }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    sid: Number(sid),
    user: Number(user),
  };

  const data = await securePost(API_ENDPOINT.DASHBOARD.TICKET_ASSIGN, payload, { log: false });
  const assignData = data?.data ?? data;

  if (assignData?.status !== 200) {
    throw new Error(assignData?.result || "Unable to assign support ticket");
  }

  return assignData;
};
