"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";

import { useVerifyUserEmail } from "@/hooks/useVerifyUserEmail";
import { useCreateInternalTransferMutation } from "@/services/internal-transfer/internal-transfer.query";
import { internalTransferSchema } from "@/services/internal-transfer/internal-transfer.validation";

export default function InternalTransfer() {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    sender: "",
    receiver: "",
    amount: "",
    comment: "",
  });

  const transferMutation = useCreateInternalTransferMutation();

  // Sender email verification
  const {
    verifiedUser: senderVerifiedUser,
    emailVerified: senderEmailVerified,
    verifyEmail: verifySenderEmail,
    isPending: senderVerifying,
    resetVerification: resetSenderVerification,
  } = useVerifyUserEmail();

  // Receiver email verification
  const {
    verifiedUser: receiverVerifiedUser,
    emailVerified: receiverEmailVerified,
    verifyEmail: verifyReceiverEmail,
    isPending: receiverVerifying,
    resetVerification: resetReceiverVerification,
  } = useVerifyUserEmail();

  const [debouncedSender] = useDebounce(formData.sender, 600);
  const [debouncedReceiver] = useDebounce(formData.receiver, 600);

  // Auto-verify sender email
  useEffect(() => {
    verifySenderEmail(debouncedSender);
  }, [debouncedSender]);

  // Auto-verify receiver email
  useEffect(() => {
    verifyReceiverEmail(debouncedReceiver);
  }, [debouncedReceiver]);

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "amount" && value !== "" && Number(value) <= 0) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setErrors(prev => ({
        ...prev,
        amount: "Amount must be greater than 0",
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    setErrors({});

    const validation = internalTransferSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    if (senderEmailVerified !== true) {
      setErrors(prev => ({
        ...prev,
        sender: "Please verify sender email",
      }));
      return;
    }

    if (receiverEmailVerified !== true) {
      setErrors(prev => ({
        ...prev,
        receiver: "Please verify receiver email",
      }));
      return;
    }

    if (formData.sender.trim().toLowerCase() === formData.receiver.trim().toLowerCase()) {
      setErrors(prev => ({
        ...prev,
        receiver: "Sender and Receiver cannot be same",
      }));
      return;
    }

    try {
      await transferMutation.mutateAsync(formData);
      toast.success("Internal transfer created successfully");
      setFormData({
        sender: "",
        receiver: "",
        amount: "",
        comment: "",
      });

      setErrors({});
      resetSenderVerification();
      resetReceiverVerification();
    } catch (error) {
      toast.error(error?.message || "Failed to create internal transfer");
    }
  };

  return (
    <FormSection title="Internal Transfer">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <FormInput
            label="Sender Email"
            placeholder="Enter Sender Email"
            name="sender"
            value={formData.sender}
            onChange={handleChange}
            error={errors.sender || (senderEmailVerified === false ? "Invalid Email" : "")}
          />

          {senderVerifying && <p className="mt-2 text-sm text-blue-500">Verifying sender...</p>}

          {senderEmailVerified === true && (
            <p className="mt-2 text-sm font-medium text-green-600">✓ {senderVerifiedUser}</p>
          )}
        </div>

        <div>
          <FormInput
            label="Receiver Email"
            placeholder="Enter Receiver Email"
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            error={errors.receiver || (receiverEmailVerified === false ? "Invalid Email" : "")}
          />

          {receiverVerifying && <p className="mt-2 text-sm text-blue-500">Verifying receiver...</p>}

          {receiverEmailVerified === true && (
            <p className="mt-2 text-sm font-medium text-green-600">✓ {receiverVerifiedUser}</p>
          )}
        </div>

        <FormInput
          label="Amount"
          min="0"
          onWheel={e => e.target.blur()}
          placeholder="Enter Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
        />

        <FormInput
          label="Comment"
          placeholder="Enter Comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          error={errors.comment}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <FormSubmit
          title={transferMutation.isPending ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={transferMutation.isPending || senderVerifying || receiverVerifying}
        />
      </div>
    </FormSection>
  );
}
