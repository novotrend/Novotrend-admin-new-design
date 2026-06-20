"use client";

import {
  KycFilePreviewDialog,
  KycFileThumbnail as KycThumbnail,
} from "@/components/common/KycFilePreview";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { useState } from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRejectedKycHistoryListQuery } from "@/services/userkyc/userkyc.query";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Type Of Document", key: "documentType", sortable: true },
  { label: "ID Front", key: "idFront", sortable: false },
  { label: "ID Back", key: "idBack", sortable: false },
  { label: "Address Front", key: "addressFront", sortable: false },
  { label: "Address Back", key: "addressBack", sortable: false },
  { label: "Uploaded", key: "uploaded", sortable: true },
  { label: "Edited By", key: "editedBy", sortable: true },
  { label: "Remark", key: "remark", sortable: true },
];

export default function RejectedKycHistory() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError } = useRejectedKycHistoryListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });
  const rejectedKyc = data?.response?.records || [];
  const total = Number(data?.response?.total_records) || 0;

  return (
    <>
      <TableWrapper
        title="Rejected KYC History"
        description="Manage and review all rejected KYC submissions"
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
                Loading rejected KYC history...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
                Failed to load rejected KYC history
              </TableCell>
            </TableRow>
          ) : rejectedKyc.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeaders.length}
                className="py-10 text-center text-muted-foreground"
              >
                No rejected KYC records found
              </TableCell>
            </TableRow>
          ) : (
            rejectedKyc.map((item, index) => (
              <TableRow
                key={`${item?.kyc_id ?? item?.id ?? item?.email ?? "rejected-kyc"}-${item?.kyc_date ?? offset + index}-${index}`}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      {item.name?.charAt(0) || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground">{item.email}</TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    {item.doc_type}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item.identity_front_photo}
                    alt="ID Front"
                    onPreview={() => {
                      setSelectedImage(item.identity_front_photo);
                      setOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item.identity_back_photo}
                    alt="ID Back"
                    onPreview={() => {
                      setSelectedImage(item.identity_back_photo);
                      setOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item.address_photo}
                    alt="Address Front"
                    onPreview={() => {
                      setSelectedImage(item.address_photo);
                      setOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item.address_photo_back}
                    alt="Address Back"
                    onPreview={() => {
                      setSelectedImage(item.address_photo_back);
                      setOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item.kyc_date || "-"}
                </TableCell>

                <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                  {item.accepted_by || "-"}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="inline-flex rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500">
                    <TruncatedCell
                      text={item.kyc_remark}
                      maxLength={30}
                      className="!text-red-500"
                    />
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </DataTable>
      </TableWrapper>

      <KycFilePreviewDialog
        open={open}
        onOpenChange={setOpen}
        selectedFile={selectedImage}
        fileName="Rejected KYC Document Preview"
      />
    </>
  );
}
