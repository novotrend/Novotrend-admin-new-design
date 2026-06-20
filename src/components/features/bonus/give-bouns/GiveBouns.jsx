"use client";

import { useForm } from "react-hook-form";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { useVerifyUserEmail } from "@/hooks/useVerifyUserEmail";
import { useGiveBonusMutation } from "@/services/bouns/bouns.mutation";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function GiveBouns() {
  const { register, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      amount: "",
      comment: "",
    },
  });

  const email = watch("email");

  const [debouncedEmail] = useDebounce(email, 600);

  const {
    verifyEmail,
    resetVerification,
    verifiedUser,
    emailVerified,
    isPending: verifying,
  } = useVerifyUserEmail();

  useEffect(() => {
    verifyEmail(debouncedEmail);
  }, [debouncedEmail]);

  const giveBonusMutation = useGiveBonusMutation();
  const onSubmit = values => {
    if (!emailVerified) return;

    giveBonusMutation.mutate(
      {
        usercode: values.email,
        amount: values.amount,
        comment: values.comment,
      },
      {
        onSuccess: () => {
          reset({
            email: "",
            amount: "",
            comment: "",
          });

          resetVerification();
        },
      }
    );
  };

  return (
    <FormSection title="Give Bonus" description="Credit bonus amount directly into user account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* EMAIL */}

          <div>
            <FormInput
              label="Enter Email"
              type="email"
              placeholder="Enter registered email"
              {...register("email", {
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

          {/* AMOUNT */}

          <FormInput
            label="Amount"
            placeholder="Enter Amount Value"
            disabled={!emailVerified}
            {...register("amount", {
              required: emailVerified,
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
          <div className="w-[220px]">
            <FormSubmit
              title={giveBonusMutation.isPending ? "Submitting..." : "Submit"}
              disabled={!emailVerified || giveBonusMutation.isPending}
            />
          </div>
        </div>
      </form>
    </FormSection>
  );
}
