"use client";

import UserTabs from "@/components/features/users/tabs/UserTabs";
import UserHeader from "@/components/features/users/user-details/UserHeader";
import UserInfoCard from "@/components/features/users/user-details/UserInfoCard";
import { useState } from "react";

export default function UserDetailPage() {
  const [userDetails] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedDetails = sessionStorage.getItem("selectedUserDetails");

    return storedDetails ? JSON.parse(storedDetails) : null;
  });

  const detailsResponse = userDetails?.result?.data?.response ?? userDetails?.response ?? {};
  const user = {
    ...(detailsResponse?.user ?? {}),
    wallet_balance: detailsResponse?.wallet?.balance,
    total_deposit: detailsResponse?.wallet?.total_deposit,
    total_withdrawal: detailsResponse?.wallet?.total_withdrawal,
  };
  const bankDetails = detailsResponse?.bank_details ?? [];

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <UserHeader />

      {/* STATUS STRIP */}
      {/* <UserStatusBar /> */}

      <UserInfoCard user={user} />

      {/* USER TABS */}
      <UserTabs userDetails={detailsResponse} bankDetails={bankDetails} />
    </div>
  );
}
