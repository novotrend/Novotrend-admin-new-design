import { useMutation } from "@tanstack/react-query";
import { withdrawalActionRemark } from "./withdrawal.service";
export const useWithdrawalActionMutation = () => {
  return useMutation({
    mutationFn: withdrawalActionRemark,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};
