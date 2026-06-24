"use client";

import { useState } from "react";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";

import { useAcceptedIBWithdrawalList } from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Admin", key: "admin", sortable: true },
  { label: "Remark", key: "remark", sortable: true },
];

export default function AcceptedIBList() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useAcceptedIBWithdrawalList({
    limit,
    offset,
    search,
  });

  const rows = data?.data?.response?.records || [];
  const total = data?.data?.response?.total_records || 0;

  return (
    <TableWrapper
      title="Accepted IB List"
      description="Manage and review all accepted IB withdrawal requests"
      actions={
        <>
          <TableSearch
            value={search}
            onChange={value => {
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
            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
              Loading accepted withdrawal requests...
            </TableCell>
          </TableRow>
        ) : rows.length > 0 ? (
          rows.map((item, index) => (
            <TableRow
              key={item.id || item.recordid || index}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {String(offset + index + 1).padStart(2, "0")}
              </TableCell>

              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>

                    <p className="text-xs text-muted-foreground">Accepted IB User</p>
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
                <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                  {item?.amount ? `$${Number(item.amount).toFixed(2)}` : "$0.00"}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                {item?.admin || item?.admin_name || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="inline-flex rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  <TruncatedCell text={item?.remark} maxLength={30} className="!text-emerald-600" />
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
              No accepted IB withdrawal requests found.
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
