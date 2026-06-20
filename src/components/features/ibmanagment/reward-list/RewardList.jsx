"use client";

import { useState } from "react";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";
import { useIBRewardList } from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Royalty Level", key: "royaltyLevel", sortable: true },
  { label: "Pay Date", key: "payDate", sortable: true },
  { label: "Pay Status", key: "payStatus", sortable: true },
];

export default function RewardList() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useIBRewardList({
    limit,
    offset,
    search,
  });

  const rows = data?.data?.response?.records || [];
  const total = data?.data?.response?.total_records || 0;

  return (
    <TableWrapper
      title="Reward List"
      description="Manage and review all royalty reward payments"
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
          total={total}
        />
      }
    >
      <DataTable headers={tableHeaders}>
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="py-10 text-center text-muted-foreground"
            >
              Loading...
            </TableCell>
          </TableRow>
        ) : rows.length > 0 ? (
          rows.map((item, index) => (
            <TableRow
              key={item.id || index}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {String(offset + index + 1).padStart(2, "0")}
              </TableCell>

              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                    {item?.name?.charAt(0)?.toUpperCase() || "-"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item?.name || "-"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Reward Member
                    </p>
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
                <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  {item?.amount || 0}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <span
                  className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold ${
                    item?.royalty_level === "Diamond"
                      ? "bg-violet-500/10 text-violet-600"
                      : item?.royalty_level === "Gold"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-slate-500/10 text-slate-600"
                  }`}
                >
                  {item?.royalty_level || "-"}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                {item?.pay_date || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span
                  className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold ${
                    item?.pay_status === "Paid"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }`}
                >
                  {item?.pay_status || "-"}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={8}
              className="py-10 text-center text-muted-foreground"
            >
              No reward records found
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}