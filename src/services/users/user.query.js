import { useQuery } from "@tanstack/react-query";
import {
  getMT5PasswordList,
  getMT5UserList,
  getUserIbDetails,
  getUserList,
  getUserLiveTrade,
  getUserTradingReport,
} from "./user.service";

export const useUsersQuery = ({ token, limit, offset, search }) => {
  return useQuery({
    queryKey: ["users", limit, offset, search],
    queryFn: async () => {
            return await getUserList({
        token,
        limit,
        offset,
        search,
      });
    },
  });
};

// this is for the MT%UserList
export const useMT5UsersQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["mt5-users", limit, offset, search],
    queryFn: () =>
      getMT5UserList({
        limit,
        offset,
        search,
      }),
    keepPreviousData: true,
  });
};

export const useUserIbDetailsQuery = ({ user_id }) => {
  return useQuery({
    queryKey: ["user-ib-details", user_id],
    queryFn: () => getUserIbDetails({ user_id }),
    enabled: Boolean(user_id),
  });
};

export const useUserLiveTradeQuery = ({ user_id, limit = 10, offset = 0 }) => {
  return useQuery({
    queryKey: ["user-live-trade", user_id, limit, offset],
    queryFn: () => getUserLiveTrade({ user_id, limit, offset }),
    enabled: Boolean(user_id),
  });
};

export const useUserTradingReportQuery = ({ user_id }) => {
  return useQuery({
    queryKey: ["user-trading-report", user_id],
    queryFn: () => getUserTradingReport({ user_id }),
    enabled: Boolean(user_id),
  });
};

// REQUEST LIST (status = 0)
export const useMT5PasswordRequestQuery = params => {
  return useQuery({
    queryKey: ["mt5-password-request", params],
    queryFn: () =>
      getMT5PasswordList({
        ...params,
        status: 0,
      }),
  });
};

// ACCEPTED LIST (status = 1)
export const useMT5PasswordAcceptedQuery = params => {
  return useQuery({
    queryKey: ["mt5-password-accepted", params],
    queryFn: () =>
      getMT5PasswordList({
        ...params,
        status: 1,
      }),
  });
};

// REJECTED LIST (status = 2)
export const useMT5PasswordRejectedQuery = params => {
  return useQuery({
    queryKey: ["mt5-password-rejected", params],
    queryFn: () =>
      getMT5PasswordList({
        ...params,
        status: 2,
      }),
  });
};
