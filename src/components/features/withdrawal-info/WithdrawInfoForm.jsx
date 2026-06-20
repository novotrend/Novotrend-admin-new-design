"use client";

import { useState } from "react";
import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAddWithdrawInfoMutation } from "@/services/withdrawal-info/withdrawalInfo.mutation";
import { useWithdrawInfoQuery } from "@/services/withdrawal-info/withdrawalInfo.query";

const getWithdrawInfoData = data => {
  const withdrawInfo =
    data?.response?.withdraw_info ||
    data?.response?.withdrawal_info ||
    data?.response ||
    data?.data?.response ||
    data?.data ||
    data;

  if (Array.isArray(withdrawInfo)) {
    return withdrawInfo[0] || {};
  }

  return withdrawInfo || {};
};

const getAddress = info => {
  return (
    info?.address ||
    info?.wallet_address ||
    info?.walletAddress ||
    info?.withdraw_address ||
    info?.withdrawAddress ||
    info?.token_address ||
    "-"
  );
};

const getPrivateKey = info => {
  return info?.str_details || info?.private_key || info?.privateKey || info?.pkey || info?.key || "";
};

const maskPrivateKey = value => {
  if (!value) {
    return "-";
  }

  return "**************************************";
};

export default function WithdrawInfoForm({ chain }) {
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showCurrentPrivateKey, setShowCurrentPrivateKey] = useState(false);
  const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: addWithdrawInfo, isPending } = useAddWithdrawInfoMutation();
  const { data, isLoading, isError } = useWithdrawInfoQuery({
    type_chain: chain,
  });

  
  const withdrawInfo = getWithdrawInfoData(data);
  const privateKeyValue = getPrivateKey(withdrawInfo);
  const currentAddress = isLoading ? "Loading..." : isError ? "Unable to load info" : getAddress(withdrawInfo);
  const currentPrivateKey = isLoading
    ? "Loading..."
    : isError
      ? "Unable to load info"
      : showCurrentPrivateKey
        ? privateKeyValue || "-"
        : maskPrivateKey(privateKeyValue);
  const trimmedAddress = address.trim();
  const trimmedPrivateKey = privateKey.trim();
  const currentAddressValue = getAddress(withdrawInfo);
  const isSameWithdrawInfo =
    trimmedAddress === currentAddressValue && trimmedPrivateKey === privateKeyValue;
  const isSubmitDisabled =
    isPending || !trimmedAddress || !trimmedPrivateKey || isSameWithdrawInfo;

  const handleSubmit = event => {
    event.preventDefault();

    if (!trimmedAddress) {
      toast.error("Address is required");
      return;
    }

    if (!trimmedPrivateKey) {
      toast.error("Private key is required");
      return;
    }

    if (isSameWithdrawInfo) {
      toast.error("No changes found");
      return;
    }

    addWithdrawInfo(
      {
        address: trimmedAddress,
        key: trimmedPrivateKey,
        type_chain: chain,
      },
      {
        onSuccess: response => {
          toast.success(response?.result || "Withdraw info added successfully");
          setAddress("");
          setPrivateKey("");
          queryClient.invalidateQueries({ queryKey: ["withdraw-info", chain] });
        },
        onError: error => {
          toast.error(error?.message || "Unable to add withdraw info");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <FormSection
        title={`Add Withdraw Info ${chain} Information`}
        description="Manage wallet address and private key configuration"
      >
        {/* Current Info */}

        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-muted/30 p-5">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Current Address</p>

            <p className="break-all text-sm font-semibold text-foreground">{currentAddress}</p>
          </div>

          <div className="rounded-3xl border border-border bg-muted/30 p-5">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Current Private Key</p>

            <div className="flex items-start gap-3">
              <p className="min-w-0 flex-1 break-all text-sm font-semibold text-foreground">
                {currentPrivateKey}
              </p>
              <button
                type="button"
                onClick={() => setShowCurrentPrivateKey(value => !value)}
                disabled={!privateKeyValue || isLoading || isError}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showCurrentPrivateKey ? "Hide private key" : "Show private key"}
              >
                {showCurrentPrivateKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid gap-6">
            <FormInput
              label="Enter Address"
              name={`withdraw-${chain.toLowerCase()}-wallet-address`}
              autoComplete="new-password"
              placeholder={`Enter ${chain} Address`}
              value={address}
              onChange={event => setAddress(event.target.value)}
            />
            <FormInput
              label="Private Key"
              name={`withdraw-${chain.toLowerCase()}-private-key`}
              autoComplete="new-password"
              type={showPrivateKeyInput ? "text" : "password"}
              placeholder="Enter Private Key"
              value={privateKey}
              onChange={event => setPrivateKey(event.target.value)}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPrivateKeyInput(value => !value)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-background hover:text-foreground"
                  aria-label={showPrivateKeyInput ? "Hide private key" : "Show private key"}
                >
                  {showPrivateKeyInput ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>
          {/* Actions */}
          <div className="mt-8 flex justify-end">
            <FormSubmit title={isPending ? "Submitting..." : "submit"} type="submit" disabled={isSubmitDisabled} />
          </div>
        </form>
      </FormSection>
    </div>
  );
}
