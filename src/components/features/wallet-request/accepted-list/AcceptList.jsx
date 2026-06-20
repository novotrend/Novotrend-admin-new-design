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

import { useAcceptWalletRequestList } from "@/services/walletrequest/wallet.query";
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

export default function AcceptList() {
  const [previewFile, setPreviewFile] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 500);
  // API FETCH
  const { data, isLoading, error } = useAcceptWalletRequestList({
    limit,
    offset,
    search: debouncedSearch,
  });
  // RESPONSE ARRAY
  const acceptedDeposits = data?.response?.records || [];

  // pagination calculations
  const total = Number(data?.response?.total_records) || 0;
  const handleSearchChange = value => {
    setSearch(value);
    setOffset(0);
  };

  return (
    <>
      <TableWrapper
        title="Accepted Deposit List"
        description="Manage and review all accepted deposit requests"
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
              Loading accepted deposits...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
              {error?.message || "Failed to load data"}
            </TableCell>
          </TableRow>
        ) : acceptedDeposits.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="py-10 text-center text-muted-foreground"
            >
              No accepted deposits found
            </TableCell>
          </TableRow>
        ) : (
          acceptedDeposits?.map((item, index) => (
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                    {item?.name?.charAt(0) || "U"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>

                    <p className="text-xs text-muted-foreground">Accepted Deposit</p>
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
                <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600">
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
        fileName="Accepted Deposit Proof Preview"
      />
    </>
  );
}
