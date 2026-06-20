import { useGetUsernameByEmailMutation } from "@/services/users/user.mutation";
import { useState } from "react";

export const useVerifyUserEmail = () => {
  const [verifiedUser, setVerifiedUser] = useState("");
  const [emailVerified, setEmailVerified] = useState(null);

  const { mutate, isPending } = useGetUsernameByEmailMutation();

  const isValidEmailFormat = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const resetVerification = () => {
    setVerifiedUser("");
    setEmailVerified(null);
  };

  const verifyEmail = (email, onSuccessCallback) => {
    const trimmedEmail = email?.trim();

    // Empty email
    if (!trimmedEmail) {
      resetVerification();
      return;
    }

    // Invalid email format
    if (!isValidEmailFormat(trimmedEmail)) {
      resetVerification();
      return;
    }

    setEmailVerified(null);

    mutate(
      { email: trimmedEmail },
      {
        onSuccess: response => {
          const returnedEmail = response?.response?.user_email?.trim()?.toLowerCase();

          const enteredEmail = trimmedEmail.toLowerCase();

          const isValidUser = response?.status === 200 && returnedEmail === enteredEmail;

          if (!isValidUser) {
            setEmailVerified(false);
            setVerifiedUser("");
            return;
          }

          const userName =
            response?.response?.user_name ||
            response?.response?.name ||
            response?.response?.username ||
            "";

          setVerifiedUser(userName);
          setEmailVerified(true);

          onSuccessCallback?.(response);
        },

        onError: () => {
          setEmailVerified(false);
          setVerifiedUser("");
        },
      }
    );
  };

  return {
    verifyEmail,
    verifiedUser,
    emailVerified,
    isPending,
    resetVerification,
  };
};
