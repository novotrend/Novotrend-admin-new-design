"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormInput from "@/components/common/forms/FormInput";
import FormSelect from "@/components/common/forms/FormSelect";
import FormSubmit from "@/components/common/forms/FormSubmit";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEditMT5GroupMutation } from "@/services/groups/group.mutation";

export default function EditGroupModal({ open, setOpen, group }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, reset } = useForm();

  // EDIT GROUP MUTATION
  const { mutate: editGroup, isPending } = useEditMT5GroupMutation();

  // PREFILL FORM
  useEffect(() => {
    if (group) {
      setValue("group_name", group?.name || "");
      setValue("mt5_group_name", group?.mt5_name || "");
      setValue("leverage", group?.leverage || "");
      setValue("group_status", group?.status || "Active");
    }
  }, [group, setValue]);

  // SUBMIT
  const onSubmit = values => {
    editGroup(
      {
        group_id: group?.id,
        group_name: values.group_name,
        mt5_group_name: values.mt5_group_name,
        leverage: values.leverage,
        group_status: values.group_status === "Active" ? "1" : "0",
      },
      {
        onSuccess: response => {
          toast.success(response?.result || "Group updated successfully");
          // REFETCH GROUP LIST
          queryClient.invalidateQueries({
            queryKey: ["mt5-group-list"],
          });
          // RESET
          reset();
          // CLOSE MODAL
          setOpen(false);
        },
        onError: error => {
          toast.error(error?.message || "Failed to update group");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border border-border bg-background p-0">
        {/* HEADER */}
        <DialogHeader className="border-b border-border px-8 py-6">
          <DialogTitle className="text-3xl font-bold text-foreground">Edit Group</DialogTitle>

          <DialogDescription className="pt-2 text-base text-muted-foreground">
            Update MT5 group details and leverage settings
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 px-8 py-8 lg:grid-cols-2">
            {/* GROUP NAME */}
            <FormInput
              label="Enter Group Name"
              placeholder="Business"
              {...register("group_name")}
            />

            {/* MT5 GROUP NAME */}
            <FormInput
              label="Enter Group Name in MT5"
              placeholder="Novo\\BUSINESS"
              {...register("mt5_group_name")}
            />

            {/* LEVERAGE */}
            <FormInput label="Enter Group Leverage" placeholder="1000" {...register("leverage")} />

            {/* STATUS */}
            <FormSelect
              label="Select Status"
              placeholder="Choose status"
              options={["Active", "Inactive"]}
              value={watch("group_status")}
              onValueChange={value => setValue("group_status", value)}
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end border-t border-border px-8 py-6">
            <FormSubmit title={isPending ? "Updating..." : "Update Group"} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
