"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSelect from "@/components/common/forms/FormSelect";
import FormSubmit from "@/components/common/forms/FormSubmit";

import { useVerifyUserEmail } from "@/hooks/useVerifyUserEmail";
import { decryptData } from "@/lib/utils";

import { useGetMT5GroupListQuery } from "@/services/groups/group.query";
import { useCreateMT5AccountMutation } from "@/services/users/user.mutation";

const leverageOptions = ["10", "50", "100", "200", "300", "400", "500", "1000"];
const defaultSuccessMessage = "MT5 Account created successfully";

const getSuccessMessage = response => {
  if (typeof response?.result !== "string") {
    return response?.result?.result || response?.result?.message || defaultSuccessMessage;
  }

  try {
    const decryptedResult = decryptData(response.result);

    return (
      decryptedResult?.data?.result ||
      decryptedResult?.result ||
      decryptedResult?.message ||
      (typeof decryptedResult === "string" ? decryptedResult : defaultSuccessMessage)
    );
  } catch {
    return defaultSuccessMessage;
  }
};

export default function CreateMT5Account() {
  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showInvestorPassword, setShowInvestorPassword] = useState(false);

  const {
    verifyEmail,
    verifiedUser,
    emailVerified,
    isPending: verifying,
    resetVerification,
  } = useVerifyUserEmail();

  const { register, watch, handleSubmit, setValue, reset } = useForm();

  const email = watch("mt5AccountEmail");

  const [debouncedEmail] = useDebounce(email, 600);

  // AUTO VERIFY EMAIL
  useEffect(() => {
    verifyEmail(debouncedEmail);
  }, [debouncedEmail]);

  // CREATE ACCOUNT
  const { mutate: createAccount, isPending } = useCreateMT5AccountMutation();

  // GROUP LIST
  const { data: groupData } = useGetMT5GroupListQuery({ status: 1 });

  const groupOptions =
    groupData?.response?.group_list
      ?.filter(group => group.status?.toLowerCase() === "active")
      ?.map(group => ({
        label: group.name,
        value: group.id,
      })) || [];

  // SUBMIT
  const onSubmit = values => {
    createAccount(
      {
        email,
        selectgroup: values.selectgroup,
        accleverage: values.accleverage,
        mainpassword: values.mt5MainPassword,
        investorpassword: values.mt5InvestorPassword,
      },
      {
        onSuccess: response => {
          toast.success(getSuccessMessage(response));

          reset();
          resetVerification();
        },

        onError: error => {
          toast.error(error?.message || "Failed to create MT5 account");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <FormSection
        title="Create MT5 Account"
        description="Generate and manage new MT5 trading accounts"
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid gap-6 md:grid-cols-2">
            {/* EMAIL */}
            <div>
              <FormInput
                label="Enter Email"
                type="email"
                placeholder="Enter registered email"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                {...register("mt5AccountEmail", {
                  required: true,
                })}
              />

              {verifying && <p className="mt-2 text-sm text-primary">Checking email...</p>}

              {emailVerified === true && (
                <p className="mt-2 text-sm font-medium text-green-600">✓ {verifiedUser}</p>
              )}

              {emailVerified === false && (
                <p className="mt-2 text-sm font-medium text-red-500">Invalid Email</p>
              )}
            </div>

            {/* GROUP */}
            <FormSelect
              label="Select Group"
              placeholder={
                groupOptions.length ? "Choose account group" : "No active groups available"
              }
              options={groupOptions}
              disabled={!verifiedUser}
              onValueChange={v => setValue("selectgroup", v)}
            />

            {/* LEVERAGE */}
            <FormSelect
              label="Select Leverage"
              placeholder="Choose leverage"
              options={leverageOptions}
              disabled={!verifiedUser}
              onValueChange={v => setValue("accleverage", v)}
            />

            {/* MAIN PASSWORD */}
            <FormInput
              label="Enter Main Password"
              type={showMainPassword ? "text" : "password"}
              placeholder="Enter main password"
              disabled={!verifiedUser}
              autoComplete="new-password"
              data-lpignore="true"
              data-1p-ignore="true"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowMainPassword(prev => !prev)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!verifiedUser}
                  aria-label={showMainPassword ? "Hide main password" : "Show main password"}
                >
                  {showMainPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register("mt5MainPassword")}
            />

            {/* INVESTOR PASSWORD */}
            <FormInput
              label="Enter Investor Password"
              type={showInvestorPassword ? "text" : "password"}
              placeholder="Enter investor password"
              disabled={!verifiedUser}
              autoComplete="new-password"
              data-lpignore="true"
              data-1p-ignore="true"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowInvestorPassword(prev => !prev)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!verifiedUser}
                  aria-label={
                    showInvestorPassword ? "Hide investor password" : "Show investor password"
                  }
                >
                  {showInvestorPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              {...register("mt5InvestorPassword")}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <FormSubmit title="Create Account" disabled={!verifiedUser || isPending} />
          </div>
        </form>
      </FormSection>
    </div>
  );
}
