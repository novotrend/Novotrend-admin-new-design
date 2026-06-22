"use client";

import { useState } from "react";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRejectedIBList } from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Mobile", key: "mobile", sortable: true },
];

export default function LIstIBRejected() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching } = useRejectedIBList({
    limit,
    offset,
    search,
  });

  const rows = data?.data?.response?.records || data?.response?.records || [];
  const totalRecords =
    Number(data?.data?.response?.total_records ?? data?.response?.total_records ?? data?.total) ||
    rows.length;

  return (
    <TableWrapper
      title="Rejected IB List"
      description="Manage and monitor all rejected IB requests"
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
            <TableCell colSpan={4} className="py-10 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : rows?.length > 0 ? (
          rows?.map((item, index) => (
            <TableRow
              key={item.id || index}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {offset + index + 1}
              </TableCell>

              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-sm font-semibold text-red-500">
                    {item?.name?.charAt(0) || "-"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item?.name || "-"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Rejected IB User
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm text-foreground">
                {item?.email || "-"}
              </TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
                {item?.mobile || "-"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-10 text-center text-muted-foreground"
            >
              No rejected IB records found
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
