"use client";

import { useState } from "react";
import { toast } from "sonner";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { ibMoveSchema } from "@/services/ib-managment/ib-managment.validation";
import { useIBMoveMutation } from "@/services/ib-managment/ib-managment.query";
import { useGetUsernameByEmailMutation } from "@/services/users/user.mutation";

export default function IBMove() {
  const [errors, setErrors] = useState({});

  const [targetVerified, setTargetVerified] = useState(null);
  const [uplineVerified, setUplineVerified] = useState(null);

  const [targetVerifyError, setTargetVerifyError] = useState("");
  const [uplineVerifyError, setUplineVerifyError] = useState("");

  const [formData, setFormData] = useState({
    user_ref_code: "",
    user_ref_code2: "",
  });

  const ibMoveMutation = useIBMoveMutation();

  const targetVerifyMutation = useGetUsernameByEmailMutation();
  const uplineVerifyMutation = useGetUsernameByEmailMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "user_ref_code") {
      setTargetVerified(null);
      setTargetVerifyError("");
    }

    if (name === "user_ref_code2") {
      setUplineVerified(null);
      setUplineVerifyError("");
    }
  };

  const handleVerifyTarget = async () => {
    if (!formData.user_ref_code?.trim()) return;

    try {
      setTargetVerifyError("");

      const response = await targetVerifyMutation.mutateAsync({
        email: formData.user_ref_code,
      });

      setTargetVerified(response);
    } catch (error) {
      setTargetVerified(null);

      setTargetVerifyError(error?.message || "Target user not found");
    }
  };

  const handleVerifyUpline = async () => {
    if (!formData.user_ref_code2?.trim()) return;

    try {
      setUplineVerifyError("");

      const response = await uplineVerifyMutation.mutateAsync({
        email: formData.user_ref_code2,
      });

      setUplineVerified(response);
    } catch (error) {
      setUplineVerified(null);

      setUplineVerifyError(error?.message || "Upline user not found");
    }
  };

  const handleSubmit = async () => {
    setErrors({});

    const validation = ibMoveSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    if (!targetVerified) {
      setTargetVerifyError("Please verify target email");
      return;
    }

    if (!uplineVerified) {
      setUplineVerifyError("Please verify new upline email");
      return;
    }

    try {
      await ibMoveMutation.mutateAsync(formData);

      toast.success("IB Move completed successfully");

      setFormData({
        user_ref_code: "",
        user_ref_code2: "",
      });

      setErrors({});

      setTargetVerified(null);
      setUplineVerified(null);

      setTargetVerifyError("");
      setUplineVerifyError("");
    } catch (error) {
      toast.error(error?.message || "Failed to process IB Move");
    }
  };

  return (
    <FormSection
      title="Generate Client Deposit"
      description="Create new MT5 trading group"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <FormInput
            label="Enter Target Email"
            placeholder="Enter Email"
            name="user_ref_code"
            value={formData.user_ref_code}
            onChange={handleChange}
            onBlur={handleVerifyTarget}
            error={errors.user_ref_code || targetVerifyError}
          />

          {targetVerifyMutation.isPending && (
            <p className="mt-1 text-xs text-blue-500">
              Verifying target email...
            </p>
          )}

          {targetVerified && (
            <p className="mt-1 text-xs text-green-600">
              {targetVerified.response?.user_name}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="New Upline Email"
            placeholder="Enter New Upline Email"
            name="user_ref_code2"
            value={formData.user_ref_code2}
            onChange={handleChange}
            onBlur={handleVerifyUpline}
            error={errors.user_ref_code2 || uplineVerifyError}
          />

          {uplineVerifyMutation.isPending && (
            <p className="mt-1 text-xs text-blue-500">
              Verifying upline email...
            </p>
          )}

          {uplineVerified && (
            <p className="mt-1 text-xs text-green-600">
              {uplineVerified.response?.user_name}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <FormSubmit
          title={ibMoveMutation.isPending ? "Submitting..." : "Submit"}
          onClick={handleSubmit}
          disabled={
            ibMoveMutation.isPending ||
            targetVerifyMutation.isPending ||
            uplineVerifyMutation.isPending
          }
        />
      </div>
    </FormSection>
  );
}