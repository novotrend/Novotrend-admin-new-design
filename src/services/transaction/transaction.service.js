import api from "@/utils/axiosInstance";
import { API_ENDPOINT } from "@/constants/endpoints";

export const createClientDeposit = async (payload) => {
  const response = await api.post(
    API_ENDPOINT.TRANSACTION.CREATE_DEPOSIT_CLIENT,
    payload,
  );
  return response.data;
};

export const createClientWithdrawal = async (payload) => {
  const response = await api.post(
    API_ENDPOINT.TRANSACTION.CREATE_WITHDRAWAL_CLIENT,
    payload,
  );
  return response.data;
};