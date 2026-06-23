import { API_ENDPOINT } from "@/constants/endpoints";
import apiClient from "@/lib/axios/apiClient";
import { securePost } from "@/lib/axios/secureApi";
import { decryptData, encryptData } from "@/lib/utils";

const unwrapNestedEncryptedResult = data => {
  if (typeof data === "string") {
    try {
      const decryptedResult = decryptData(cleanEncryptedText(data));

      return flattenResultEnvelope(decryptedResult?.data ?? decryptedResult);
    } catch {
      return data;
    }
  }

  if (data?.response || typeof data?.result !== "string") {
    return flattenResultEnvelope(data);
  }

  try {
    const encryptedResult = cleanEncryptedText(data.result);
    const decryptedResult = decryptData(encryptedResult);

    return flattenResultEnvelope(decryptedResult?.data ?? decryptedResult);
  } catch {
    return data;
  }
};

const flattenResultEnvelope = data => {
  if (!data || typeof data !== "object" || typeof data.result === "string") {
    return data;
  }

  const nestedData = data.result?.data ?? data.result;

  if (!nestedData || typeof nestedData !== "object") {
    return data;
  }

  const hasApiEnvelope =
    Object.hasOwn(nestedData, "response") ||
    Object.hasOwn(nestedData, "status") ||
    Object.hasOwn(nestedData, "result");

  if (!hasApiEnvelope) {
    return data;
  }

  return {
    ...data,
    ...nestedData,
    status: nestedData.status ?? data.status,
    result: typeof nestedData.result === "string" ? nestedData.result : data.result,
  };
};

const getRawErrorMessage = data => {
  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
};

const cleanEncryptedText = value => {
  return String(value)
    .trim()
    .replace(/^```[^\n]*\n?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
};

const getReadableDecryptedMessage = value => {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const decryptedMessage = decryptData(cleanEncryptedText(value));

    return (
      decryptedMessage?.data?.result ||
      decryptedMessage?.data?.message ||
      decryptedMessage?.result ||
      decryptedMessage?.message ||
      decryptedMessage?.data ||
      decryptedMessage
    );
  } catch {
    return "";
  }
};

const getApiErrorMessage = data => {
  if (typeof data === "string") {
    return getReadableDecryptedMessage(data) || data;
  }

  const message =
    data?.result ||
    data?.message ||
    data?.error ||
    data?.data ||
    data?.response?.result ||
    data?.response?.message ||
    data?.response?.error ||
    data?.response?.data;

  if (typeof message !== "string") {
    return message?.result || message?.message || getRawErrorMessage(data);
  }

  return getReadableDecryptedMessage(message) || message || getRawErrorMessage(data);
};

const getSupportTicketList = async ({ endpoint, label, errorMessage, limit, offset, search }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    limit,
    offset,
    search: search?.trim() || "",
  };

  const data = unwrapNestedEncryptedResult(
    await securePost(endpoint, payload, {
      logName: label,
    })
  );

  console.log(`${label} DECRYPTED RESPONSE:`, data);

  if (data?.status !== 200) {
    throw new Error(data?.result || errorMessage);
  }

  return data;
};

export const getOpenSupportTicketList = ({ limit = 10, offset = 0, search = "" }) => {
  return getSupportTicketList({
    endpoint: API_ENDPOINT.SUPPORT_TICKET.OPEN_TICKET_LIST,
    label: "GET OPEN SUPPORT TICKET LIST",
    errorMessage: "Unable to fetch open support tickets",
    limit,
    offset,
    search,
  });
};

export const getCloseSupportTicketList = ({ limit = 10, offset = 0, search = "" }) => {
  return getSupportTicketList({
    endpoint: API_ENDPOINT.SUPPORT_TICKET.CLOSE_TICKET_LIST,
    label: "GET CLOSE SUPPORT TICKET LIST",
    errorMessage: "Unable to fetch close support tickets",
    limit,
    offset,
    search,
  });
};

export const getSupportTicketDetails = async ({ ticket_id }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    ticket_id,
  };

  const data = unwrapNestedEncryptedResult(
    await securePost(API_ENDPOINT.SUPPORT_TICKET.TICKET_DETAILS, payload)
  );

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch support ticket details");
  }

  return data;
};

export const replySupportTicket = async ({ ticket_id, remark, close_ticket = "0" }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    ticket_id,
    remark,
    close_ticket,
  };

  let data;

  try {
    data = unwrapNestedEncryptedResult(
      await securePost(API_ENDPOINT.SUPPORT_TICKET.REPLY_TICKET, payload, {
        responseLogName: close_ticket === "1" ? "CLOSE SUPPORT TICKET" : undefined,
      })
    );
  } catch (error) {
    const errorData = unwrapNestedEncryptedResult(error?.response?.data ?? error);
    throw new Error(getApiErrorMessage(errorData) || error?.message);
  }

  if (data?.status !== 200) {
    throw new Error(getApiErrorMessage(data));
  }

  return data;
};

export const replySupportTicketWithAttachment = async ({
  ticket_id,
  remark,
  close_ticket = "0",
  attachment,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    ticket_id,
    remark,
    close_ticket,
  };

  const requestBody = new FormData();
  const encryptedPayload = encryptData(payload);

  requestBody.append("data", encryptedPayload);

  if (attachment) {
    requestBody.append("select_img", attachment, attachment.name);
  }

  let response;

  try {
    response = await apiClient.post(API_ENDPOINT.SUPPORT_TICKET.REPLY_TICKET, requestBody, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    const errorData = unwrapNestedEncryptedResult(error?.response?.data ?? error);
    throw new Error(getApiErrorMessage(errorData) || error?.message);
  }

  const data = unwrapNestedEncryptedResult(response.data);

  if (data?.status !== 200) {
    throw new Error(getApiErrorMessage(data));
  }

  return data;
};
