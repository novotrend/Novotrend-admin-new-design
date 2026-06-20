import { API_ENDPOINT } from "@/constants/endpoints";
import apiClient from "@/lib/axios/apiClient";
import { decryptData } from "@/lib/utils";

export const getCountryList = async () => {
  const response = await apiClient.get(API_ENDPOINT.COUNTRY.COUNTRY_LIST);
  let data = response?.data;

  try {
    const decryptedResponse = decryptData(response?.data);
    data = decryptedResponse?.data ?? decryptedResponse;
  } catch {
    data = response?.data?.data ?? response?.data;
  }

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch country list");
  }
  return data;
};
