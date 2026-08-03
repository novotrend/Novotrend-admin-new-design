import api from "@/utils/axiosInstance";
import { API_ENDPOINT } from "@/constants/endpoints";

export const createClientDeposit = async (payload) => {
  const response = await api.post(
    API_ENDPOINT.TRANSACTION.CREATE_DEPOSIT_CLIENT,
    payload,
  );
  const data = response.data?.data ?? response.data;
  console.log("CLIENT DEPOSIT DECRYPTED RESPONSE:", data);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to create client deposit");
  }

  return data;
};

export const createClientWithdrawal = async (payload) => {
  const response = await api.post(
    API_ENDPOINT.TRANSACTION.CREATE_WITHDRAWAL_CLIENT,
    payload,
  );
  const data = response.data?.data ?? response.data;
  console.log("CLIENT WITHDRAWAL DECRYPTED RESPONSE:", data);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to create client withdrawal");
  }

  return data;
};
