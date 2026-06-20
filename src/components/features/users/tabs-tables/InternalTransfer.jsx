"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";
import { useClientPagination } from "@/hooks/useClientPagination";
import { useState } from "react";

const tableHeaders = [
  { label: "#", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Date", key: "date" },
  { label: "Amount", key: "amount" },
  { label: "From", key: "from" },
  { label: "To", key: "to" },
  { label: "Note", key: "note" },
];

export default function InternalTransfer({ userDetails }) {
  const [search, setSearch] = useState("");
  const transfers = userDetails?.internal_transfer ?? [];
  const selectedUser = userDetails?.user ?? {};
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(transfers, 10, search, [selectedUser?.name, selectedUser?.email]);

  return (
    <TableWrapper
      title="Internal Transfer"
      description="Manage all internal wallet transfers"
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
        {transfers.length === 0 && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              No internal transfers found.
            </TableCell>
          </TableRow>
        )}

        {paginatedItems.map((row, index) => (
          <TableRow key={`${row.date}-${index}`} className="border-b border-border hover:bg-muted/40">
            <TableCell className="px-6 py-5">{offset + index + 1}</TableCell>

            <TableCell className="px-6 py-5">{selectedUser?.name || "-"}</TableCell>

            <TableCell className="px-6 py-5">{selectedUser?.email || "-"}</TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5">{row.date}</TableCell>

            <TableCell className="px-6 py-5 font-semibold text-primary">${row.amount}</TableCell>

            <TableCell className="px-6 py-5">
              <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600">
                {row.from_account || "-"}
              </span>
            </TableCell>

            <TableCell className="px-6 py-5">
              <span className="rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                {row.to_account || "-"}
              </span>
            </TableCell>

            <TableCell className="max-w-[220px] truncate px-6 py-5">{row.note}</TableCell>
          </TableRow>
        ))}
      </DataTable>
    </TableWrapper>
  );
}
