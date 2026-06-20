"use client";

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

import { decryptData } from "@/lib/utils";
import { useWithdrawalActionMutation } from "@/services/withdrawalrequest/withdrawal.mutation";
import { useState } from "react";
import { toast } from "sonner";

export default function WithdrawalActionModal({ open, onOpenChange, selectedRequest, actionType }) {
  const [remark, setRemark] = useState("");

  const { mutate: withdrawalAction, isPending } = useWithdrawalActionMutation();

  const handleSubmit = () => {
        if (!remark?.trim()) {
      toast.error("Remark is required");
      return;
    }
    withdrawalAction(
      {
        recordid: selectedRequest?.id,
        remark,
        status: actionType === "accept" ? 1 : 2,
      },
      {
        onSuccess: data => {
          let message = "Withdrawal request updated successfully";
          try {
            const decryptedResult = decryptData(data?.response?.result);
            message = decryptedResult?.data?.result || decryptedResult?.result || message;
          } catch (error) {
                        message = data?.result || message;
          }
          toast.success(message);
          setRemark("");
          onOpenChange(false);
        },
        onError: error => {
          toast.error(error?.message || "Unable to process withdrawal request");
        },
      }
    );
  };
  const isAccept = actionType === "accept";
  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        if (!value) {
          setRemark("");
        }
        onOpenChange(value);
      }}
    >
      <DialogContent className="max-w-lg overflow-hidden rounded-3xl border border-border bg-background p-0">
        <DialogHeader className="border-b border-border px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {isAccept ? "Accept Withdrawal Request" : "Reject Withdrawal Request"}
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm text-muted-foreground">
            {isAccept
              ? "Enter remark before accepting this withdrawal request."
              : "Enter remark before rejecting this withdrawal request."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-8">
          <FormInput
            label="Remark"
            placeholder="Enter remark..."
            value={remark}
            onChange={e => setRemark(e.target.value)}
          />
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 border-t border-border px-8 py-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setRemark("");
              onOpenChange(false);
            }}
            className="h-11 cursor-pointer rounded-2xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Cancel
          </button>

          <FormSubmit title={isPending ? "Processing..." : "Submit"} onClick={handleSubmit} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
