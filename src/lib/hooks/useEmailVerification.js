import { useGetUsernameByEmailMutation } from "@/services/users/user.mutation";
import { useState } from "react";

export const useEmailVerification = () => {
  const [verifiedUser, setVerifiedUser] = useState(null);

  const verifyMutation = useGetUsernameByEmailMutation();

  const verifyEmail = async (email) => {
    try {
      const response = await verifyMutation.mutateAsync({
        email,
      });

      setVerifiedUser(response?.username || response?.data);

      return response;
    } catch (error) {
      setVerifiedUser(null);
      throw error;
    }
  };

  return {
    verifyEmail,
    verifiedUser,
    isVerifying: verifyMutation.isPending,
  };
};
