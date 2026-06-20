import { API_ENDPOINT } from "@/constants/endpoints";
import { securePost } from "../../lib/axios/secureApi";

// GET USER LIST
export const getUserList = async ({ limit = 10, offset = 0, search }) => {
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

  console.log("GET USER LIST DECRYPTED PAYLOAD:", payload);

  const data = await securePost(API_ENDPOINT.USERS.USERLIST, payload);
  console.log("GET USER LIST DECRYPTED RESPONSE:", data);
  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to load users");
  }
  return data;
};

// ADMIN USER ACTION
export const adminUserAction = async ({ user_id, type }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }
  const allowedTypes = ["active", "deactive", "logout"];
  if (!allowedTypes.includes(type)) {
    throw new Error("Invalid action type");
  }
  const payload = {
    token,
    user_id,
    type,
  };

  const data = await securePost(API_ENDPOINT.USERS.ADMINACTION, payload);

  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to perform action");
  }

  return data;
};

// GET USER DETAILS
export const getUserDetails = async ({ user_id }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    user_id: Number(user_id),
  };

  const data = await securePost(API_ENDPOINT.USERS.GET_USER_DETAILS, payload, {
    logName: "GET USER DETAILS",
  });

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch user details");
  }

  return data;
};

const getUserDetailTabData = async ({ endpoint, logName, user_id, limit, offset, sdate, edate, accno }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    user_id: Number(user_id),
  };

  if (limit !== undefined) {
    payload.limit = limit;
  }

  if (offset !== undefined) {
    payload.offset = offset;
  }

  if (sdate !== undefined) {
    payload.sdate = sdate;
  }

  if (edate !== undefined) {
    payload.edate = edate;
  }

  if (accno !== undefined) {
    payload.accno = accno;
  }

  console.log(`${logName} DECRYPTED PAYLOAD:`, payload);

  const data = await securePost(endpoint, payload, {
    logName,
  });

  console.log(`${logName} DECRYPTED RESPONSE:`, data);

  if (data?.status !== 200 && data?.status !== 404) {
    throw new Error(data?.result || "Unable to fetch user detail data");
  }

  return data;
};

export const getUserIbDetails = ({ user_id }) =>
  getUserDetailTabData({
    endpoint: API_ENDPOINT.USERS.IB_DETAILS,
    logName: "GET USER IB DETAILS",
    user_id,
  });

export const getUserLiveTrade = ({ user_id, limit = 10, offset = 0, sdate = "", edate = "", accno = "" }) =>
  getUserDetailTabData({
    endpoint: API_ENDPOINT.USERS.LIVE_TRADE,
    logName: "GET USER LIVE TRADE",
    user_id,
    limit,
    offset,
    sdate,
    edate,
    accno,
  });

export const getUserTradingReport = ({ user_id, sdate = "", edate = "", accno = "" }) =>
  getUserDetailTabData({
    endpoint: API_ENDPOINT.USERS.TRADING_REPORT,
    logName: "GET USER TRADING REPORT",
    user_id,
    sdate,
    edate,
    accno,
  });

export const getUserDownline = async ({ user_id, user_ref_code, reg_code, email }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
  };

  const numericUserId = Number(user_id);
  if (user_id !== undefined && user_id !== null && user_id !== "" && !Number.isNaN(numericUserId)) {
    payload.user_id = numericUserId;
  }

  const refCode = user_ref_code || reg_code || email;
  if (refCode) {
    payload.user_ref_code = refCode;
  }

  const data = await securePost(API_ENDPOINT.USERS.GET_USER_DOWNLINE, payload, {
    logName: "GET USER DOWNLINE",
  });

  console.log("GET USER DOWNLINE DECRYPTED RESPONSE:", data);

  if (data?.status !== 200 && data?.status !== 404) {
    throw new Error(data?.result || "Unable to fetch user downline");
  }

  return data;
};

// GET MT5 USER LIST
export const getMT5UserList = async ({ limit = 10, offset = 0, search = "" }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    limit,
    offset,
    search: search?.trim(),
  };

  const data = await securePost(API_ENDPOINT.USERS.LISTMT5USER, payload, {
    logName: "LIST ALL MT5 USER",
  });

  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to load MT5 users");
  }

  return data;
};

// GET MT5 ACCOUNT DETAILS
export const getMT5AccountDetails = async ({ accno }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    accno: accno || "",
  };

  const data = await securePost(API_ENDPOINT.USERS.GET_MT5_ACCOUNT_DETAILS, payload, {
    logName: "GET MT5 ACCOUNT DETAILS",
  });

  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to fetch MT5 account details");
  }

  return data;
};

// CHECK EMAIL TO USERNAME
export const getUsernameByEmail = async ({ email }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const payload = {
    token,
    code: email,
  };

  const data = await securePost(API_ENDPOINT.USERS.GET_USERNAME_BY_EMAIL, payload);

  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "User not found");
  }

  return data;
};

// GET MT5 ACCOUNT BY EMAIL
export const getMT5AccountByEmail = async ({ email }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired. Please login again.");
  }
  const payload = {
    token,
    code: email,
  };

  const data = await securePost(API_ENDPOINT.USERS.GET_MT5_ACCOUNT_BY_EMAIL, payload);
  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "No MT5 accounts found");
  }
  return data;
};
// CREATE MT5 ACCOUNT
export const createMT5Account = async ({
  email,
  selectgroup,
  mainpassword,
  investorpassword,
  accleverage,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session Expired");
  }
  // PAYLOAD
  const payload = {
    token,
    email,
    selectgroup,
    mainpassword,
    investorpassword,
    accleverage,
  };

  const data = await securePost(API_ENDPOINT.USERS.CREATE_MT5_ACCOUNT, payload);
  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "MT5 account creation failed");
  }

  return data;
};
// CHANGE MT5 PASSWORD
export const changeMT5Password = async ({
  accountnumber,
  passwordtype,
  mainpassword,
  investorpassword,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired");
  }

  // PAYLOAD
  const payload = {
    token,
    accountnumber,
    mainpassword: passwordtype !== "investor" ? mainpassword : "",
    investorpassword: passwordtype !== "main" ? investorpassword : "",
    passwordtype,
  };

  const data = await securePost(API_ENDPOINT.USERS.CHANGE_MT5_PASSWORD, payload);
  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Password change failed");
  }

  return data;
};

// VERIFY MT5 ACCOUNT NUMBER
export const getUsernameByAccountNo = async ({ accno }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Session Expired");
  }

  const payload = {
    token,
    accno,
  };

  const data = await securePost(API_ENDPOINT.USERS.GET_USERNAME_BY_ACCOUNTNO, payload);

  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Account Not Found");
  }

  return data;
};
// CHANGE MT5 LEVERAGE
export const changeMT5Leverage = async ({ accno, leverage }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    accountnumber: accno,
    accleverage: leverage,
  };

  const data = await securePost(API_ENDPOINT.USERS.CHANGE_MT5_LEVERAGE, payload);
  // VALIDATION
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to change leverage");
  }
  return data;
};

// Send MT5 Data List to Email
export const sendVerificationMailMT5 = async ({ accountno }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    accountno,
  };
  const data = await securePost(API_ENDPOINT.USERS.SEND_VERIFICATION_MAIL_MT5, payload);
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to send verification mail");
  }
  return data;
};

// Main Mt5 Password list
export const getMT5PasswordList = async ({ status = 0, limit = 10, offset = 0, search = "" }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired");
  }
  const payload = {
    token,
    status,
    limit,
    offset,
    search,
  };
  const res = await securePost(API_ENDPOINT.USERS.MT5_MAIN_PASSWORD_REQUEST_LIST, payload);
  if (res?.status !== 200) {
    throw new Error(res?.result || "Failed to fetch MT5 password list");
  }
  return res;
};
// mt5password.service.js
export const changeMT5PasswordRequestStatus = async ({ id, status }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session Expired");
  }
  const payload = {
    token,
    id,
    status,
  };
  const data = await securePost(API_ENDPOINT.USERS.CHANGE_MT5_MAIN_PASSWORD_REQUEST_LIST, payload);
  if (data?.status !== 200) {
    throw new Error(data?.result || "Unable to update MT5 password request");
  }
  return data;
};
