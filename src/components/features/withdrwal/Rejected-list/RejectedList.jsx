"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useWithdrawalRejectListQuery } from "@/services/withdrawalrequest/withdrawal.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Method", key: "method", sortable: true },
  { label: "Payment Details", key: "paymentDetails", sortable: false },
];

export default function RejectedList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError } = useWithdrawalRejectListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const rejectedList = data?.response?.withdrawal_requests || [];
  const total = Number(data?.response?.total_records) || 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="overflow-x-auto">
        <TableWrapper
          title="Rejected Withdrawal List"
          description="View all rejected withdrawal requests"
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="py-10 text-center text-muted-foreground"
                >
                  Loading rejected withdrawals...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
                  Failed to load rejected withdrawals
                </TableCell>
              </TableRow>
            ) : rejectedList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="py-10 text-center text-muted-foreground"
                >
                  No rejected withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              rejectedList.map((item, index) => (
                <TableRow
                  key={`${item?.id ?? index}-${index}`}
                  className="border-b border-border transition-all hover:bg-muted/40"
                >
                  <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                    {String(offset + index + 1).padStart(2, "0")}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>

                        <p className="text-xs text-muted-foreground">Rejected User</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-sm text-foreground">
                    {item?.email || "-"}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                    {item?.date || "-"}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <span className="rounded-xl bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-500">
                      ${item?.amount || 0}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      {item?.withdraw_type || "-"}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="min-w-[320px] rounded-2xl border border-border bg-muted/30 px-4 py-3">
                      <p className="break-words text-sm font-medium text-foreground">
                        {item?.payment_details || "-"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </DataTable>
        </TableWrapper>
      </div>
    </div>
  );
}
