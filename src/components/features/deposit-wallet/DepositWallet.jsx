"use client";

import { useState } from "react";
import FormInput from "@/components/common/forms/FormInput";
import FormSection from "@/components/common/forms/FormSection";
import FormSubmit from "@/components/common/forms/FormSubmit";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAddDepositWalletMutation } from "@/services/deposit-wallet/depositWallet.mutation";
import { useDepositWalletQuery } from "@/services/deposit-wallet/depositWallet.query";

const chains = ["BEP20", "TRC20", "ETH20", "POL20"];
const chainPayloadKeys = {
  BEP20: "bep20",
  TRC20: "trc20",
  ETH20: "eth20",
  POL20: "pol20",
};

const getDepositWalletData = data => {
  const walletData =
    data?.response?.deposit_wallet ||
    data?.response?.depositWallet ||
    data?.response?.wallet ||
    data?.response ||
    data?.data?.response ||
    data?.data ||
    data;

  return walletData || {};
};

const getAddress = wallet => {
  return (
    wallet?.address ||
    wallet?.wallet_address ||
    wallet?.walletAddress ||
    wallet?.deposit_address ||
    wallet?.depositAddress ||
    "-"
  );
};

const getAddressByChain = (walletData, chain) => {
  const staffKey = `staff_${chain.toLowerCase()}`;

  if (Array.isArray(walletData)) {
    const wallet = walletData.find(item => item?.[staffKey] || item?.type?.toUpperCase() === chain);

    return wallet?.[staffKey] || getAddress(wallet);
  }

  const chainKey = chain.toLowerCase();
  const wallet = walletData?.[chain] || walletData?.[chainKey] || walletData;

  return walletData?.[staffKey] || getAddress(wallet);
};

export default function DepositWallet() {
  const [walletInputs, setWalletInputs] = useState({});
  const [visibleChains, setVisibleChains] = useState({});
  const queryClient = useQueryClient();
  const { mutate: addDepositWallet, isPending } = useAddDepositWalletMutation();
  const { data, isLoading, isError } = useDepositWalletQuery();

  
  const walletData = getDepositWalletData(data);
  const getCurrentAddress = chain => {
    if (isLoading) {
      return "Loading...";
    }

    if (isError) {
      return "Unable to load wallet";
    }

    return getAddressByChain(walletData, chain);
  };
  const getInputValue = chain => {
    const key = chainPayloadKeys[chain];

    return walletInputs[key] ?? getCurrentAddress(chain);
  };
  const getSanitizedInputValue = chain => {
    const value = getInputValue(chain).trim();

    return value === "-" || value === "Loading..." || value === "Unable to load wallet" ? "" : value;
  };
  const getSanitizedCurrentAddress = chain => {
    const value = getCurrentAddress(chain).trim();

    return value === "-" || value === "Loading..." || value === "Unable to load wallet" ? "" : value;
  };
  const hasChangedWalletField = chains.some(chain => {
    const inputValue = getSanitizedInputValue(chain);
    const currentValue = getSanitizedCurrentAddress(chain);

    return inputValue && inputValue !== currentValue;
  });
  const isSubmitDisabled = isPending || !hasChangedWalletField;
  const handleInputChange = (chain, value) => {
    const key = chainPayloadKeys[chain];

    setWalletInputs(previousValue => ({
      ...previousValue,
      [key]: value,
    }));
  };
  const handleSubmit = event => {
    event.preventDefault();

    const payload = chains.reduce((accumulator, chain) => {
      const key = chainPayloadKeys[chain];
      const value = getSanitizedInputValue(chain);

      accumulator[key] = value;

      return accumulator;
    }, {});

    if (!hasChangedWalletField) {
      toast.error("No changes found");
      return;
    }

    addDepositWallet(payload, {
      onSuccess: response => {
        toast.success(response?.result || "Deposit wallet added successfully");
        setWalletInputs({});
        queryClient.invalidateQueries({ queryKey: ["deposit-wallet"] });
      },
      onError: error => {
        toast.error(error?.message || "Unable to add deposit wallet");
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <FormSection title="Add Deposit Wallet" description="Add new deposit wallet for users">
        {/* BASIC INFO */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {chains.map(chain => (
              <FormInput
                key={chain}
                label={`Enter Address ${chain}`}
                type={visibleChains[chain] ? "text" : "password"}
                value={getInputValue(chain)}
                onChange={event => handleInputChange(chain, event.target.value)}
                rightElement={
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleChains(previousValue => ({
                        ...previousValue,
                        [chain]: !previousValue[chain],
                      }))
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-background hover:text-foreground"
                    aria-label={visibleChains[chain] ? `Hide ${chain} address` : `Show ${chain} address`}
                  >
                    {visibleChains[chain] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            ))}
          </div>
          {/* ACTION */}
          <div className="mt-10 flex justify-end">
            <div className="w-[220px]">
              <FormSubmit title={isPending ? "Submitting..." : "Submit"} type="submit" disabled={isSubmitDisabled} />
            </div>
          </div>
        </form>
      </FormSection>
    </div>
  );
}
