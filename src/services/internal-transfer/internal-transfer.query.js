import { useMutation } from "@tanstack/react-query";
import { createInternalTransfer } from "./internal-transfer.service";

export const useCreateInternalTransferMutation = () => {
  return useMutation({
    mutationFn: createInternalTransfer,
  });
};
