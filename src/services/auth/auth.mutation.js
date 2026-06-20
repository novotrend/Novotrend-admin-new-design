import { useMutation } from "@tanstack/react-query";
import { loginUser, verifyAuthCode } from "./auth.service";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useAuthMutation = () => {
  return useMutation({
    mutationFn: verifyAuthCode,
  });
};
