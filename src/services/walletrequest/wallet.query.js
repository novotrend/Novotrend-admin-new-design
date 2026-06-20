import { useQuery } from "@tanstack/react-query";
import { acceptWalletRequest, getWalletRequestList, rejectWalletRequest } from "./wallet.service";

export const useWalletRequestList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["wallet-request-list", limit, offset, search],
    queryFn: async () => {
            return await getWalletRequestList({
        limit,
        offset,
        search,
      });
    },
  });
};

// ACCEPT WALLET REQUEST
export const useAcceptWalletRequestList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["accept-wallet-request-list", limit, offset, search],
    queryFn: async () => {
            return await acceptWalletRequest({
        limit,
        offset,
        search,
      });
    },
  });
};

// ACCEPT WALLET REQUEST
export const useRejectWalletRequestList = ({ limit, offset, search }) => {
  return useQuery({
    queryKey: ["reject-wallet-request-list", limit, offset, search],
    queryFn: async () => {
            return await rejectWalletRequest({
        limit,
        offset,
        search,
      });
    },
  });
};
