"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";
import { useInternalTransferReportQuery } from "@/services/report/report.query";
import { useState } from "react";
import DateInputFilter from "../../userkyc/acceptedkyc/DateInputFilter";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Sender", key: "sender" },
  { label: "Receiver", key: "receiver" },
  { label: "Amount", key: "amount" },
  { label: "Date", key: "date" },
  { label: "Remark", key: "remark" },
  { label: "Transfer By", key: "transferBy" },
];

export default function InternalTransferReport() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    sdate: "",
    edate: "",
  });

  const { data, isLoading, isError } = useInternalTransferReportQuery({
    limit,
    offset,
    search,
    sdate: filters.sdate,
    edate: filters.edate,
  });
  const transferData = data?.response?.internal_transfer_history || [];
  const total = Number(data?.response?.total_records) || 0;
  return (
    <>
      <DateInputFilter
        onSubmit={({ sdate, edate }) => {
          setOffset(0);
          setFilters({
            sdate,
            edate,
          });
        }}
        onClear={() => {
          setOffset(0);
          setFilters({
            sdate: "",
            edate: "",
          });
        }}
        isLoading={isLoading}
      />
      <TableWrapper
        title="Internal Transfer History"
        description="View all internal transfer activities"
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
                Loading internal transfer history...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
                Failed to load internal transfer history
              </TableCell>
            </TableRow>
          ) : transferData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeaders.length}
                className="py-10 text-center text-muted-foreground"
              >
                No internal transfer records found
              </TableCell>
            </TableRow>
          ) : (
            transferData.map((row, index) => (
              <TableRow
                key={`${row?.id ?? row?.sender_email ?? row?.receiver_email ?? "internal-transfer"}-${row?.date ?? offset + index}-${index}`}
                className="border-b border-border transition-all hover:bg-muted/30"
              >
                {/* ID */}
                <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                  {String(offset + index + 1).padStart(2, "0")}
                </TableCell>

                {/* Sender */}
                <TableCell className="px-6 py-5">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {row.sender_name || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">{row.sender_email || "-"}</p>
                  </div>
                </TableCell>

                {/* Receiver */}
                <TableCell className="px-6 py-5">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {row.receiver_name || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">{row.receiver_email || "-"}</p>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                    {row.amount || "-"}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {row.date || "-"}
                </TableCell>

                {/* Remark */}
                <TableCell className="px-6 py-5 text-sm text-foreground">
                  <TruncatedCell text={row.remark} maxLength={50} />
                </TableCell>

                {/* Transfer By */}
                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {row.transfer_by || "-"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </DataTable>
      </TableWrapper>
    </>
  );
}
