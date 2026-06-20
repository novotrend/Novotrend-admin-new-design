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
  { label: "MT5 Account No", key: "account" },
  { label: "Reg Date Time", key: "date" },
  { label: "Leverage", key: "leverage" },
  { label: "Currency", key: "currency" },
  { label: "Deposit", key: "deposit" },
  { label: "Withdraw", key: "withdraw" },
  { label: "Profit", key: "profit" },
  { label: "Balance", key: "balance" },
  { label: "Equity", key: "equity" },
  { label: "Free Margin", key: "freeMargin" },
];

export default function TradingAccount({ userDetails }) {
  const [search, setSearch] = useState("");
  const accounts = userDetails?.mt5_accounts ?? [];
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(accounts, 10, search);

  return (
    <TableWrapper
      title="Trading Account Details"
      description="All MT5 trading accounts overview"
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
        {accounts.length === 0 && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              No trading accounts found.
            </TableCell>
          </TableRow>
        )}

        {paginatedItems.map((row, index) => (
          <TableRow key={`${row.accno}-${index}`} className="border-b border-border hover:bg-muted/40">
            <TableCell>{offset + index + 1}</TableCell>

            <TableCell className="font-medium">{row.accno || "-"}</TableCell>

            <TableCell className="whitespace-nowrap">{row.reg_date || "-"}</TableCell>

            <TableCell>{row.leverage}</TableCell>

            <TableCell>{row.currency}</TableCell>

            <TableCell className="text-green-600 font-medium">-</TableCell>

            <TableCell className="text-red-500 font-medium">-</TableCell>

            <TableCell>-</TableCell>

            <TableCell className="font-semibold">{row.balance}</TableCell>

            <TableCell>{row.equity}</TableCell>

            <TableCell>-</TableCell>
          </TableRow>
        ))}
      </DataTable>
    </TableWrapper>
  );
}
