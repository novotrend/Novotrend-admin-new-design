import { useQuery } from "@tanstack/react-query";
import { getDepositWallet } from "./depositWallet.service";

export const useDepositWalletQuery = () => {
  return useQuery({
    queryKey: ["deposit-wallet"],
    queryFn: async () => {
      
      return await getDepositWallet();
    },
  });
};
