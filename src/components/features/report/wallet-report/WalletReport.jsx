"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableWrapper from "@/components/common/tables/TableWrapper";

import TableSearch from "@/components/common/tables/TableSearch";
import { TableCell, TableRow } from "@/components/ui/table";
import { useWalletReportQuery } from "@/services/report/report.query";
import { useState } from "react";
import DateInputFilter from "../../userkyc/acceptedkyc/DateInputFilter";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Details", key: "details" },
  { label: "Date", key: "date" },
  { label: "Debit", key: "debit" },
  { label: "Credit", key: "credit" },
];

export default function WalletReport() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    sdate: "",
    edate: "",
  });

  const { data, isLoading, isError } = useWalletReportQuery({
    limit,
    offset,
    search,
    sdate: filters.sdate,
    edate: filters.edate,
  });
  const walletData = data?.response?.wallet_history || [];
  const total = Number(data?.response?.total_records) || 0;
  return (
    <>
      <DateInputFilter
        onSubmit={({ sdate, edate }) => {
          setOffset(0);
          setFilters({
            sdate,
            edate,
          });
        }}
        onClear={() => {
          setOffset(0);
          setFilters({
            sdate: "",
            edate: "",
          });
        }}
        isLoading={isLoading}
      />
      <TableWrapper
        title="Wallet History"
        description="View complete wallet debit and credit records"
        actions={
          <>
            <TableSearch value={search} onChange={setSearch} />
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
          {walletData.map((row, index) => (
            <TableRow
              key={row.id}
              className="border-b border-border transition-all hover:bg-muted/30"
            >
              {/* Index */}
              <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                {String(offset + index + 1).padStart(2, "0")}
              </TableCell>

              {/* Name */}
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{row.user_name}</p>
                  </div>
                </div>
              </TableCell>

              {/* Email */}
              <TableCell className="px-6 py-5">
                <p className="text-sm text-muted-foreground">{row.email}</p>
              </TableCell>

              {/* Details */}
              <TableCell className="px-6 py-5">
                <p className="text-sm text-foreground">{row.details}</p>
              </TableCell>

              {/* Date */}
              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                {row.date}
              </TableCell>

              {/* Debit */}
              <TableCell className="px-6 py-5">
                {row.debit !== "-" ? (
                  <span className="rounded-xl bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-500">
                    {row.debit}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>

              {/* Credit */}
              <TableCell className="px-6 py-5">
                {row.credit !== "-" ? (
                  <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                    {row.credit}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </TableWrapper>
    </>
  );
}
