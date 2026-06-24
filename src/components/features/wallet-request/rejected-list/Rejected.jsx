"use client";

import {
  KycFilePreviewDialog,
  KycFileThumbnail,
} from "@/components/common/KycFilePreview";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";

import { useRejectWalletRequestList } from "@/services/walletrequest/wallet.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Image", key: "image", sortable: false },
  { label: "Deposit Method", key: "method", sortable: true },
  { label: "Transaction ID", key: "transactionId", sortable: true },
];

export default function RejectedList() {
  const [previewFile, setPreviewFile] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 500);
  // API FETCH
  const { data, isLoading, error } = useRejectWalletRequestList({
    limit,
    offset,
    search: debouncedSearch,
  });
  // pagination calculations
  const total = Number(data?.response?.total_records) || 0;
  const handleSearchChange = value => {
    setSearch(value);
    setOffset(0);
  };

  // SAFE ARRAY
  const rejectedDeposits = data?.response?.records || [];

  return (
    <>
      <TableWrapper
        title="Rejected Deposit List"
        description="Manage and review all rejected deposit requests"
        actions={
          <>
            <TableSearch value={search} onChange={handleSearchChange} />
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
              Loading rejected deposits...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
              {error?.message || "Failed to load rejected deposits"}
            </TableCell>
          </TableRow>
        ) : rejectedDeposits.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="py-10 text-center text-muted-foreground"
            >
              No rejected deposits found
            </TableCell>
          </TableRow>
        ) : (
          rejectedDeposits.map((item, index) => (
            <TableRow
              key={`${item?.id ?? index}-${index}`}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              {/* ID */}
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {String(offset + index + 1).padStart(2, "0")}
              </TableCell>

              {/* NAME */}
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>
                  </div>
                </div>
              </TableCell>

              {/* EMAIL */}
              <TableCell className="px-6 py-5 text-sm text-foreground">
                {item?.email || "-"}
              </TableCell>

              {/* DATE */}
              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                {item?.accepted_date || "-"}
              </TableCell>

              {/* AMOUNT */}
              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-500">
                  {item?.amount || "0"}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <KycFileThumbnail
                  src={item?.image || item?.req_image}
                  alt="Deposit Proof"
                  onPreview={() => {
                    setPreviewFile(item?.image || item?.req_image || "");
                    setPreviewOpen(true);
                  }}
                />
              </TableCell>

              {/* METHOD */}
              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                  {item?.deposit_type || "-"}
                </span>
              </TableCell>

              {/* TRANSACTION ID */}
              <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                {item?.transaction_id || "-"}
              </TableCell>
            </TableRow>
          ))
        )}
        </DataTable>
      </TableWrapper>
      <KycFilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        selectedFile={previewFile}
        fileName="Rejected Deposit Proof Preview"
      />
    </>
  );
}
