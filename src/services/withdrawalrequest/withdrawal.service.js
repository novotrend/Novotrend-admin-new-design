import { API_ENDPOINT } from "../../constants/endpoints";
import { securePost } from "../../lib/axios/secureApi";

// GET WITHDRAWAl REQUEST LIST
export const getWithdrawalRequestList = async ({ limit = 10, offset = 0, search }) => {
    const token = localStorage.getItem("token");
    if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
  };
    const data = await securePost(API_ENDPOINT.WITHDRAWAL_REQUEST.WITHDRAWAL_REQUEST_LIST, payload);
    if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch withdrawal requests");
  }
  return data;
};

// GET WITHDRAWAl ACCEPTED LIST
export const getWithdrawalAcceptRequestList = async ({ limit = 10, offset = 0, search }) => {
    const token = localStorage.getItem("token");
    if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
  };
    const data = await securePost(API_ENDPOINT.WITHDRAWAL_REQUEST.WITHDRAWAL_ACCEPT_LIST, payload);
    if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch withdrawal ACCEPTED");
  }
  return data;
};

// GET WITHDRAWAl ACCEPTED LIST
export const getWithdrawalRejectRequestList = async ({ limit = 10, offset = 0, search }) => {
    const token = localStorage.getItem("token");
    if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
  };
    const data = await securePost(API_ENDPOINT.WITHDRAWAL_REQUEST.WITHDRAWAL_REJECT_LIST, payload);
    if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch withdrawal Rejected");
  }
  return data;
};

// WITHDRAWAL ACTION
export const withdrawalActionRemark = async ({ status, recordid, remark }) => {
  
  const token = localStorage.getItem("token");

  
  if (!token) {
    throw new Error("Session Expired");
  }

  const payload = {
    token,
    status,
    recordid,
    remark,
  };

  
  const data = await securePost(API_ENDPOINT.WITHDRAWAL_REQUEST.WITHDRAWAL_ACTION, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to process withdrawal request");
  }

  return data;
};
