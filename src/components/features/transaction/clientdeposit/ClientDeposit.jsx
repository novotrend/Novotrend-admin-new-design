"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSelect from "@/components/common/forms/FormSelect";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { depositSchema } from "@/services/transaction/transaction.validation";
import { useDebounce } from "use-debounce";

import { useVerifyUserEmail } from "@/hooks/useVerifyUserEmail";
import { useCreateClientDepositMutation } from "@/services/transaction/transaction.query";

export default function ClientDeposit() {
  const [errors, setErrors] = useState({});
  const [emailVerificationError, setEmailVerificationError] = useState("");

  const [formData, setFormData] = useState({
    usercode: "",
    amount: "",
    comment: "",
    paymethod: "",
    transid: "",
  });

  const {
    verifyEmail,
    verifiedUser,
    emailVerified,
    isPending: verifying,
    resetVerification,
  } = useVerifyUserEmail();

  const depositMutation = useCreateClientDepositMutation();

  const [debouncedUsercode] = useDebounce(formData.usercode, 600);

  useEffect(() => {
    verifyEmail(debouncedUsercode);
  }, [debouncedUsercode]);

  const handleChange = e => {
    const { name, value } = e.target;
    const amountError =
      name === "amount" && value !== "" && Number(value) <= 0
        ? "Amount must be greater than 0"
        : "";

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: amountError,
    }));

    if (name === "usercode") {
      resetVerification();
      setEmailVerificationError("");
    }
  };

  const handlePaymentMethod = value => {
    setFormData(prev => ({
      ...prev,
      paymethod: value,
    }));

    setErrors(prev => ({
      ...prev,
      paymethod: "",
    }));
  };

  const handleSubmit = async () => {
    const validation = depositSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!verifiedUser) {
      setEmailVerificationError("Please verify email before submitting");
      return;
    }

    try {
      await depositMutation.mutateAsync(formData);
      toast.success("Deposit created successfully");
      setFormData({
        usercode: "",
        amount: "",
        comment: "",
        paymethod: "",
        transid: "",
      });

      setErrors({});
      resetVerification();
      setEmailVerificationError("");
    } catch (error) {
      toast.error(error?.message || "Failed to create deposit");
    }
  };

  return (
    <FormSection title="Generate Client Deposit" description="Create new MT5 trading group">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <FormInput
            label="Enter Email"
            placeholder="Enter Email"
            name="usercode"
            value={formData.usercode}
            onChange={handleChange}
            error={
              errors.usercode ||
              (emailVerified === false ? "Invalid Email" : emailVerificationError)
            }
          />

          {verifying && <p className="mt-2 text-sm text-blue-500">Verifying email...</p>}

          {verifiedUser && <p className="mt-2 text-sm text-green-600">✓ {verifiedUser}</p>}
        </div>

        <FormInput
          label="Enter Amount (USD)"
          placeholder="Enter amount in usd"
          name="amount"
          type="number"
          min="1"
          onWheel={e => e.target.blur()}
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
        />

        <FormInput
          label="Enter Comment"
          placeholder="Enter comments"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          error={errors.comment}
        />

        <FormSelect
          label="Payment Method"
          placeholder="Select payment method"
          value={formData.paymethod}
          onValueChange={handlePaymentMethod}
          error={errors.paymethod}
          options={[
            { label: "Bank", value: "Bank" },
            { label: "Cash", value: "Cash" },
            { label: "Crypto", value: "Crypto" },
          ]}
        />

        <FormInput
          label="Transaction ID"
          placeholder="Enter Transaction ID"
          name="transid"
          value={formData.transid}
          onChange={handleChange}
          error={errors.transid}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <FormSubmit
          title={depositMutation.isPending ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={!verifiedUser || depositMutation.isPending || verifying}
        />
      </div>
    </FormSection>
  );
}
