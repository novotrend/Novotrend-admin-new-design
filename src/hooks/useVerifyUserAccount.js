import { useGetUsernameByAccountNoMutation } from "@/services/users/user.mutation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export const useVerifyUserAccount = accountNumber => {
  const [verifiedUser, setVerifiedUser] = useState("");
  const [accountVerified, setAccountVerified] = useState(null);

  const [debouncedAccount] = useDebounce(accountNumber?.trim() || "", 600);

  const { mutate, isPending } = useGetUsernameByAccountNoMutation();

  useEffect(() => {
    if (!debouncedAccount) {
      setVerifiedUser("");
      setAccountVerified(null);
      return;
    }

    setAccountVerified(null);

    mutate(
      {
        accno: debouncedAccount,
      },
      {
        onSuccess: response => {
          const userName =
            response?.response?.user_name ||
            response?.response?.name ||
            response?.response?.username ||
            "";

          setVerifiedUser(userName);
          setAccountVerified(true);
        },

        onError: () => {
          setVerifiedUser("");
          setAccountVerified(false);
        },
      }
    );
  }, [debouncedAccount]);

  const resetVerification = () => {
    setVerifiedUser("");
    setAccountVerified(null);
  };

  return {
    verifiedUser,
    accountVerified,
    verifying: isPending,
    resetVerification,
  };
};
