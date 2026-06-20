import { useMutation } from "@tanstack/react-query";
import { addGasInfo } from "./gasInfo.service";

export const useAddGasInfoMutation = () => {
  return useMutation({
    mutationFn: addGasInfo,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};
