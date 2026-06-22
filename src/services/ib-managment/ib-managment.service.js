import { API_ENDPOINT } from "@/constants/endpoints";
import api from "@/utils/axiosInstance";

// IB LIST here
export const getIBList = async payload => {
  // console.log("IB LIST DECRYPTED PAYLOAD:", payload);
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LIST, payload);
  // console.log("IB LIST DECRYPTED RESPONSE:", response.data);
  return response.data;
};

// IB COMMISSION LIST
export const getIBCommissionList = async payload => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LIST_COMMISSION, payload);

  return response.data;
};

// IB DOWNLINE
export const getIBLevelList = async payload => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LEVEL_LIST, payload);
  return response.data;
};

// IB Showdetails
export const getIBLevelWiseUserDetail = async payload => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LEVELWISE_USER_DETAIL, payload);

  return response.data;
};

// REJECTED IB LIST
export const getRejectedIBList = async ({ limit, offset, search }) => {
  const payload = {
    limit,
    offset,
    search,
  };

  // console.log("REJECTED IB LIST DECRYPTED PAYLOAD:", payload);
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LIST_REJECT, payload);
  // console.log("REJECTED IB LIST DECRYPTED RESPONSE:", response.data);

  return response.data;
};

// IB-MOVE
export const moveIB = async payload => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_MOVE, payload);
  return response.data;
};

// section -List of become IB
export const getApprovedIBList = async payload => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LIST_APPROVED, payload);

  return response.data;
};

export const deactivateIBUser = async payload => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LIST_APPROVED_DEACTIVE, payload);

  return response.data;
};

// Section IB - List of IB Request
export const getPendingIBList = async ({ limit = 10, offset = 0, search = "" }) => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LIST_PENDING, {
    limit,
    offset,
    search,
  });
  return response.data;
};

// here endpoint

export const ibRequestAction = async ({ type, user_id, status }) => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_LIST_APPROVED_DEACTIVE, {
    type,
    user_id,
    status,
  });
  return response.data;
};

// section -
export const getIBWithdrawalRequestList = async ({ limit = 10, offset = 0, search = "" }) => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_WITHDRAWAL_REQUEST_LIST, {
    limit,
    offset,
    search,
  });

  return response.data;
};

export const ibWithdrawalAction1 = async ({ status, recordid, remark }) => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_WITHDRAWAL_ACTION, {
    status,
    recordid,
    remark,
  });

  return response.data;
};

// Reject IB Request
export const getRejectedIBListRequst = async payload => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_WITHDRAWAL_REJECT, payload);

  return response.data;
};

// Accepted IB List
export const getAcceptedIBWithdrawalList = async ({ limit = 10, offset = 0, search = "" }) => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_WITHDRAWAL_ACCEPT, {
    limit,
    offset,
    search,
  });

  return response.data;
};

// IB RewardList
export const getIBRewardList = async ({ limit = 10, offset = 0, search = "" }) => {
  const response = await api.post(API_ENDPOINT.IB_MANAGEMENT.IB_REWARD_LIST, {
    limit,
    offset,
    search,
  });

  return response.data;
};
