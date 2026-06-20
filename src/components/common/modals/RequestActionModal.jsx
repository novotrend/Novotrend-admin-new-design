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
import { useState } from "react";

export default function RequestActionModal({ open, onOpenChange }) {
  const [remark, setRemark] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border border-border bg-background p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Accepted KYC
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm text-muted-foreground">
            Enter the rejection remark before rejecting the KYC request.
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-8">
          <FormInput
            label="Enter Reject Remark"
            placeholder="Enter reject remark..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 border-t border-border px-8 py-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-2xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-all hover:bg-muted cursor-pointer"
          >
            Cancel
          </button>

          <FormSubmit title="Sure" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
