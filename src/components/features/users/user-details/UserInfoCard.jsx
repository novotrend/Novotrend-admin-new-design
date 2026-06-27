"use client";

import Image from "next/image";

export default function UserInfoCard({ user }) {
  const personalDetails = [
    { label: "Country", value: user?.country || "INDIA" },
    { label: "City", value: user?.city || "-" },
    { label: "State", value: user?.state || "-" },
    { label: "Zip Code", value: user?.zip_code || user?.zipCode || "-" },
    { label: "Address", value: user?.address || "-" },
    { label: "Date of Birth", value: user?.dob || "-" },
    { label: "Registration Date", value: user?.registration_date || user?.registrationDate || "-" },
    { label: "Terms and Agreement Accepted", value: user?.termsAccepted || "Accepted" },
    {
      label: "Total Wallet Balance",
      value: `$${user?.wallet_balance || user?.walletBalance || "0.00"}`,
    },
    { label: "Total Deposit", value: `$${user?.total_deposit || user?.totalDeposit || "0.00"}` },
    {
      label: "Total Withdrawal",
      value: `$${user?.total_withdrawal || user?.totalWithdrawal || "0.00"}`,
    },
  ];

  return (
    <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-background p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-primary/10">
            {user?.avatar ? (
              <Image src={user.avatar} alt="User avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/20 text-2xl font-bold text-primary">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name || "-"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email || "-"}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {user?.mobile || user?.phone || "-"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">User Status</p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="space-y-1 rounded-2xl bg-background p-3">
              <p className="text-muted-foreground">Verification Status</p>
              <span className="text-sm font-semibold text-green-600">
                {user?.verificationStatus || "Active"}
              </span>
            </div>
            <div className="space-y-1 rounded-2xl bg-background p-3">
              <p className="text-muted-foreground">IB Status</p>
              {/* <span className={`text-sm font-semibold text-green-600`}>
                {user?.ib_status === "1" ? "Active" : "Inactive"}
              </span> */}

              <span
                className={`text-sm font-semibold ${
                  user?.ib_status === "1" ? "text-green-600" : "text-gray-500"
                }`}
              >
                {user?.ib_status === "1" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Full user profile and account summary.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {personalDetails.map(detail => (
            <div
              key={detail.label}
              className="space-y-1 rounded-3xl border border-border bg-background p-4"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {detail.label}
              </p>
              <p className="text-sm font-medium text-foreground">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
