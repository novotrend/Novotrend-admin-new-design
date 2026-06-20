import { useQuery } from "@tanstack/react-query";
import {
  getWithdrawalAcceptRequestList,
  getWithdrawalRejectRequestList,
  getWithdrawalRequestList,
} from "./withdrawal.service";

export const useWithdrawalRequestListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["withdrawal-request-list", limit, offset, search],
    queryFn: async () => {
      return await getWithdrawalRequestList({
        limit,
        offset,
        search,
      });
    },
  });
};

export const useWithdrawalAcceptListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["withdrawal-accept-list", limit, offset, search],
    queryFn: async () => {
      return await getWithdrawalAcceptRequestList({
        limit,
        offset,
        search,
      });
    },
  });
};

export const useWithdrawalRejectListQuery = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["withdrawal-reject-list", limit, offset, search],
    queryFn: async () => {
      return await getWithdrawalRejectRequestList({
        limit,
        offset,
        search,
      });
    },
  });
};
