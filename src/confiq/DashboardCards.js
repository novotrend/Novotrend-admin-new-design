import { BadgeDollarSign, CreditCard, Landmark, UserPlus, Users, Wallet } from "lucide-react";

export const dashboardCards = [
  {
    category: "overview",
    title: "Total User",
    valueKey: "total_user",
    icon: Users,
    href: "/users/list-user",
  },
  {
    category: "overview",
    title: "Total IB",
    valueKey: "total_ib",
    icon: Landmark,
    href: "/ib-managment/list-become-ib",
  },
  {
    category: "overview",
    title: "Total Withdrawal",
    valueKey: "total_withdraw",
    valueType: "currency",
    icon: Wallet,
    href: "/report/withdrawal-report",
  },
  {
    category: "overview",
    title: "Total Deposit",
    valueKey: "total_deposit",
    valueType: "currency",
    icon: BadgeDollarSign,
    href: "/report/deposit-report",
  },

  // Deposits
  {
    category: "deposits",
    title: "Daily Deposit",
    valueKey: "daily_deposit",
    valueType: "currency",
    icon: Wallet,
    href: "/report/deposit-report",
  },
  {
    category: "deposits",
    title: "Weekly Deposit",
    valueKey: "weekly_deposit",
    valueType: "currency",
    icon: CreditCard,
    href: "/report/deposit-report",
  },
  {
    category: "deposits",
    title: "Monthly Deposit",
    valueKey: "monthly_deposit",
    valueType: "currency",
    icon: Wallet,
    href: "/report/deposit-report",
  },
  {
    category: "deposits",
    title: "Pending Deposit",
    valueKey: "pending_deposit",
    icon: Wallet,
    href: "/walletrequest/deposit-request",
  },

  // Withdrawals
  {
    category: "withdrawals",
    title: "Daily Withdraw",
    valueKey: "daily_withdraw",
    valueType: "currency",
    icon: Wallet,
    href: "/report/withdrawal-report",
  },
  {
    category: "withdrawals",
    title: "Weekly Withdraw",
    valueKey: "weekly_withdraw",
    valueType: "currency",
    icon: Wallet,
    href: "/report/withdrawal-report",
  },
  {
    category: "withdrawals",
    title: "Monthly Withdraw",
    valueKey: "monthly_withdraw",
    valueType: "currency",
    icon: Wallet,
    href: "/report/withdrawal-report",
  },
  {
    category: "withdrawals",
    title: "Pending Withdraw",
    valueKey: "pending_withdraw",
    icon: Wallet,
    href: "/withdrawal/withdrawal-request",
  },

  // IB
  {
    category: "ib",
    title: "Daily IB Withdraw",
    valueKey: "daily_ib_withdraw",
    valueType: "currency",
    icon: Landmark,
    href: "/report/ib-withdrawal-report",
  },
  {
    category: "ib",
    title: "Weekly IB Withdraw",
    valueKey: "weekly_ib_withdraw",
    valueType: "currency",
    icon: Landmark,
    href: "/report/ib-withdrawal-report",
  },
  {
    category: "ib",
    title: "Monthly IB Withdraw",
    valueKey: "monthly_ib_withdraw",
    valueType: "currency",
    icon: Landmark,
    href: "/report/ib-withdrawal-report",
  },
  {
    category: "ib",
    title: "Total IB Withdraw",
    valueKey: "total_ib_withdraw",
    valueType: "currency",
    icon: BadgeDollarSign,
    href: "/ib-managment/accepted-ib-list",
  },
  {
    category: "ib",
    title: "Pending IB Request",
    valueKey: "total_pending_ib",
    icon: Landmark,
    href: "/ib-managment/withdraw-ib-request",
  },

  // Registrations
  {
    category: "registrations",
    title: "Daily Registration",
    valueKey: "daily_registration",
    icon: UserPlus,
    href: "/users/list-user",
  },
  {
    category: "registrations",
    title: "Monthly Registration",
    valueKey: "monthly_registration",
    icon: Users,
    href: "/users/list-user",
  },

  // MT5
  {
    category: "mt5",
    title: "Daily MT5 ID",
    valueKey: "daily_mt5_id",
    icon: CreditCard,
    href: "/users/mt5-user-list",
  },
  {
    category: "mt5",
    title: "Monthly MT5 ID",
    valueKey: "monthly_mt5_id",
    icon: CreditCard,
    href: "/users/mt5-user-list",
  },
];
