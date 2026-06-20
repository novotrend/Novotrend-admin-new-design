"use client";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSelect from "@/components/common/forms/FormSelect";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { useVerifyUserEmail } from "@/hooks/useVerifyUserEmail";
import {
  useChangeMT5PasswordMutation,
  useGetMT5AccountByEmailMutation,
} from "@/services/users/user.mutation";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const typeOptions = ["Both", "Main Password", "Investor Password"];

export default function ChangeMT5PasswordForm() {
  const [mt5Accounts, setMT5Accounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [formError, setFormError] = useState("");
  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showInvestorPassword, setShowInvestorPassword] = useState(false);
  const { register, watch, handleSubmit, reset } = useForm();
  const email = watch("email");
  const [debouncedEmail] = useDebounce(email, 600);
  const { mutate: fetchAccounts, isPending: accountLoading } = useGetMT5AccountByEmailMutation();

  const {
    verifyEmail,
    verifiedUser,
    emailVerified,
    isPending: verifying,
    resetVerification,
  } = useVerifyUserEmail();

  useEffect(() => {
    if (!debouncedEmail?.trim()) {
      setMT5Accounts([]);
      setSelectedAccount("");
      return;
    }
    verifyEmail(debouncedEmail, () => {
      fetchAccounts(
        { email: debouncedEmail },
        {
          onSuccess: accountData => {
            const accounts =
              accountData?.response?.accounts?.map(item => ({
                label: item.accno,
                value: item.accno,
              })) || [];

            setMT5Accounts(accounts);
          },
          onError: () => {
            setMT5Accounts([]);
            setSelectedAccount("");
          },
        }
      );
    });
  }, [debouncedEmail]);

  useEffect(() => {
    if (emailVerified === false) {
      setMT5Accounts([]);
      setSelectedAccount("");
    }
  }, [emailVerified]);
  // change mt5 password mutation (to be implemented)
  const { mutate: changePassword, isPending: changingPassword } = useChangeMT5PasswordMutation();

  const handleChangePassword = data => {
    setFormError("");

    if (selectedType === "Both" && (!data.mainpassword || !data.investorpassword)) {
      setFormError("Please enter both passwords.");
      return;
    }

    if (selectedType === "Main Password" && !data.mainpassword) {
      setFormError("Please enter main password.");
      return;
    }

    if (selectedType === "Investor Password" && !data.investorpassword) {
      setFormError("Please enter investor password.");
      return;
    }

    changePassword(
      {
        accountnumber: selectedAccount,
        passwordtype:
          selectedType === "Both" ? "both" : selectedType === "Main Password" ? "main" : "investor",
        mainpassword: data.mainpassword,
        investorpassword: data.investorpassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          reset();
          resetVerification();
          setMT5Accounts([]);
          setSelectedAccount("");
          setSelectedType("");
          setFormError("");
        },
        onError: error => {
          const message = error?.message || "Failed to change password";
          setFormError(message);
        },
      }
    );
  };

  const mainPasswordToggle = (
    <button
      type="button"
      onClick={() => setShowMainPassword(prev => !prev)}
      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
      aria-label={showMainPassword ? "Hide main password" : "Show main password"}
    >
      {showMainPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  const investorPasswordToggle = (
    <button
      type="button"
      onClick={() => setShowInvestorPassword(prev => !prev)}
      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
      aria-label={showInvestorPassword ? "Hide investor password" : "Show investor password"}
    >
      {showInvestorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <FormSection
        title="Change MT5 Password"
        description="Manage and update MT5 trading account passwords"
      >
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <FormInput
                label="Enter Email"
                type="email"
                placeholder="Enter registered email"
                {...register("email")}
              />

              {verifying && <p className="mt-2 text-sm text-primary">Checking email...</p>}

              {emailVerified === true && (
                <p className="mt-2 text-sm font-medium text-green-500">✓ {verifiedUser}</p>
              )}

              {emailVerified === false && (
                <p className="mt-2 text-sm font-medium text-red-500">Invalid Email</p>
              )}
            </div>
            <FormSelect
              label="Select Account"
              placeholder={
                accountLoading
                  ? "Loading accounts..."
                  : mt5Accounts.length
                    ? "Choose MT5 account"
                    : "No accounts found"
              }
              options={mt5Accounts}
              disabled={!emailVerified || accountLoading}
              value={selectedAccount}
              onValueChange={value => {
                setSelectedAccount(value);
                setFormError("");
              }}
            />
            <FormSelect
              label="Select Type"
              placeholder="Choose password type"
              options={typeOptions}
              value={selectedType}
              onValueChange={value => {
                setSelectedType(value);
                setFormError("");
              }}
            />
            {selectedType === "Both" && (
              <>
                <FormInput
                  label="Main Password"
                  type={showMainPassword ? "text" : "password"}
                  placeholder="Enter main password"
                  rightElement={mainPasswordToggle}
                  {...register("mainpassword", {
                    onChange: () => setFormError(""),
                  })}
                />

                <FormInput
                  label="Investor Password"
                  type={showInvestorPassword ? "text" : "password"}
                  placeholder="Enter investor password"
                  rightElement={investorPasswordToggle}
                  {...register("investorpassword", {
                    onChange: () => setFormError(""),
                  })}
                />
              </>
            )}
            {selectedType === "Main Password" && (
              <FormInput
                label="Main Password"
                type={showMainPassword ? "text" : "password"}
                placeholder="Enter main password"
                rightElement={mainPasswordToggle}
                {...register("mainpassword", {
                  onChange: () => setFormError(""),
                })}
              />
            )}
            {selectedType === "Investor Password" && (
              <FormInput
                label="Investor Password"
                type={showInvestorPassword ? "text" : "password"}
                placeholder="Enter investor password"
                rightElement={investorPasswordToggle}
                {...register("investorpassword", {
                  onChange: () => setFormError(""),
                })}
              />
            )}
          </div>

          {changingPassword && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-primary">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <span className="text-sm font-semibold">Changing password...</span>
            </div>
          )}

          {formError && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
              {formError}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <FormSubmit
              title={changingPassword ? "Changing..." : "Change Password"}
              disabled={!emailVerified || !selectedAccount || !selectedType || changingPassword}
            />
          </div>
        </form>
      </FormSection>
    </div>
  );
}
