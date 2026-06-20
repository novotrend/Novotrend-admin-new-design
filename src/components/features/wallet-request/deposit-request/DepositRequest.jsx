"use client";

import {
  KycFilePreviewDialog,
  KycFileThumbnail,
} from "@/components/common/KycFilePreview";
import { Check, X } from "lucide-react";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useWalletRequestList } from "@/services/walletrequest/wallet.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import WalletAcceptedRequest from "../accepted-list/WalletAcceptedRequest";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Image", key: "image", sortable: false },
  { label: "Deposit Method", key: "method", sortable: true },
  { label: "Transaction ID", key: "transactionId", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

export default function DepositRequest() {
  const [previewFile, setPreviewFile] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading } = useWalletRequestList({
    limit,
    offset,
    search: debouncedSearch,
  });
  const depositRequests = data?.response?.records || [];

  // pagination calculations
  const total = Number(data?.response?.total_records) || 0;
  const handleSearchChange = value => {
    setSearch(value);
    setOffset(0);
  };

  return (
    <>
      <TableWrapper
        title="Deposit Request"
        description="Manage and review all deposit requests"
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
              <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                Loading deposit requests...
              </TableCell>
            </TableRow>
          ) : depositRequests?.length > 0 ? (
            depositRequests.map((item, index) => (
              <TableRow
                key={`${item?.id ?? index}-${index}`}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                {/* ID */}
                <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                  {String(offset + index + 1).padStart(2, "0")}
                </TableCell>

                {/* USER */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      {item?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item?.name || "N/A"}</p>

                      <p className="text-xs text-muted-foreground">Deposit User</p>
                    </div>
                  </div>
                </TableCell>

                {/* EMAIL */}
                <TableCell className="px-6 py-5 text-sm text-foreground">
                  {item?.email || "N/A"}
                </TableCell>

                {/* DATE */}
                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item?.req_date || "N/A"}
                </TableCell>

                {/* AMOUNT */}
                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                    ${item?.amount || "0"}
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
                    {item?.deposit_type || "N/A"}
                  </span>
                </TableCell>

                {/* TRANSACTION ID */}
                <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                  {item?.transaction_id || "-"}
                </TableCell>

                {/* ACTION */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {/* APPROVE */}
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 transition-all hover:scale-105 hover:bg-emerald-500/20"
                      onClick={() => {
                        setSelectedRequest(item);
                        setActionType("accept");
                        setRemarkModalOpen(true);
                      }}
                    >
                      <Check className="h-5 w-5" />
                    </button>

                    {/* REJECT */}
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition-all hover:scale-105 hover:bg-red-500/20"
                      onClick={() => {
                        setSelectedRequest(item);
                        setActionType("reject");
                        setRemarkModalOpen(true);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                No deposit requests found
              </TableCell>
            </TableRow>
          )}
        </DataTable>
      </TableWrapper>
      <WalletAcceptedRequest
        open={remarkModalOpen}
        onOpenChange={setRemarkModalOpen}
        selectedRequest={selectedRequest}
        actionType={actionType}
      />
      <KycFilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        selectedFile={previewFile}
        fileName="Deposit Proof Preview"
      />
    </>
  );
}
