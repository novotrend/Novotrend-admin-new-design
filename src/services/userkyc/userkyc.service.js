import { API_ENDPOINT } from "@/constants/endpoints";
import apiClient from "@/lib/axios/apiClient";
import { decryptData, encryptData } from "@/lib/utils";
import { securePost } from "../../lib/axios/secureApi";

// GET NEW KYC LIST
export const getNewKycList = async ({ limit = 10, offset = 0, search = "" }) => {
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
  const data = await securePost(API_ENDPOINT.USER_KYC.UPLOAD_NEW_KEY_LIST, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch new KYC list");
  }

  return data;
};

// NEW KYC APPROVE
export const getNewKycApprove = async ({ limit = 10, offset = 0, search = "", sdate, edate }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
    sdate,
    edate,
  };
  const data = await securePost(API_ENDPOINT.USER_KYC.NEW_KYC_LIST_APPROVE, payload);
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch new KYC Approve list");
  }
  return data;
};

// NEW BANK KYC LIST
export const getNewBankKycList = async ({ limit = 10, offset = 0, search = "" }) => {
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
  const data = await securePost(API_ENDPOINT.USER_KYC.NEW_BANK_KYC_LIST, payload, {
    logName: "NEW BANK KYC LIST",
  });

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch new KYC list");
  }

  return data;
};

// NEW BANK KYC APPROVE
export const getBankKycAcceptedList = async ({
  limit = 10,
  offset = 0,
  search = "",
  sdate,
  edate,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    limit,
    offset,
    search,
    sdate,
    edate,
  };
  const data = await securePost(API_ENDPOINT.USER_KYC.ACCEPTED_BANK_KYC, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch new KYC approve list");
  }

  return data;
};

// REJECTED BANK HISTORY
export const getBankRejectHistoryList = async ({ limit = 10, offset = 0, search = "" }) => {
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
  const data = await securePost(API_ENDPOINT.USER_KYC.REJECTED_BANK_HISTORY, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch bank rejected history list");
  }

  return data;
};

// REJECTED KYC HISTORY
export const getRejectedKycHistoryList = async ({ limit = 10, offset = 0, search = "" }) => {
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
  const data = await securePost(API_ENDPOINT.USER_KYC.REJECTED_KYC_HISTORY, payload);
  console.log("Rejected KYC History Data:", data); // Debugging log

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch rejected kyc history list");
  }

  return data;
};

// ends

const normalizePlainResponse = responseData => {
  if (typeof responseData === "object" && responseData !== null) {
    return responseData?.data ?? responseData;
  }
  if (typeof responseData !== "string") {
    return responseData;
  }

  const trimmedResponse = responseData.trim();

  if (!trimmedResponse) {
    return {
      status: 200,
      result: "Request completed successfully",
    };
  }

  try {
    const parsedResponse = JSON.parse(trimmedResponse);

    return parsedResponse?.data ?? parsedResponse;
  } catch {
    return {
      status: 200,
      result: trimmedResponse,
    };
  }
};

const normalizeEncryptedOrPlainResponse = responseData => {
  try {
    const decrypted = decryptData(responseData);

    return decrypted?.data ?? decrypted;
  } catch {
    if (typeof responseData?.result === "string") {
      try {
        const decryptedResult = decryptData(responseData.result);

        return decryptedResult?.data ?? decryptedResult;
      } catch {
        return responseData;
      }
    }

    return normalizePlainResponse(responseData);
  }
};

const formDataToPayloadAndFile = formData => {
  const payload = {};
  let bankphoto = null;

  for (const [key, value] of formData.entries()) {
    if (key === "bankphoto" && typeof File !== "undefined" && value instanceof File) {
      bankphoto = value;
    } else if (key === "user_id") {
      payload[key] = value === "" || value === null || value === undefined ? "" : Number(value);
    } else {
      payload[key] = value;
    }
  }

  return { payload, bankphoto };
};

// ADD BANK ACCOUNT

export const addBankAccount = async formData => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const { payload, bankphoto } = formDataToPayloadAndFile(formData);

  payload.token = token;

  const requestBody = new FormData();
  const encryptedPayload = encryptData(payload);

  requestBody.append("data", encryptedPayload);

  if (bankphoto) {
    requestBody.append("bankphoto", bankphoto);
  }

  const response = await apiClient.post(API_ENDPOINT.USER_KYC.ADD_BANK_ACCOUNT, requestBody, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = normalizeEncryptedOrPlainResponse(response.data);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to add bank account");
  }

  return data;
};

export const updateKycStatus = async ({ id, status, remark }) => {
  const token = localStorage.getItem("token");

  const payload = {
    token,
    status,
    id,
    remark,
  };

  const data = await securePost(API_ENDPOINT.USER_KYC.UPDATE_KYC_STATUS, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to update KYC status");
  }

  return data;
};

export const updateBankKycStatus = async ({ kyc_id, status, remark = "" }) => {
  const token = localStorage.getItem("token");

  const payload = {
    token,
    kyc_id,
    status,
    remark,
  };

  const data = await securePost(API_ENDPOINT.USER_KYC.UPDATE_BANK_KYC_STATUS, payload);

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to update Bank KYC status");
  }

  return data;
};
