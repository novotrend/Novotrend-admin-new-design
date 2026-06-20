import { useMutation } from "@tanstack/react-query";
import { walletActionRemark } from "./wallet.service";
// wallet Action
export const useWalletRequestMutation = () => {
  return useMutation({
    mutationFn: walletActionRemark,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};
