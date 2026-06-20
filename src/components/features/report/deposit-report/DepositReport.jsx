"use client";

import AllFilters from "@/components/common/report/filter/AllFilters";
import AmountStats from "@/components/common/report/filter/AmountsStats";
import {
  KycFilePreviewDialog,
  KycFileThumbnail,
} from "@/components/common/KycFilePreview";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";
import { useWalletRequestHistoryQuery } from "@/services/report/report.query";
import { useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Date", key: "date" },
  { label: "Amount", key: "amount" },
  { label: "Deposit Type", key: "depositType" },
  { label: "Image", key: "image" },
  { label: "Status", key: "status" },
  { label: "Transaction ID", key: "transactionId" },
  { label: "Accepted By", key: "acceptedBy" },
  { label: "Remark", key: "remark" },
  { label: "Accepted Date", key: "acceptedDate" },
];

export default function DepositReport() {
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  // Draft filters (UI state)
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

  // ---------------- API CALL ----------------

  const { data, isLoading } = useWalletRequestHistoryQuery({
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
  const tableData = data?.response?.deposit_history || [];
  const total = Number(data?.response?.total_records) || 0;

  return (
    <div className="space-y-6">
      {/* ---------------- STATS ---------------- */}
      <AmountStats
        items={[
          {
            title: "Bank Deposit",
            value: summary.bank_total || 0,
            prefix: "$",
            color: "blue",
          },
          {
            title: "Cash Deposit",
            value: summary.cash_total || 0,
            prefix: "$",
            color: "green",
          },
          {
            title: "Crypto Deposit",
            value: summary.crypto_total || 0,
            prefix: "$",
            color: "orange",
          },
          {
            title: "Total",
            value: summary.grand_total || 0,
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
        title="Deposit Report"
        description="View and manage deposit requests"
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
                <TableCell className="px-6 py-5">{row.name}</TableCell>
                <TableCell className="px-6 py-5">{row.email}</TableCell>
                <TableCell className="px-6 py-5">{row.date}</TableCell>

                <TableCell className="px-6 py-5">
                  <span className="font-semibold text-primary">${row.amount}</span>
                </TableCell>

                <TableCell className="px-6 py-5">{row.deposit_type}</TableCell>
                {/* <TableCell className="px-6 py-5">{row.image || "-"}</TableCell> */}

                <TableCell className="px-6 py-5">
                  <KycFileThumbnail
                    src={row.image}
                    alt="Deposit Proof"
                    onPreview={() => {
                      setSelectedFile(row.image || "");
                      setPreviewOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
                    {row.status}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">{row.transaction_id}</TableCell>
                <TableCell className="px-6 py-5">{row.accepted_by}</TableCell>
                <TableCell className="px-6 py-5">
                  <TruncatedCell text={row.remark} maxLength={50} />
                </TableCell>
                <TableCell className="px-6 py-5">{row.accepted_date}</TableCell>
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

        <KycFilePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          selectedFile={selectedFile}
          fileName="Deposit Proof Preview"
        />
      </TableWrapper>
    </div>
  );
}
