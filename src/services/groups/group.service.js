import { API_ENDPOINT } from "../../constants/endpoints";
import { securePost } from "../../lib/axios/secureApi";

// GET MT5 GROUP LIST
export const getMT5GroupList = async ({ limit = 10, offset = 0, search = "", status } = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired");
  }
  // PAYLOAD
  const payload = {
    token,
    limit,
    offset,
    search,
    ...(status !== undefined ? { status } : {}),
  };
  // SECURE API CALL
  const data = await securePost(API_ENDPOINT.GROUPS.LISTGROUP, payload);
  console.log("data", data);
  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch groups");
  }
  return data;
};

// group Add
export const addMT5Group = async ({ groupname, groupnamemt5, leverage }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    groupname,
    groupnamemt5,
    leverage,
  };
  const data = await securePost(API_ENDPOINT.GROUPS.CREATE_MT5_GROUP, payload);
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to create group");
  }
};

// EDIT MT5 GROUP
export const editMT5Group = async ({
  group_id,
  group_name,
  mt5_group_name,
  leverage,
  group_status,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session Expired");
  }

  // PAYLOAD
  const payload = {
    token,
    group_id,
    group_name,
    mt5_group_name,
    leverage,
    group_status,
  };

  // SECURE API CALL
  const data = await securePost(API_ENDPOINT.GROUPS.EDIT_MT5_GROUP, payload);

  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to edit group");
  }

  return data;
};

// UPDATE MT5 GROUP
export const updateMT5Group = async ({ accno, groupid }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired");
  }
  // PAYLOAD
  const payload = {
    token,
    accno,
    groupid,
  };
  // SECURE API CALL
  const data = await securePost(API_ENDPOINT.GROUPS.UPDATE_MT5_GROUP, payload);
  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to update group");
  }

  return data;
};
