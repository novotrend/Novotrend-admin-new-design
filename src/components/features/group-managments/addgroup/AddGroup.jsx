"use client";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { decryptData } from "@/lib/utils";
import { useAddMT5GroupMutation } from "@/services/groups/group.mutation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddGroup() {
  const { register, handleSubmit, reset } = useForm();
  const { mutate: addGroup, isPending } = useAddMT5GroupMutation();

  const onSubmit = values => {
    addGroup(
      {
        groupname: values.groupname,
        groupnamemt5: values.groupnamemt5,
        leverage: values.leverage,
      },
      {
        onSuccess: response => {
                    let successMessage = response?.result;
          // DECRYPT RESULT
          try {
            if (typeof response?.result === "string") {
              const decryptedResult = decryptData(response.result);
                            successMessage = decryptedResult?.data?.result || decryptedResult;
            }
          } catch (err) {
                      }
          toast.success(successMessage || "Group created successfully");

          reset();
        },
        onError: error => {
          toast.error(error?.message || "Failed to create group");
        },
      }
    );
  };

  return (
    <FormSection title="Add Group" description="Create new MT5 trading group">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormInput
            label="Enter Group Name"
            placeholder="Enter group name"
            {...register("groupname")}
          />
          <FormInput
            label="Enter Group Name in MT5"
            placeholder="Novo\BUSINESS"
            {...register("groupnamemt5")}
          />
          <FormInput label="Enter Group Leverage" placeholder="1000" {...register("leverage")} />
        </div>
        <div className="mt-8 flex justify-end">
          <FormSubmit title={isPending ? "Creating..." : "Create Group"} />
        </div>
      </form>
    </FormSection>
  );
}
