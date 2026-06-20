"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSelect from "@/components/common/forms/FormSelect";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { decryptData } from "@/lib/utils";
import { useUpdateMT5GroupMutation } from "@/services/groups/group.mutation";
import { useGetMT5GroupListQuery } from "@/services/groups/group.query";
import { useGetUsernameByAccountNoMutation } from "@/services/users/user.mutation";

export default function UpdateMT5Group() {
  const [accountVerified, setAccountVerified] = useState(null);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const { register, watch, handleSubmit, setValue, reset } = useForm();

  // WATCH ACCOUNT NUMBER
  const accno = watch("accno");

  // GROUP LIST QUERY
  const { data: groupData } = useGetMT5GroupListQuery({
    limit: 100,
    offset: 0,
    search: "",
  });

  // ACTIVE GROUPS ONLY
  const groupList = groupData?.response?.group_list || [];
  const groupOptions =
    groupList
      .filter(group => group?.status === "Active")
      .map(group => ({
        label: group?.name,
        value: group?.id,
        status: group?.status,
      })) || [];

  
  // VERIFY ACCOUNT
  const { mutate: verifyAccount, isPending: verifying } = useGetUsernameByAccountNoMutation();

  // VERIFY MT5 ID
  const handleVerifyAccount = () => {
    if (!accno?.trim()) return;
    setVerifiedUser(null);
    setAccountVerified(null);

    verifyAccount(
      { accno },
      {
        onSuccess: data => {
                    setAccountVerified(true);
          setVerifiedUser(data?.response?.user_name || "");
        },

        onError: error => {
                    setAccountVerified(false);
          setVerifiedUser(null);
          toast.error(error?.message || "Invalid MT5 ID");
        },
      }
    );
  };
  // UPDATE GROUP MUTATION
  const { mutate: updateGroup, isPending: updating } = useUpdateMT5GroupMutation();
  // SUBMIT
  const onSubmit = values => {
    updateGroup(
      {
        accno: values.accno,
        groupid: values.groupid,
      },
      {
        onSuccess: data => {
                    // DECRYPT RESULT
          const decryptedResult = decryptData(data.result);
                    toast.success(decryptedResult?.data?.result || "MT5 Group updated successfully");
          // RESET FORM
          reset();
          // RESET STATES
          setVerifiedUser(null);
          setAccountVerified(null);
        },
        onError: error => {
          toast.error(error?.message || "Failed to update group");
        },
      }
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Update MT5 Group"
        description="Update MT5 group for existing trading account"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* MT5 ID */}
          <div>
            <FormInput
              label="Enter MT5 ID"
              type="text"
              placeholder="Enter MT5 account ID"
              {...register("accno")}
              onBlur={handleVerifyAccount}
            />
            {verifying && <p className="mt-2 text-sm text-primary">Checking MT5 ID...</p>}
            {accountVerified === true && (
              <p className="mt-2 text-sm font-medium text-green-500">✓ {verifiedUser}</p>
            )}
            {accountVerified === false && (
              <p className="mt-2 text-sm font-medium text-red-500">Invalid MT5 ID</p>
            )}
          </div>
          {/* GROUP SELECT */}
          <FormSelect
            label="Select Group"
            placeholder="Choose MT5 group"
            options={groupOptions}
            disabled={!accountVerified}
            onValueChange={value => setValue("groupid", value)}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <FormSubmit
            title={updating ? "Updating..." : "Update Group"}
            disabled={!accountVerified}
          />
        </div>
      </FormSection>
    </form>
  );
}
