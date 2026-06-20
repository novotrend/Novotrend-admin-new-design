import BankDetails from "../tabs-tables/BankDetails";
import CommissionHistory from "../tabs-tables/CommissionHistory";
import DepositList from "../tabs-tables/DepositList";
import IBDetails from "../tabs-tables/IBDetails";
import IbWithdrawal from "../tabs-tables/IbWithdrawal";
import InternalTransfer from "../tabs-tables/InternalTransfer";
import KycDocuments from "../tabs-tables/KycDocuments";
import Leverage from "../tabs-tables/Leverage";
import LiveTrades from "../tabs-tables/LiveTrades";
import TradeReport from "../tabs-tables/TradeReport";
import TradingAccount from "../tabs-tables/TradingAccount";
import WithdrawalList from "../tabs-tables/WithdrawalList";

export const USER_TABS = [
  {
    label: "Trading Accounts Details",
    value: "trading",
    component: TradingAccount,
  },
  {
    label: "Deposit",
    value: "deposit",
    component: DepositList,
  },
  {
    label: "Withdrawal",
    value: "withdrawal",
    component: WithdrawalList,
  },
  {
    label: "Internal Transfer",
    value: "internal",
    component: InternalTransfer,
  },
  {
    label: "Bank Details",
    value: "bank",
    component: BankDetails,
  },
  {
    label: "KYC Documents",
    value: "kyc",
    component: KycDocuments,
  },
  {
    label: "Live Trades",
    value: "trades",
    component: LiveTrades,
  },
  {
    label: "Trading Report",
    value: "reports",
    component: TradeReport,
  },
  {
    label: "Leverage",
    value: "leverage",
    component: Leverage,
  },
  {
    label: "IB Details",
    value: "ib",
    component: IBDetails,
  },
  {
    label: "Commission History",
    value: "commission",
    component: CommissionHistory,
  },
  {
    label: "IB Withdrawal",
    value: "ib-withdrawal",
    component: IbWithdrawal,
  },
];
