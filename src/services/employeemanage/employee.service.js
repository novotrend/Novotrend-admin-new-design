import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "@/lib/axios/secureApi";

export const getAdminStaffList = async () => {
    if (typeof window === "undefined") {
    throw new Error("Window not available");
  }
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired");
  }
  const payload = { token };
  const data = await securePost(API_ENDPOINT.STAFFLIST.ADMIN_STAFF_LIST, payload);
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch admin Staff List");
  }

  return data;
};

export const getAdminAllPermission = async () => {
  
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }
  const payload = { token };
  const data = await securePost(API_ENDPOINT.STAFFLIST.GET_ALL_PERMISSION, payload);
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch permission List");
  }
  return data;
};

export const addEmployee = async ({
  user_name,
  user_mobile,
  user_email,
  user_adress,
  username,
  password,
  permission,
}) => {
  
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const payload = {
    token,
    user_name,
    user_mobile,
    user_email,
    user_adress,
    username,
    password,
    permission,
  };

  
  const data = await securePost(API_ENDPOINT.STAFFLIST.ADD_NEW_EMPLOYEE, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to add employee");
  }

  return data;
};

export const editEmployeeDetails = async ({
  staff_id,
  user_name,
  user_mobile,
  user_email,
  user_adress,
  username,
  password,
  permission,
}) => {
  
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const payload = {
    token,
    staff_id,
    user_name,
    user_mobile,
    user_email,
    user_adress,
    username,
    password,
    permission,
  };

  
  const data = await securePost(API_ENDPOINT.STAFFLIST.EDIT_EMPLOYEE_DETAILS, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to update employee");
  }

  return data;
};

export const deleteEmployeeDetails = async ({ staff_id }) => {
  
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  const payload = {
    token,
    staff_id,
  };

  
  const data = await securePost(API_ENDPOINT.STAFFLIST.DELETE_EMPLOYEE_DETAILS, payload);

  
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to delete employee");
  }

  return data;
};
