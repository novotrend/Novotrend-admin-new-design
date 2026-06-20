import { useMutation } from "@tanstack/react-query";
import { addWithdrawInfo } from "./withdrawalInfo.service";

export const useAddWithdrawInfoMutation = () => {
  return useMutation({
    mutationFn: addWithdrawInfo,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};
