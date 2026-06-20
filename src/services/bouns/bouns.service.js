import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getBounsList = async ({ limit = 10, offset = 0, search = "" }) => {
    const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
  };
    const data = await securePost(API_ENDPOINT.BOUNS.BOUNS_LIST, payload);
    if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch bonus list");
  }

  return data;
};

export const getCancelList = async ({ limit = 10, offset = 0, search = "" }) => {
    const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
  };
    const data = await securePost(API_ENDPOINT.BOUNS.CANCEL_DISCOUNT, payload);
    if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch Cancel bonus list");
  }
  return data;
};

export const getDiscountList = async ({ limit = 10, offset = 0, search = "" }) => {
    const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
  };
    const data = await securePost(API_ENDPOINT.BOUNS.DISCOUNT_LIST, payload);
    if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch discount  list");
  }
  return data;
};

export const giveBonus = async ({ usercode, amount, comment }) => {
  
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const payload = {
    token,
    usercode,
    amount,
    comment,
  };

  
  const data = await securePost(API_ENDPOINT.BOUNS.GIVE_BOUNS, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to give bonus");
  }

  return data;
};

export const removeFromWallet = async ({ usercode, amount, comment }) => {
    const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired");
  }
  const payload = {
    token,
    usercode,
    amount: Number(amount),
    comment,
  };
    const data = await securePost(API_ENDPOINT.BOUNS.REMOVE_WALLET, payload);
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to remove amount from wallet");
  }
  return data;
};
