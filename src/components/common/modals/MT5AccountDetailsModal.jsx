"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MT5AccountDetailsModal({ open, onOpenChange, user }) {
  const apiDetails = user?.mt5AccountDetails;
  const mt5User =
    apiDetails?.result?.data?.response?.mt5_users?.[0] ||
    apiDetails?.data?.response?.mt5_users?.[0] ||
    apiDetails?.response?.mt5_users?.[0] ||
    apiDetails?.mt5_users?.[0] ||
    {};

  const getValue = keys => {
    for (const key of keys) {
      const value = mt5User?.[key] ?? user?.[key];

      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }

    return " - ";
  };

  const formatValue = value => {
    if (value === undefined || value === null || value === "") {
      return " - ";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value;
  };

  const accountDetails = [
    { label: "Login", value: getValue(["Login", "login", "mt5_id", "account", "account_number"]) },
    { label: "Currency Digits", value: getValue(["CurrencyDigits", "currency_digits"]) },
    { label: "Created At", value: getValue(["CreatedAt", "created_at", "generate_date"]) },
    { label: "Balance", value: getValue(["Balance", "balance", "wallet_balance"]) },
    { label: "Margin Leverage", value: getValue(["MarginLeverage", "margin_leverage", "leverages"]) },
    { label: "Leverage", value: getValue(["Leverage", "leverage", "leverages"]) },
    { label: "Credit", value: getValue(["Credit", "credit"]) },
    { label: "Profit", value: getValue(["Profit", "profit"]) },
    { label: "Assets", value: getValue(["Assets", "assets"]) },
    { label: "Margin", value: getValue(["Margin", "margin"]) },
    { label: "Equity", value: getValue(["Equity", "equity"]) },
    { label: "Equity Prev Day", value: getValue(["mt5balance", "EquityPrevDay", "equity_prev_day"]) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          // max-w-6xl
          rounded-[32px]
          border
          border-border
          bg-white
          p-0
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]
        "
      >
        <DialogHeader
          className="
            border-b
            border-border
            px-10
            py-7
          "
        >
          <DialogTitle
            className="
              text-[34px]
              font-bold
              tracking-tight
              text-foreground
            "
          >
            MT5 Account Details
          </DialogTitle>

          <DialogDescription
            className="
              mt-2
              text-base
              text-muted-foreground
            "
          >
            View complete MT5 account information
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            grid
            grid-cols-2
            gap-6
            px-10
            py-10
            lg:grid-cols-4
          "
        >
          {accountDetails.map(item => (
            <div key={item.label} className="space-y-3">
              <label
                className="
                  text-sm
                  font-semibold
                  text-foreground
                "
              >
                {item.label}
              </label>

              <div
                className="
                  flex
                  h-14
                  items-center
                  rounded-2xl
                  border
                  border-border
                  bg-muted/20
                  px-5
                  text-sm
                  font-medium
                  text-muted-foreground
                "
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
