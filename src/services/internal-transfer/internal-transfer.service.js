import api from "@/utils/axiosInstance";
import { API_ENDPOINT } from "@/constants/endpoints";

export const createInternalTransfer = async payload => {
  const response = await api.post(
    API_ENDPOINT.INTERNAL_TRANFER.INTERNAL_TRANSACTION,
    payload,
  );

  return response.data;
};