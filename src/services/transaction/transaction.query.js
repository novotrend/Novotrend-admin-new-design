import { useMutation } from "@tanstack/react-query";
import {
  createClientDeposit,
  createClientWithdrawal,
} from "./transaction.service";

export const useCreateClientDepositMutation = () => {
  return useMutation({
    mutationFn: createClientDeposit,
  });
};

export const useCreateClientWithdrawalMutation = () => {
  return useMutation({
    mutationFn: createClientWithdrawal,
  });
};
