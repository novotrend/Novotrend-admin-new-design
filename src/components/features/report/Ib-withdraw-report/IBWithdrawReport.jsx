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
import { useWithdrawalRequestHistoryIBQuery } from "@/services/report/report.query";
import { useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Date", key: "date" },
  { label: "Method", key: "method" },
  { label: "Amount", key: "amount" },
  { label: "Admin", key: "admin" },
  { label: "Wallet Address", key: "wallet" },
  { label: "Remark", key: "remark" },
  { label: "Accepted By", key: "acceptedBy" },
  { label: "Status", key: "status" },
  { label: "Accepted Date", key: "acceptedDate" },
];

export default function IBWithdrawReport() {
  const [search, setSearch] = useState("");

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  // 👉 Draft filters (UI state)
  const [filters, setFilters] = useState({
    email: "",
    start_date: "",
    end_date: "",
    payment: "",
    status: "All",
  });

  // Applied filters (API state)
  const [appliedFilters, setAppliedFilters] = useState({
    email: "",
    start_date: "",
    end_date: "",
    payment: "",
    status: "",
  });

  // ---------------- FILTER HANDLERS ----------------

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

  // ---------------- API CALL (FIXED) ----------------

  const { data, isLoading } = useWithdrawalRequestHistoryIBQuery({
    limit,
    offset,
    search,
    useremail: appliedFilters.email,
    sdate: appliedFilters.start_date,
    edate: appliedFilters.end_date,
    paytype: appliedFilters.payment,
    status: appliedFilters.status,
  });

  const tableData = data?.response?.withdraw_history || [];
  const total = Number(data?.response?.total_records) || 0;

  return (
    <div className="space-y-6">
      {/* ---------------- STATS ---------------- */}
      <AmountStats
        items={[
          {
            title: "Bank Withdrawal",
            value: data?.response?.summary?.bank_total || 0,
            prefix: "$",
            color: "blue",
          },
          {
            title: "Crypto Withdrawal",
            value: data?.response?.summary?.crypto_total || 0,
            prefix: "$",
            color: "orange",
          },
          {
            title: "Cash Withdrawal",
            value: data?.response?.summary?.cash_total || 0,
            prefix: "$",
            color: "green",
          },
          {
            title: "Total",
            value: data?.response?.summary?.grand_total || 0,
            prefix: "$",
            color: "blue",
          },
        ]}
      />

      {/* ---------------- FILTERS ---------------- */}
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

      {/* ---------------- TABLE ---------------- */}
      <TableWrapper
        title="IB Withdrawal History"
        description="Track and manage IB withdrawal requests"
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={12} className="py-10 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : tableData.length > 0 ? (
            tableData.map((row, index) => (
              <TableRow key={row.id || index} className="border-b border-border">
                <TableCell className="px-6 py-5">{offset + index + 1}</TableCell>
                <TableCell className="px-6 py-5 font-medium">{row.name}</TableCell>
                <TableCell className="px-6 py-5">{row.email}</TableCell>
                <TableCell className="px-6 py-5">{row.date}</TableCell>
                <TableCell className="px-6 py-5">{row.method}</TableCell>

                <TableCell className="px-6 py-5">
                  <span className="font-semibold text-primary">${row.amount}</span>
                </TableCell>

                <TableCell className="px-6 py-5">{row.admin}</TableCell>

                <TableCell className="px-6 py-5 max-w-[220px] break-all">{row.wallet}</TableCell>

                <TableCell className="px-6 py-5">
                  <TruncatedCell text={row.remark} maxLength={50} />
                </TableCell>
                <TableCell className="px-6 py-5">{row.acceptedBy}</TableCell>

                <TableCell className="px-6 py-5">
                  <span className="inline-flex rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {row.status}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">{row.acceptedDate}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="py-10 text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </DataTable>
      </TableWrapper>
    </div>
  );
}
