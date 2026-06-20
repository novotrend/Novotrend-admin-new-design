"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useIBCommissionList } from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "MT5 ID", key: "mt5Id", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Order", key: "order", sortable: true },
  { label: "Volume", key: "volume", sortable: true },
  { label: "Commission", key: "commission", sortable: true },
];

export default function IBCommissionList() {
  const searchParams = useSearchParams();
  const ibUser = searchParams.get("ibUser");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching } = useIBCommissionList({
    limit,
    offset,
    search,
    ibUser,
  });

  const rows = data?.data?.response?.records || [];
  const totalRecords = data?.data?.response?.total_records || 0;

  return (
    <TableWrapper
      title="IB Commission List"
      description="Manage and monitor all IB commission transactions"
      actions={
        <>
          <TableSearch
            value={search}
            onChange={(value) => {
              setSearch(value);
              setOffset(0);
            }}
          />
          <ExportDropdown />
        </>
      }
      footer={
        <TableFooter
          limit={limit}
          setLimit={setLimit}
          offset={offset}
          setOffset={setOffset}
          total={totalRecords}
        />
      }
    >
      <DataTable headers={tableHeaders}>
        {isLoading || isFetching ? (
          <TableRow>
            <TableCell colSpan={6} className="py-10 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : rows.length > 0 ? (
          rows.map((item, index) => (
            <TableRow
              key={`${item.mt5_id}-${index}`}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {offset + index + 1}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  {item?.mt5_id || "-"}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                {item?.date || "-"}
              </TableCell>

              <TableCell className="px-6 py-5 text-sm font-semibold text-foreground">
                {item?.order_id || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-600">
                  {item?.volume || 0}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                  ${item?.commission ?? 0}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-10 text-center text-muted-foreground"
            >
              No commission records found
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
