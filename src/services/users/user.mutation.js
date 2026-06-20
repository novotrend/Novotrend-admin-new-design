import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminUserAction,
  changeMT5Leverage,
  changeMT5Password,
  changeMT5PasswordRequestStatus,
  createMT5Account,
  getMT5AccountByEmail,
  getMT5AccountDetails,
  getUserDetails,
  getUserDownline,
  getUsernameByAccountNo,
  getUsernameByEmail,
  sendVerificationMailMT5,
} from "./user.service";

export const useAdminUserActionMutation = () => {
  return useMutation({
    mutationFn: adminUserAction,
  });
};

export const useGetUserDetailsMutation = () => {
  return useMutation({
    mutationFn: getUserDetails,
  });
};

export const useGetUserDownlineMutation = () => {
  return useMutation({
    mutationFn: getUserDownline,
  });
};

// VERIFY EMAIL
export const useGetUsernameByEmailMutation = () => {
  return useMutation({
    mutationFn: getUsernameByEmail,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

//  GET MT5 ACCOUNT
export const useGetMT5AccountByEmailMutation = () => {
  return useMutation({
    mutationFn: getMT5AccountByEmail,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

export const useGetMT5AccountDetailsMutation = () => {
  return useMutation({
    mutationFn: getMT5AccountDetails,
  });
};

// CREATE MT5 ACCOUNT
export const useCreateMT5AccountMutation = () => {
  return useMutation({
    mutationFn: createMT5Account,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

// CHANGE MT5 PASSWORD
export const useChangeMT5PasswordMutation = () => {
  return useMutation({
    mutationFn: changeMT5Password,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

// VERIFY MT5 ACCOUNT NUMBER
export const useGetUsernameByAccountNoMutation = () => {
  return useMutation({
    mutationFn: getUsernameByAccountNo,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

// CHANGE MT5 LEVERAGE
export const useChangeMT5LeverageMutation = () => {
  return useMutation({
    mutationFn: changeMT5Leverage,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

// Send MT5 Data List to Email
export const useSendVerificationMailMT5Mutation = () => {
  return useMutation({
    mutationFn: sendVerificationMailMT5,
    onSuccess: data => {
          },
    onError: error => {
          },
  });
};

export const useChangeMT5PasswordRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeMT5PasswordRequestStatus,
    onSuccess: response => {
      let successMessage = "Status updated successfully";
      try {
        if (typeof response?.result === "string") {
          const decryptedResult = decryptData(response.result);
                    successMessage =
            decryptedResult?.data?.result || decryptedResult?.result || successMessage;
        }
      } catch (error) {
              }
      toast.success(successMessage);
      // Pending List Refresh
      queryClient.invalidateQueries({
        queryKey: ["mt5-password-request"],
      });
      // Accepted List Refresh
      queryClient.invalidateQueries({
        queryKey: ["mt5-password-accepted"],
      });
      // Rejected List Refresh
      queryClient.invalidateQueries({
        queryKey: ["mt5-password-rejected"],
      });
          },
    onError: error => {
      toast.error(error?.message || "Something went wrong");
          },
  });
};
