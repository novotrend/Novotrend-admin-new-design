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
  { label: "S.No", key: "id" },
  { label: "MT5 ID", key: "mt5Id" },
  { label: "Date", key: "date" },
  { label: "Order", key: "order" },
  { label: "Volume", key: "volume" },
  { label: "Commission", key: "commission" },
];

export default function CommissionHistory({ userDetails }) {
  const [search, setSearch] = useState("");
  const commissions = userDetails?.commission_history ?? [];
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(commissions, 10, search);

  return (
    <TableWrapper
      title="Commission History"
      description="Track all MT5 commission records"
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
        {commissions.length === 0 && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              No commission history found.
            </TableCell>
          </TableRow>
        )}

        {paginatedItems.map((row, index) => (
          <TableRow key={`${row.order}-${index}`} className="border-b border-border hover:bg-muted/40">
            {/* # */}
            <TableCell>{offset + index + 1}</TableCell>

            {/* MT5 ID */}
            <TableCell className="font-medium">{row.mt5_id || "-"}</TableCell>

            {/* DATE */}
            <TableCell className="whitespace-nowrap">{row.date}</TableCell>

            {/* ORDER */}
            <TableCell>
              <span className="text-muted-foreground font-medium">{row.order || "-"}</span>
            </TableCell>

            {/* VOLUME */}
            <TableCell>{row.volume}</TableCell>

            {/* COMMISSION */}
            <TableCell className="font-semibold text-green-600">{row.commission}</TableCell>
          </TableRow>
        ))}
      </DataTable>
    </TableWrapper>
  );
}
