import {
  ArrowDownToLine,
  ArrowLeftRight,
  BellRing,
  Building2,
  CombineIcon,
  FileBarChart2,
  Gift,
  Landmark,
  Layers3,
  LayoutDashboard,
  LifeBuoy,
  Repeat,
  ShieldCheck,
  UserPlus,
  Users,
  Wallet,
  WalletCards,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "Dashboard",
      },
      {
        title: "Users",
        icon: Users,
        permission: "Users",
        children: [
          {
            title: "User List",
            href: "/users/list-user",
          },
          {
            title: "Create MT5 Account",
            href: "/users/create-mt5-account",
          },
          {
            title: "MT5 User List",
            href: "/users/mt5-user-list",
          },
          {
            title: "Change MT5 Password",
            href: "/users/change-mt5-password",
          },
          {
            title: "Change MT5 Leverage",
            href: "/users/change-mt5-leverage",
          },
          {
            title: "Send MT5 Data Mail",
            href: "/users/send-mt5-data-mail",
          },
          {
            title: "MT5 Password Request List",
            href: "/users/mt5-password-request-list",
          },
          {
            title: "MT5 Password Accept List",
            href: "/users/mt5-password-accept-list",
          },
          {
            title: "MT5 Password Reject List",
            href: "/users/mt5-password-reject-list",
          },
        ],
      },

      {
        title: "Bouns Management",
        icon: Gift,
        permission: "Bonus",
        children: [
          {
            title: "Give Bonus",
            href: "/bouns/give-bonus",
          },
          {
            title: "Remove From Wallet",
            href: "/bouns/remove-from-wallet",
          },
          {
            title: "Bonus List",
            href: "/bouns/bouns-list",
          },
          {
            title: "Cancel Discount List",
            href: "/bouns/cancel-discount-list",
          },
          {
            title: "Discount List",
            href: "/bouns/discount-list",
          },
        ],
      },

      {
        title: "Group Management",
        icon: Layers3,
        permission: "Group Management",
        children: [
          {
            title: "Add Group",
            href: "/group/add-group",
          },
          {
            title: "Group List",
            href: "/group/group-list",
          },
          {
            title: "Update MT5 Group",
            href: "/group/update-mt5-group",
          },
        ],
      },
      {
        title: "User KYC",
        icon: ShieldCheck,
        permission: "User KYC",
        children: [
          {
            title: "New KYC",
            href: "/userkyc/new-kyc",
          },
          {
            title: "Accepted KYC",
            href: "/userkyc/accepted-kyc",
          },
          {
            title: "Rejected KYC History",
            href: "/userkyc/rejected-kyc-history",
          },
          {
            title: "New Bank KYC",
            href: "/userkyc/new-bank-kyc",
          },
          {
            title: "Accepted Bank KYC",
            href: "/userkyc/accepted-bank-kyc",
          },
          {
            title: "Rejected Bank History",
            href: "/userkyc/rejected-bank-history",
          },

          {
            title: "Add/Edit bank Kyc",
            href: "/userkyc/add-edit-bank-kyc",
          },
        ],
      },
      {
        title: "Wallet Request",
        icon: WalletCards,
        permission: "Wallet Request",
        children: [
          {
            title: "Deposit Request",
            href: "/walletrequest/deposit-request",
          },
          {
            title: "Accepted List",
            href: "/walletrequest/accepted-list",
          },

          {
            title: "Rejected List",
            href: "/walletrequest/rejected-list",
          },
        ],
      },
      {
        title: "Transaction",
        icon: ArrowLeftRight,
        permission: "Transaction",
        children: [
          {
            title: "Client deposit",
            href: "/transcation/client-deposit",
          },
          {
            title: "Client withdrawal",
            href: "/transcation/client-withdraw",
          },
        ],
      },

      {
        title: "IB Management",
        icon: Landmark,
        permission: "IB Management",
        children: [
          {
            title: "Withdrawal IB Request",
            href: "/ib-managment/withdraw-ib-request",
          },
          {
            title: "Reject IB Request",
            href: "/ib-managment/rejected-ib-request",
          },
          {
            title: "Accepted IB List",
            href: "/ib-managment/accepted-ib-list",
          },
          {
            title: "Reward List",
            href: "/ib-managment/reward-list",
          },
          {
            title: "List IB",
            href: "/ib-managment/list-ib",
          },
          {
            title: "List of Become IB",
            href: "/ib-managment/list-become-ib",
          },
          {
            title: "List of IB Request",
            href: "/ib-managment/list-ib-request",
          },
          {
            title: "List of IB Reject",
            href: "/ib-managment/list-ib-reject",
          },
          {
            title: "IB Move",
            href: "/ib-managment/ib-move",
          },
        ],
      },
      {
        title: "Internal Transfer",
        permission: "Internal Transfer",
        href: "/internal-transfer",
        icon: Repeat,
      },
      {
        title: "Withdrawal",
        icon: ArrowDownToLine,
        permission: "Withdrawal",
        children: [
          {
            title: "Withdrawal Request",
            href: "/withdrawal/withdrawal-request",
          },
          {
            title: "Rejected List",
            href: "/withdrawal/withdrawal-reject",
          },
          {
            title: "Accepted List",
            href: "/withdrawal/accepted-list",
          },
        ],
      },
      {
        title: "Reports",
        icon: FileBarChart2,
        permission: "Reports",
        children: [
          {
            title: "Deposit Report",
            href: "/report/deposit-report",
          },
          {
            title: "withdraw Report",
            href: "/report/withdrawal-report",
          },
          {
            title: "IB Withdraw Report",
            href: "/report/ib-withdrawal-report",
          },
          {
            title: "Internal Transfer Report",
            href: "/report/internal-transfer-report",
          },
          {
            title: "Wallet Report",
            href: "/report/wallet-report",
          },
        ],
      },
      {
        title: "Notification (Logs)",
        icon: BellRing,
        permission: "Notifications",
        children: [
          {
            title: "unread Logs",
            href: "/notification/unread-logs",
          },
          {
            title: "Read Logs",
            href: "/notification/read-logs",
          },
          {
            title: "Admin Login Log",
            href: "/notification/admin-login-logs",
          },
          {
            title: "User Login Log",
            href: "/notification/user-login-log",
          },
        ],
      },
      // {
      //   title: "Exchanger Edit",
      //   href: "/exchange-edit",
      //   icon: Edit2Icon,
      //   permission: "Exchanger Edit",
      // },
      {
        title: "Bank information",
        href: "/bank-info",
        icon: Building2,
        permission: "Bank Info",
      },
      {
        title: "Support Ticket",
        icon: LifeBuoy,
        permission: "Support Ticket Closed",
        children: [
          {
            title: "Open Support Ticket",
            href: "/support-ticket/open-support-ticket",
          },
          {
            title: "Closed Support Ticket",
            href: "/support-ticket/closed-support-ticket",
          },
        ],
      },

      {
        title: "Employee Add",
        icon: UserPlus,
        permission: "Employee Manage",
        children: [
          {
            title: "Add Employee",
            href: "/employee-manage/add-employee",
          },
          {
            title: "List Employee",
            href: "/employee-manage/list-employee",
          },
        ],
      },

      {
        title: "Withdrawal Info",
        icon: Wallet,
        permission: "Withdrawal Info",
        children: [
          {
            title: "Withdraw BEP20",
            href: "/withdrawal-info/withdraw-bep-20",
          },
          {
            title: "Withdraw TRC20",
            href: "/withdrawal-info/withdraw-trc-20",
          },
          {
            title: "Withdraw ETH20",
            href: "/withdrawal-info/withdraw-eth-20",
          },
          {
            title: "Withdraw Pol20",
            href: "/withdrawal-info/withdraw-pol-20",
          },
        ],
      },

      {
        title: "Gas Information",
        icon: CombineIcon,
        permission: "Gas Info",
        children: [
          {
            title: "Gas BEP20 ",
            href: "/gas-info/gas-bep20",
          },
          {
            title: "Gas TRC20",
            href: "/gas-info/gas-trc20",
          },
          {
            title: "Gas ETH20",
            href: "/gas-info/gas-eth20",
          },
          {
            title: "Gas POL20",
            href: "/gas-info/gas-pol20",
          },
        ],
      },
      {
        title: "Deposit Wallet",
        href: "/deposit-wallet",
        permission: "Deposit Wallet",
        icon: WalletCards,
      },
    ],
  },
];
