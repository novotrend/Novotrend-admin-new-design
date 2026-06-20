import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getWithdrawInfo = async ({ type_chain }) => {
  
  const token = localStorage.getItem("token");

  
  if (!token) {
    throw new Error("Session Expired");
  }

  const payload = {
    token,
    type_chain,
  };

  
  const data = await securePost(API_ENDPOINT.WITHDRAWAL_INFO.GET_WITHDRAW_INFO, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch withdraw info");
  }

  return data;
};

export const addWithdrawInfo = async ({ address, key, type_chain }) => {
  
  const token = localStorage.getItem("token");

  
  if (!token) {
    throw new Error("Session Expired");
  }

  const payload = {
    token,
    address,
    key,
    type_chain,
  };

  
  const data = await securePost(API_ENDPOINT.WITHDRAWAL_INFO.ADD_WITHDRAW_INFO, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to add withdraw info");
  }

  return data;
};
