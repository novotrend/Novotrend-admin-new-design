import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getWalletReport = async ({ limit = 10, offset = 0, sdate, edate, search }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session Expired. Please Login Again");
  }

  const payload = {
    token,
    limit,
    offset,
    sdate,
    edate,
    search,
  };

  const data = await securePost(API_ENDPOINT.REPORTS.WALLET_REPORT, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch wallet request report");
  }
  return data;
};

export const getInternalTransferReport = async ({
  limit = 10,
  offset = 0,
  sdate,
  edate,
  search,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired. Please Login Again");
  }
  const payload = {
    token,
    limit,
    offset,
    sdate,
    edate,
    search,
  };

  const data = await securePost(API_ENDPOINT.REPORTS.INTERNAL_TRANSFER_REPORT, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch internal transfer report");
  }
  return data;
};

export const getWalletRequestListHistory = async ({
  limit = 10,
  offset = 0,
  sdate = "",
  edate = "",
  search = "",
  useremail = "",
  paytype = "",
  status = "",
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session Expired. Please Login Again");
  }

  const payload = {
    token,
    limit,
    offset,
    sdate,
    edate,
    search,
    useremail,
    paytype,
    status,
  };

  const data = await securePost(API_ENDPOINT.REPORTS.WALLET_REQUEST_LIST_HISTORY, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch wallet request report");
  }

  return data;
};

export const getWithdrawalRequestListHistory = async ({
  limit = 10,
  offset = 0,
  sdate = "",
  edate = "",
  search = "",
  useremail = "",
  paytype = "",
  status = "",
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session Expired. Please Login Again");
  }
  const payload = {
    token,
    limit,
    offset,
    sdate,
    edate,
    search,
    useremail,
    paytype,
    status,
  };

  const data = await securePost(API_ENDPOINT.REPORTS.WITHDRAWAL_REQUEST_LIST_HISTORY, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch Withdrawal request report");
  }

  return data;
};

export const getWithdrawalRequestListHistoryIB = async ({
  limit = 10,
  offset = 0,
  sdate = "",
  edate = "",
  search = "",
  useremail = "",
  paytype = "",
  status = "",
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session Expired. Please Login Again");
  }
  const payload = {
    token,
    limit,
    offset,
    sdate,
    edate,
    search,
    useremail,
    paytype,
    status,
  };

  const data = await securePost(API_ENDPOINT.REPORTS.WITHDRAWAL_REQUEST_LIST_HISTORY_IB, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch Withdrawal request IB report");
  }
  return data;
};
