"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSelect from "@/components/common/forms/FormSelect";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { useVerifyUserEmail } from "@/hooks/useVerifyUserEmail";
import { useCreateClientWithdrawalMutation } from "@/services/transaction/transaction.query";
import { withdrawalSchema } from "@/services/transaction/transaction.validation";
import { useDebounce } from "use-debounce";

export default function ClientWithDraw() {
  const [errors, setErrors] = useState({});
  const [emailVerificationError, setEmailVerificationError] = useState("");

  const [formData, setFormData] = useState({
    usercode: "",
    amount: "",
    comment: "",
    paymethod: "",
    chainname: "",
    wallet_address: "",
  });

  const {
    verifyEmail,
    verifiedUser: verifiedEmailUser,
    emailVerified,
    isPending: verifying,
    resetVerification,
  } = useVerifyUserEmail();
  const withdrawalMutation = useCreateClientWithdrawalMutation();

  const [debouncedUsercode] = useDebounce(formData.usercode, 600);
  const isCryptoPayment = formData.paymethod === "Crypto";

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
      chainname: value === "Crypto" ? prev.chainname : "",
      wallet_address: value === "Crypto" ? prev.wallet_address : "",
    }));

    setErrors(prev => ({
      ...prev,
      paymethod: "",
      chainname: "",
      wallet_address: "",
    }));
  };

  const handleChainChange = value => {
    setFormData(prev => ({
      ...prev,
      chainname: value,
    }));

    setErrors(prev => ({
      ...prev,
      chainname: "",
    }));
  };

  const handleSubmit = async () => {
    setErrors({});
    const validation = withdrawalSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!verifiedEmailUser) {
      setEmailVerificationError("Please verify email before submitting");
      return;
    }

    try {
      await withdrawalMutation.mutateAsync(formData);
      toast.success("Withdrawal request created successfully");
      setFormData({
        usercode: "",
        amount: "",
        comment: "",
        paymethod: "",
        chainname: "",
        wallet_address: "",
      });

      setErrors({});
      resetVerification();
      setEmailVerificationError("");
    } catch (error) {
      toast.error(error?.message || "Failed to create withdrawal request");
    }
  };

  return (
    <FormSection title="Generate Client Withdraw" description="Create new MT5 trading group">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <FormInput
            label="Enter Email"
            placeholder="Enter Email"
            name="usercode"
            type="email"
            value={formData.usercode}
            onChange={handleChange}
            error={
              errors.usercode ||
              (emailVerified === false ? "Invalid Email" : emailVerificationError)
            }
          />

          {verifying && <p className="mt-2 text-sm text-blue-500">Verifying email...</p>}

          {verifiedEmailUser && (
            <p className="mt-2 text-sm text-green-600">✓ {verifiedEmailUser}</p>
          )}
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

        {isCryptoPayment && (
          <>
            <FormSelect
              label="Chain Select"
              placeholder="Select Chain"
              value={formData.chainname}
              onValueChange={handleChainChange}
              error={errors.chainname}
              options={[
                { label: "BSC", value: "BSC" },
                { label: "TRC20", value: "TRC20" },
                { label: "ETH", value: "ETH" },
                { label: "Polygon", value: "Polygon" },
              ]}
            />

            <FormInput
              label="Wallet Address"
              placeholder="Enter Wallet Address"
              name="wallet_address"
              value={formData.wallet_address}
              onChange={handleChange}
              error={errors.wallet_address}
            />
          </>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <FormSubmit
          title={withdrawalMutation.isPending ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={!verifiedEmailUser || withdrawalMutation.isPending || verifying}
        />
      </div>
    </FormSection>
  );
}
