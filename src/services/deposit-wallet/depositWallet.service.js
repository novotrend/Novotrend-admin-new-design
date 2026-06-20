import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getDepositWallet = async () => {
  
  const token = localStorage.getItem("token");

  
  if (!token) {
    throw new Error("Session Expired");
  }

  const payload = {
    token,
  };

  
  const data = await securePost(API_ENDPOINT.DEPOSIT_WALLET.GET_DEPOSIT_WALLET, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch deposit wallet");
  }

  return data;
};

export const addDepositWallet = async ({ bep20, trc20, eth20, pol20 }) => {
  
  const token = localStorage.getItem("token");

  
  if (!token) {
    throw new Error("Session Expired");
  }

  const payload = {
    token,
    bep20,
    trc20,
    eth20,
    pol20,
  };

  
  const data = await securePost(API_ENDPOINT.DEPOSIT_WALLET.ADD_DEPOSIT_WALLET, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to add deposit wallet");
  }

  return data;
};
