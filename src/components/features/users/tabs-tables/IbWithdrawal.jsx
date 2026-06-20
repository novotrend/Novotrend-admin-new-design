"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";
import { useClientPagination } from "@/hooks/useClientPagination";
import { useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Date", key: "date" },
  { label: "Amount", key: "amount" },
  { label: "Remark", key: "remark" },
  { label: "Status", key: "status" },
];

export default function IbWithdrawal({ userDetails }) {
  const [search, setSearch] = useState("");
  const ibWithdrawals = userDetails?.ib_withdraw ?? [];
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(ibWithdrawals, 10, search);

  return (
    <TableWrapper
      title="IB Withdrawal"
      description="Manage IB withdrawal requests"
      actions={
        <>
          <TableSearch value={search} onChange={value => { setSearch(value); setOffset(0); }} />
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
        {ibWithdrawals.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="py-8 text-center text-sm text-muted-foreground"
            >
              No IB withdrawals found.
            </TableCell>
          </TableRow>
        )}

        {paginatedItems.map((row, index) => (
          <TableRow
            key={`${row.date}-${index}`}
            className="border-b border-border hover:bg-muted/40"
          >
            {/* # */}
            <TableCell>{offset + index + 1}</TableCell>

            {/* DATE */}
            <TableCell className="whitespace-nowrap">{row.date}</TableCell>

            {/* AMOUNT */}
            <TableCell className="font-semibold text-primary">${row.amount}</TableCell>

            {/* REMARK */}
            <TableCell className="text-muted-foreground">
              <TruncatedCell text={row.remark} maxLength={50} />
            </TableCell>

            <TableCell>
              <span className="rounded-xl bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600">
                {row.status || "-"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </TableWrapper>
  );
}
