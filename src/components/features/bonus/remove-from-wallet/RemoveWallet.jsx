"use client";

import { useForm } from "react-hook-form";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";

import { useVerifyUserEmail } from "@/hooks/useVerifyUserEmail";
import { useRemoveFromWalletMutation } from "@/services/bouns/bouns.mutation";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function RemoveWallet() {
  const {
    verifiedUser,
    emailVerified,
    verifyEmail,
    resetVerification,
    isPending: verifying,
  } = useVerifyUserEmail();

  const removeWalletMutation = useRemoveFromWalletMutation();

  const { register, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      amount: "",
      comment: "",
    },
  });
  const email = watch("email");
  const [debouncedEmail] = useDebounce(email, 600);

  useEffect(() => {
    verifyEmail(debouncedEmail);
  }, [debouncedEmail]);
  const onSubmit = values => {
    if (!emailVerified) return;

    removeWalletMutation.mutate(
      {
        usercode: values.email,
        amount: Number(values.amount),
        comment: values.comment,
      },
      {
        onSuccess: () => {
          reset();
          resetVerification();
        },
      }
    );
  };
  return (
    <FormSection title="Remove From Wallet" description="This is form for remove from wallet">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* EMAIL */}

          <div>
            <FormInput
              label="Email"
              type="email"
              placeholder="Enter registered email"
              {...register("email")}
            />

            {verifying && <p className="mt-2 text-sm text-primary">Checking email...</p>}

            {emailVerified === true && (
              <p className="mt-2 text-sm font-medium text-green-500">✓ {verifiedUser}</p>
            )}

            {emailVerified === false && (
              <p className="mt-2 text-sm font-medium text-red-500">Invalid email</p>
            )}
          </div>
          {/* AMOUNT */}

          <FormInput
            label="Amount"
            placeholder="Enter Amount Value"
            disabled={!emailVerified}
            {...register("amount", {
              required: "Amount is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Only digits allowed",
              },
            })}
          />

          {/* COMMENT */}

          <FormInput
            label="Comment"
            placeholder="Enter Comment Value"
            disabled={!emailVerified}
            {...register("comment", {
              required: emailVerified,
            })}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <FormSubmit
            title={removeWalletMutation.isPending ? "Processing..." : "Submit"}
            disabled={!emailVerified || removeWalletMutation.isPending}
          />
        </div>
      </form>
    </FormSection>
  );
}
