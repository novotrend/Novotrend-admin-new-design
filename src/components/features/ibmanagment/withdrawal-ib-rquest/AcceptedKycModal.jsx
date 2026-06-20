"use client";

import { useEffect, useState } from "react";

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

export default function WithdrawalAcceptedKycModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  actionType = 1,
}) {
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (open) {
      setRemark("");
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit?.(remark);
  };

  const handleClose = () => {
    if (isLoading) return;

    setRemark("");
    onOpenChange(false);
  };

  const isReject = actionType === 2;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg overflow-hidden rounded-3xl border border-border bg-background p-0">
        <DialogHeader className="border-b border-border px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {isReject
              ? "Reject Withdrawal Request"
              : "Approve Withdrawal Request"}
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm text-muted-foreground">
            {isReject
              ? "Enter a remark before rejecting the withdrawal request."
              : "You may add an optional remark before approving the withdrawal request."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-8">
          <FormInput
            label="Remark"
            placeholder={
              isReject
                ? "Enter rejection remark..."
                : "Enter approval remark (optional)..."
            }
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 border-t border-border px-8 py-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleClose}
            className="h-11 cursor-pointer rounded-2xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <FormSubmit
            title={
              isLoading
                ? "Please wait..."
                : isReject
                  ? "Reject Request"
                  : "Approve Request"
            }
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={
              isReject
                ? "w-auto bg-red-500 hover:bg-red-600"
                : "w-auto bg-green-500 hover:bg-green-600"
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
