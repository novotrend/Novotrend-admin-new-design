"use client";

import FormSubmit from "@/components/common/forms/FormSubmit";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeactivateIBUser } from "@/services/ib-managment/ib-managment.query";

export default function DeactivateConfirmation({
  open,
  setOpen,
  selectedUser,
}) {
  const { mutate, isPending } = useDeactivateIBUser();

  const handleDeactivate = () => {
    mutate(
      {
        type: "rejectib_user",
        user_id: selectedUser?.user_id,
        status: 2,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-border bg-background p-0">
        <DialogHeader className="border-b border-border px-8 py-7 text-left">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Deactivate Account
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm leading-6 text-muted-foreground">
            Are you sure you want to deactivate this IB account?
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-8">
          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <p className="text-sm text-muted-foreground">Selected User</p>

            <p className="mt-1 text-base font-semibold text-foreground">
              {selectedUser?.name || "-"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {selectedUser?.email || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-8 py-6">
          <button
            onClick={() => setOpen(false)}
            className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Cancel
          </button>

          <FormSubmit
            title={isPending ? "Deactivating..." : "Deactivate Account"}
            onClick={handleDeactivate}
            disabled={isPending}
            type="button"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
