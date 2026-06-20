import { useMutation } from "@tanstack/react-query";
import { addDepositWallet } from "./depositWallet.service";

export const useAddDepositWalletMutation = () => {
  return useMutation({
    mutationFn: addDepositWallet,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};
