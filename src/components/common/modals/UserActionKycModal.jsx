"use client";

import { useState } from "react";

import FormInput from "@/components/common/forms/FormInput";
import FormSubmit from "@/components/common/forms/FormSubmit";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useUpdateBankKycStatusMutation,
  useUpdateKycStatusMutation,
} from "@/services/userkyc/userkyc.mutation";

export default function UserActionKycModal({ open, onOpenChange, actionData, type = "kyc" }) {
  const [remark, setRemark] = useState("");

  const { mutate: updateKycStatus, isPending: kycLoading } = useUpdateKycStatusMutation();

  const { mutate: updateBankKycStatus, isPending: bankLoading } = useUpdateBankKycStatusMutation();

  const isPending = kycLoading || bankLoading;

  const handleSubmit = () => {
    if (!actionData?.data) return;

    if (type === "bankKyc") {
      updateBankKycStatus(
        {
          kyc_id: actionData.data.kyc_id,
          status: actionData.status,
          remark,
        },
        {
          onSuccess: () => {
            setRemark("");
            onOpenChange(false);
          },
        }
      );

      return;
    }

    updateKycStatus(
      {
        id: actionData.data.kyc_id,
        status: actionData.status,
        remark,
      },
      {
        onSuccess: () => {
          setRemark("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border border-border bg-background p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {actionData?.status === 1
              ? type === "bankKyc"
                ? "Accept Bank KYC"
                : "Accept KYC"
              : type === "bankKyc"
                ? "Reject Bank KYC"
                : "Reject KYC"}
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm text-muted-foreground">
            {actionData?.status === 1
              ? `Enter remark before accepting the ${
                  type === "bankKyc" ? "Bank KYC" : "KYC"
                } request.`
              : `Enter remark before rejecting the ${
                  type === "bankKyc" ? "Bank KYC" : "KYC"
                } request.`}
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-8">
          <FormInput
            label={actionData?.status === 1 ? "Enter Accept Remark" : "Enter Reject Remark"}
            placeholder={
              actionData?.status === 1 ? "Enter accept remark..." : "Enter reject remark..."
            }
            value={remark}
            onChange={e => setRemark(e.target.value)}
          />
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 border-t border-border px-8 py-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-11 rounded-2xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-all hover:bg-muted cursor-pointer"
          >
            Cancel
          </button>

          <FormSubmit
            title={isPending ? "Processing..." : "Sure"}
            onClick={handleSubmit}
            disabled={isPending}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
