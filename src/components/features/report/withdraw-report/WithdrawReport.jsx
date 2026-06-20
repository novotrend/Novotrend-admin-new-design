"use client";

import AllFilters from "@/components/common/report/filter/AllFilters";
import AmountStats from "@/components/common/report/filter/AmountsStats";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";
import { useWithdrawalRequestHistoryQuery } from "@/services/report/report.query";
import { useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Date", key: "date" },
  { label: "Method", key: "method" },
  { label: "Amount", key: "amount" },
  { label: "Wallet Address", key: "wallet" },
  { label: "Remark", key: "remark" },
  { label: "Accepted By", key: "acceptedBy" },
  { label: "Status", key: "status" },
  { label: "Accepted Date", key: "acceptedDate" },
];

export default function WithdrawReport() {
  const [search, setSearch] = useState("");

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [filters, setFilters] = useState({
    email: "",
    start_date: "",
    end_date: "",
    payment: "",
    status: "All",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    email: "",
    start_date: "",
    end_date: "",
    payment: "",
    status: "",
  });

  // API CALL
  const { data, isLoading } = useWithdrawalRequestHistoryQuery({
    limit,
    offset,
    search,
    useremail: appliedFilters.email,
    sdate: appliedFilters.start_date,
    edate: appliedFilters.end_date,
    paytype: appliedFilters.payment,
    status: appliedFilters.status,
  });
  const summary = data?.response?.summary || {};
  const reportData = data?.response?.withdraw_history || [];
  const total = Number(data?.response?.total_records) || 0;

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFilter = () => {
    setOffset(0);
    setAppliedFilters({
      email: filters.email,
      start_date: filters.start_date,
      end_date: filters.end_date,
      payment: filters.payment,
      status: filters.status === "All" ? "" : filters.status,
    });
  };

  const handleReset = () => {
    const reset = {
      email: "",
      start_date: "",
      end_date: "",
      payment: "",
      status: "All",
    };

    setFilters(reset);
    setAppliedFilters({
      email: "",
      start_date: "",
      end_date: "",
      payment: "",
      status: "",
    });
    setOffset(0);
  };

  const handleSearchChange = value => {
    setSearch(value);
    setOffset(0);
  };
  return (
    <div className="space-y-6">
      {/* STATS */}
      <AmountStats
        items={[
          {
            title: "Bank Withdraw",
            value: summary.bank_withdraw || 0,
            color: "blue",
          },
          {
            title: "Cash Withdraw",
            value: summary.cash_withdraw || 0,
            color: "green",
          },
          {
            title: "Crypto Withdraw",
            value: summary.crypto_withdraw || 0,
            color: "orange",
          },
          {
            title: "Total Withdraw",
            value: summary.total_withdraw || 0,
            color: "purple",
          },
        ]}
      />

      {/* FILTER */}
      <AllFilters
        values={filters}
        onChange={handleChange}
        onSubmit={handleFilter}
        onReset={handleReset}
        isLoading={isLoading}
        showEmail
        showStartDate
        showEndDate
        showPayment
        showStatus
        paymentOptions={["Bank", "Cash", "Crypto"]}
        statusOptions={["All", "Accepted", "Pending", "Rejected"]}
      />
      {/* Table */}
      <TableWrapper
        title="Withdrawal History"
        description="Track and manage withdrawal requests"
        actions={
          <>
            <TableSearch value={search} onChange={handleSearchChange} />
            <ExportDropdown />
          </>
        }
        footer={
          <TableFooter
            limit={limit}
            setLimit={setLimit}
            offset={offset}
            setOffset={setOffset}
            total={total}
          />
        }
      >
        <DataTable headers={tableHeaders}>
          {reportData.map((row, index) => (
            <TableRow key={row.id ?? index} className="border-b border-border hover:bg-muted/30">
              <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                {String(offset + index + 1).padStart(2, "0")}
              </TableCell>

              <TableCell className="px-6 py-5 font-medium">{row.name}</TableCell>

              <TableCell className="px-6 py-5 whitespace-nowrap">{row.email}</TableCell>

              <TableCell className="px-6 py-5 whitespace-nowrap">{row.date}</TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-primary/10 px-3 py-1 text-primary text-xs font-semibold">
                  {row.method}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5 font-semibold text-primary whitespace-nowrap">
                {row.amount}
              </TableCell>

              <TableCell className="px-6 py-5 max-w-[220px] truncate">
                {row.wallet_address || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <TruncatedCell text={row.remark} maxLength={50} />
              </TableCell>

              <TableCell className="px-6 py-5">{row.accepted_by || "-"}</TableCell>

              <TableCell className="px-6 py-5">
                <span
                  className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold
                  ${
                    row.status === "Completed"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }`}
                >
                  {row.status}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5 whitespace-nowrap">{row.accepted_date}</TableCell>
            </TableRow>
          ))}
        </DataTable>
      </TableWrapper>
    </div>
  );
}
