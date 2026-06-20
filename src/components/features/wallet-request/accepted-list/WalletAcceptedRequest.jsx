"use client";

import FormInput from "@/components/common/forms/FormInput";
import ThemeLoader from "@/components/common/ThemeLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { decryptData } from "@/lib/utils";
import { useWalletRequestMutation } from "@/services/walletrequest/wallet.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function WalletAcceptedRequest({ open, onOpenChange, selectedRequest, actionType }) {
  const [remark, setRemark] = useState("");
  const queryClient = useQueryClient();

  const { mutate: walletAction, isPending } = useWalletRequestMutation();

  const handleSubmit = () => {
    if (!remark?.trim()) {
      toast.error("Remark is required");
      return;
    }

    const requestId = selectedRequest?.req_id || selectedRequest?.id;

    if (!requestId) {
      toast.error("Request id missing");
      return;
    }

    walletAction(
      {
        id: requestId,
        transid: selectedRequest?.transaction_id,
        remark,
        status: actionType === "accept" ? "1" : "2",
      },
      {
        onSuccess: async data => {
          let message = "Request updated successfully";
          try {
            const decryptedResult = decryptData(data?.result);
            message = decryptedResult?.data?.result || decryptedResult?.result || message;
          } catch (error) {
            message = data?.result || message;
          }
          toast.success(message);

          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["wallet-request-list"] }),
            queryClient.invalidateQueries({ queryKey: ["accept-wallet-request-list"] }),
            queryClient.invalidateQueries({ queryKey: ["reject-wallet-request-list"] }),
            queryClient.refetchQueries({ queryKey: ["wallet-request-list"], type: "active" }),
            queryClient.refetchQueries({ queryKey: ["accept-wallet-request-list"], type: "active" }),
            queryClient.refetchQueries({ queryKey: ["reject-wallet-request-list"], type: "active" }),
          ]);

          setRemark("");
          onOpenChange(false);
        },
        onError: error => {
          toast.error(error?.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-3xl border border-border bg-background p-0">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <ThemeLoader label="Processing request..." />
          </div>
        )}
        <DialogHeader className="border-b border-border px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {actionType === "accept" ? "Accept Wallet Request" : "Reject Wallet Request"}
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm text-muted-foreground">
            {actionType === "accept"
              ? "Enter remark for accepting this wallet request."
              : "Enter remark for rejecting this wallet request."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-8">
          <FormInput
            label="Enter Remark"
            placeholder="Enter remark..."
            value={remark}
            onChange={e => setRemark(e.target.value)}
          />
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 border-t border-border px-8 py-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-11 cursor-pointer rounded-2xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-white disabled:opacity-70"
          >
            {isPending && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {isPending ? "Processing..." : "Submit"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
