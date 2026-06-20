"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSelect from "@/components/common/forms/FormSelect";
import FormSubmit from "@/components/common/forms/FormSubmit";

import { useVerifyUserAccount } from "@/hooks/useVerifyUserAccount";
import { decryptData } from "@/lib/utils";
import { useChangeMT5LeverageMutation } from "@/services/users/user.mutation";

const leverageOptions = ["10", "50", "100", "200", "300", "400", "500", "1000"];

export default function ChangeMT5Leverage() {
  const { register, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      accno: "",
      leverage: "",
    },
  });

  const accno = watch("accno");
  const { verifiedUser, accountVerified, verifying, resetVerification } =
    useVerifyUserAccount(accno);
  const { mutate: changeLeverage, isPending: changingLeverage } = useChangeMT5LeverageMutation();

  const handleChangeLeverage = values => {
    if (!accountVerified) return;
    changeLeverage(
      {
        accno: values.accno,
        leverage: values.leverage,
      },
      {
        onSuccess: data => {
          let successMessage = "Leverage changed successfully";
          try {
            if (typeof data?.result === "string") {
              const decryptedResult = decryptData(data.result);
              successMessage =
                decryptedResult?.data?.result || decryptedResult?.result || successMessage;
            }
          } catch (error) {
                      }
          toast.success(successMessage);
          resetVerification();
        },

        onError: error => {
          toast.error(error?.message || "Failed to change leverage");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <form onSubmit={handleSubmit(handleChangeLeverage)}>
        <FormSection
          title="Change MT5 Leverage"
          description="Update and manage MT5 trading account leverage settings"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* MT5 ID */}

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

            {/* LEVERAGE */}

            <FormSelect
              label="Select Leverage"
              placeholder="Choose leverage"
              options={leverageOptions}
              disabled={!accountVerified}
              onValueChange={v => setValue("leverage", v)}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <FormSubmit
              title={changingLeverage ? "Changing..." : "Change Leverage"}
              disabled={!accountVerified || changingLeverage}
            />
          </div>
        </FormSection>
      </form>
    </div>
  );
}
