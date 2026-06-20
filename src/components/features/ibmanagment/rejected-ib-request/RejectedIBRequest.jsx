"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";
import { useRejectedIBListRequest } from "@/services/ib-managment/ib-managment.query";
import { useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Admin", key: "admin", sortable: true },
  { label: "Remark", key: "remark", sortable: true },
];

export default function RejectedIBRequest() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useRejectedIBListRequest({
    limit,
    offset,
    search,
  });

  const rows = data?.data?.response?.records || [];
  const total = data?.data?.response?.total_records || 0;

  return (
    <TableWrapper
      title="Rejected IB Request"
      description="Manage and review all rejected IB withdrawal requests"
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
              Loading rejected withdrawal requests...
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                    {(item?.name || "-").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>

                    <p className="text-xs text-muted-foreground">Rejected IB User</p>
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
                  {item?.amount ? `$${Number(item.amount).toFixed(2)}` : "$0.00"}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                {item?.admin || item?.admin_name || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="inline-flex rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500">
                  <TruncatedCell text={item?.remark} maxLength={30} className="!text-red-500" />
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
              No rejected IB withdrawal requests found.
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
