"use client";

import {
  KycFilePreviewDialog,
  KycFileThumbnail as KycThumbnail,
} from "@/components/common/KycFilePreview";
import UserActionKycModal from "@/components/common/modals/UserActionKycModal";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";
import { useNewKYCQuery } from "@/services/userkyc/userkyc.query";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
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
  { label: "Action", key: "action", sortable: true },
];

export default function NewKyc() {
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");
  const [actionData, setActionData] = useState(null);
  const [actionOpen, setActionOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError } = useNewKYCQuery({
    limit,
    offset,
    search: debouncedSearch,
  });
  const newKycDate = data?.response?.records || [];
  const total = Number(data?.response?.total_records) || 0;

  return (
    <>
      <TableWrapper
        title="New Kyc List"
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
                Loading new KYC records...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
                Failed to load new KYC records
              </TableCell>
            </TableRow>
          ) : newKycDate.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeaders.length}
                className="py-10 text-center text-muted-foreground"
              >
                No new KYC records found
              </TableCell>
            </TableRow>
          ) : (
            newKycDate.map((item, index) => (
              <TableRow
                key={`${item?.kyc_id ?? item?.email ?? "new-kyc"}-${index}`}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      {item?.name?.charAt(0) || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground">
                  {item?.email || "-"}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    {item?.doc_type || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item?.identity_front_photo}
                    alt="ID Front"
                    onPreview={() => {
                      setSelectedImage(item.identity_front_photo);
                      setImageOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item?.identity_back_photo}
                    alt="ID Back"
                    onPreview={() => {
                      setSelectedImage(item.identity_back_photo);
                      setImageOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item?.address_photo}
                    alt="Address Front"
                    onPreview={() => {
                      setSelectedImage(item.address_photo);
                      setImageOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item?.address_photo_back}
                    alt="Address Back"
                    onPreview={() => {
                      setSelectedImage(item.address_photo_back);
                      setImageOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item?.kyc_date || "-"}
                </TableCell>

                <TableCell className="flex gap-2 px-6 py-5 mt-4">
                  <button
                    onClick={() => {
                      setActionData({
                        status: 1,
                        type: "accept",
                        data: item,
                      });
                      setActionOpen(true);
                    }}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background transition-all hover:bg-muted"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </button>

                  <button
                    onClick={() => {
                      setActionData({
                        status: 2,
                        type: "reject",
                        data: item,
                      });
                      setActionOpen(true);
                    }}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background transition-all hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </DataTable>
      </TableWrapper>
      <UserActionKycModal open={actionOpen} onOpenChange={setActionOpen} actionData={actionData} />
      <KycFilePreviewDialog
        open={imageOpen}
        onOpenChange={setImageOpen}
        selectedFile={selectedImage}
        fileName="New KYC Document Preview"
      />
    </>
  );
}
