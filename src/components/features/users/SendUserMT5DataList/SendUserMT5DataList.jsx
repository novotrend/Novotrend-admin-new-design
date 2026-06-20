"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";

import { useVerifyUserAccount } from "@/hooks/useVerifyUserAccount";
import { useSendVerificationMailMT5Mutation } from "@/services/users/user.mutation";

export default function SendUserMT5DataList() {
  const { register, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      accno: "",
    },
  });

  const accno = watch("accno");

  const { verifiedUser, accountVerified, verifying, resetVerification } =
    useVerifyUserAccount(accno);

  const { mutate: sendMail, isPending: sendingMail } = useSendVerificationMailMT5Mutation();

  const handleSendMail = values => {
    if (!accountVerified) return;

    sendMail(
      {
        accountno: values.accno,
      },
      {
        onSuccess: data => {
          toast.success(data?.result || "Mail sent successfully");

          reset({
            accno: "",
          });

          resetVerification();
        },

        onError: error => {
          toast.error(error?.message || "Failed to send mail");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <form onSubmit={handleSubmit(handleSendMail)}>
        <FormSection
          title="Send MT5 Data Mail"
          description="Send MT5 account details directly to user email"
        >
          <div className="grid gap-6 md:grid-cols-1">
            <div>
              <FormInput
                label="Enter MT5 ID"
                type="text"
                placeholder="Enter MT5 account ID"
                {...register("accno", {
                  required: true,
                })}
              />

              {verifying && <p className="mt-2 text-sm text-primary">Checking MT5 ID...</p>}

              {accountVerified === true && (
                <p className="mt-2 text-sm font-medium text-green-600">✓ {verifiedUser}</p>
              )}

              {accountVerified === false && (
                <p className="mt-2 text-sm font-medium text-red-500">Invalid MT5 ID</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <FormSubmit
              title={sendingMail ? "Sending..." : "Send Mail"}
              disabled={!accountVerified || sendingMail}
            />
          </div>
        </FormSection>
      </form>
    </div>
  );
}
