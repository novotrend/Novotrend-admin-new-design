import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getGasInfo = async ({ type_chain }) => {
  
  const token = localStorage.getItem("token");

  
  if (!token) {
    throw new Error("Session Expired");
  }

  const payload = {
    token,
    type_chain,
  };

  
  const data = await securePost(API_ENDPOINT.GAS_INFO.GET_GAS_INFO, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch gas info");
  }

  return data;
};

export const addGasInfo = async ({ address, key, type_chain }) => {
  
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

  
  const data = await securePost(API_ENDPOINT.GAS_INFO.ADD_GAS_INFO, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to add gas info");
  }

  return data;
};
