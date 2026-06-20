import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addBankAccount, updateBankKycStatus, updateKycStatus } from "./userkyc.service";

const getSafeSuccessMessage = (data, fallback) => {
  const message = data?.message || data?.result;

  if (typeof message !== "string") {
    return message || fallback;
  }

  const looksEncrypted = message.length > 80 && !message.includes(" ");

  return looksEncrypted ? fallback : message;
};

// ADD Bank Account
export const useAddBankAccountMutation = () => {
  return useMutation({
    mutationFn: addBankAccount,
    onSuccess: data => {
            toast.success(getSafeSuccessMessage(data, "Bank account added successfully"));
    },
    onError: error => {
            toast.error(error?.message || "Unable to add bank account");
    },
  });
};

export const useUpdateKycStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateKycStatus,
    onSuccess: async data => {
      toast.success(data?.result || "KYC status updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["new-kyc"] }),
        queryClient.invalidateQueries({ queryKey: ["new-accept-kyc"] }),
        queryClient.invalidateQueries({ queryKey: ["rejected-kyc-history-list"] }),
        queryClient.refetchQueries({ queryKey: ["new-kyc"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["new-accept-kyc"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["rejected-kyc-history-list"], type: "active" }),
      ]);
    },
    onError: error => {
      toast.error(error?.message || "Failed to update KYC status");
    },
  });
};

export const useUpdateBankKycStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBankKycStatus,
    onSuccess: async data => {
      toast.success(data?.result || "Bank KYC status updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["new-bank-kyc"] }),
        queryClient.invalidateQueries({ queryKey: ["bank-accepted-kyc-list"] }),
        queryClient.invalidateQueries({ queryKey: ["bank-rejected-history-list"] }),
        queryClient.refetchQueries({ queryKey: ["new-bank-kyc"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["bank-accepted-kyc-list"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["bank-rejected-history-list"], type: "active" }),
      ]);
    },
    onError: error => {
      toast.error(error?.message || "Failed to update Bank KYC status");
    },
  });
};
