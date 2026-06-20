import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addBankInfo } from "./bank-info.query";

export const useAddBankInfoMutation = () => {
  return useMutation({
    mutationFn: addBankInfo,

    onSuccess: (response) => {
      toast.success(response?.message || "Bank details added successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    },
  });
};
