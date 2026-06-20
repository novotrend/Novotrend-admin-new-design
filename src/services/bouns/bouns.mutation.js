import { decryptData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { giveBonus, removeFromWallet } from "./bouns.service";

export const useGiveBonusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: giveBonus,
    onSuccess: response => {
      let successMessage = "Bonus added successfully";
      try {
        if (typeof response?.result === "string") {
          const decryptedResult = decryptData(response?.result);
          successMessage =
            decryptedResult?.data?.result || decryptedResult?.result || successMessage;
        }
      } catch (error) {
              }
      toast.success(successMessage);
      queryClient.invalidateQueries({
        queryKey: ["bonus-list"],
      });

          },
    onError: error => {
      toast.error(error?.message || "Failed to add bonus");
          },
  });
};

export const useRemoveFromWalletMutation = () => {
  return useMutation({
    mutationFn: removeFromWallet,
    onSuccess: response => {
      let successMessage = "Amount removed successfully";
      try {
        if (typeof response?.result === "string") {
          const decryptedResult = decryptData(response.result);
                    successMessage =
            decryptedResult?.data?.result || decryptedResult?.result || successMessage;
        }
      } catch (error) {
              }
      toast.success(successMessage);
          },
    onError: error => {
      toast.error(error?.message || "Something went wrong");
          },
  });
};
