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
import { useClientPagination } from "@/hooks/useClientPagination";
import { useState } from "react";

const tableHeaders = [
  { label: "#", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Bank Image", key: "bankImage" },
  { label: "Bank Information", key: "bankInformation" },
  { label: "Date", key: "date" },
  { label: "Action", key: "action" },
];

const getValue = (source, keys, fallback = "-") => {
  const value = keys.find(key => source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== "");

  return value ? source[value] : fallback;
};

const getStatusLabel = status => {
  const normalized = String(status ?? "").toLowerCase();

  if (normalized === "1" || normalized === "accepted" || normalized === "accept" || normalized === "active") {
    return "Accept";
  }
  if (normalized === "2" || normalized === "rejected" || normalized === "reject") return "Reject";
  if (normalized === "0" || normalized === "pending") return "Pending";

  return status || "-";
};

const getStatusClassName = status => {
  const label = getStatusLabel(status).toLowerCase();

  if (label === "accept") return "bg-emerald-500/20 text-emerald-700";
  if (label === "reject") return "bg-yellow-500/30 text-yellow-700";
  if (label === "pending") return "bg-sky-500/20 text-sky-700";

  return "bg-muted text-muted-foreground";
};

const getMediaUrl = (source, keys) => {
  const value = getValue(source, keys, "");
  return typeof value === "string" ? value.trim() : "";
};

export default function BankDetails({ userDetails, bankDetails = [] }) {
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const selectedUser = userDetails?.user ?? {};
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(bankDetails, 10, search, [selectedUser?.name, selectedUser?.email]);

  return (
    <TableWrapper
      title="Bank Details"
      description="Manage user bank information"
      actions={
        <>
          <TableSearch value={search} onChange={value => { setSearch(value); setOffset(0); }} />
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
        {bankDetails.length === 0 && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              No bank details found.
            </TableCell>
          </TableRow>
        )}

        {paginatedItems.map((row, index) => (
          <TableRow key={`${row.account_no}-${index}`} className="border-b border-border hover:bg-muted/40">
            <TableCell className="px-6 py-5">{offset + index + 1}</TableCell>

            <TableCell className="px-6 py-5">{selectedUser?.name || "-"}</TableCell>

            <TableCell className="px-6 py-5">{selectedUser?.email || "-"}</TableCell>

            <TableCell className="px-6 py-5">
              <KycFileThumbnail
                src={getMediaUrl(row, ["bank_image", "kyc_bank_image"])}
                alt="Bank Proof"
                onPreview={() => {
                  setSelectedFile(getMediaUrl(row, ["bank_image", "kyc_bank_image"]));
                  setPreviewOpen(true);
                }}
              />
            </TableCell>

            <TableCell className="min-w-[520px] px-6 py-5">
              BANK : {getValue(row, ["bank_name"])} | ACC. No.:{" "}
              {getValue(row, ["account_no", "bank_account_no"])} | Acc. name:{" "}
              {selectedUser?.name || "-"} | IFSC : {getValue(row, ["ifsc", "ifsc_code"])} |
              IBAN Number : {getValue(row, ["iban", "iban_code"])}
            </TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5">
              {getValue(row, ["date", "created_at", "accepted_date"])}
            </TableCell>

            <TableCell className="px-6 py-5">
              <span className={`inline-flex min-w-24 justify-center rounded px-4 py-2 text-sm font-medium ${getStatusClassName(row.status)}`}>
                {getStatusLabel(row.status)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>

      <KycFilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        selectedFile={selectedFile}
        fileName="Bank Proof Preview"
      />
    </TableWrapper>
  );
}
