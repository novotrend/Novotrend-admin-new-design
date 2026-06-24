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
import { useNewBankKYCListQuery } from "@/services/userkyc/userkyc.query";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Bank Image", key: "bankImage", sortable: false },
  { label: "Bank Information", key: "bankInfo", sortable: false },
  { label: "Date", key: "date", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

const normalizeImageSrc = src => {
  if (!src || typeof src !== "string") {
    return null;
  }

  const trimmedSrc = src.trim();
  const embeddedHttpsIndex = trimmedSrc.indexOf("https://", "https://".length);
  const embeddedHttpIndex = trimmedSrc.indexOf("http://", "http://".length);
  const embeddedIndexes = [embeddedHttpsIndex, embeddedHttpIndex].filter(index => index > 0);

  if (embeddedIndexes.length > 0) {
    return trimmedSrc.slice(Math.min(...embeddedIndexes));
  }

  return trimmedSrc || null;
};

export default function NewBankKyc() {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [actionType, setActionType] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useNewBankKYCListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const newBankKycData = data?.response?.records || [];
  const total = Number(data?.response?.total_records) || 0;

  return (
    <>
      <TableWrapper
        title="New Bank KYC"
        description="Manage and review all bank KYC submissions"
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
              <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                Loading bank KYC records...
              </TableCell>
            </TableRow>
          ) : newBankKycData.length > 0 ? (
            newBankKycData.map((item, index) => {
              const bankImageSrc = normalizeImageSrc(item?.bank_image);

              return (
                <TableRow
                  key={`${item?.kyc_id ?? item?.email ?? "new-bank-kyc"}-${index}`}
                  className="border-b border-border transition-all hover:bg-muted/40"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-sm text-foreground">
                    {item?.email || "N/A"}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    {bankImageSrc ? (
                      <KycThumbnail
                        src={bankImageSrc}
                        alt="Bank Proof"
                        onPreview={() => {
                          setSelectedImage(bankImageSrc);
                          setImageOpen(true);
                        }}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">No Image</span>
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="min-w-[260px] rounded-2xl border border-border bg-muted/30 px-4 py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Acc. Holder : {item.account_name || "N/A"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Acc. No : {item.bank_account_no || "N/A"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          IFSC : {item.ifsc_code || "N/A"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Bank : {item.bank_name || "N/A"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          IBAN : {item.iban_code || "N/A"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Country : {item.country_name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                    {item?.kyc_date || "-"}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* ACCEPT */}
                      <button
                        onClick={() => {
                          setSelectedGroup(item);
                          setActionType("accept");
                          setRejectOpen(true);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 transition-all hover:scale-105 hover:bg-emerald-500/20"
                      >
                        <Check className="h-5 w-5" />
                      </button>

                      {/* REJECT */}
                      <button
                        onClick={() => {
                          setSelectedGroup(item);
                          setActionType("reject");
                          setRejectOpen(true);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition-all hover:scale-105 hover:bg-red-500/20"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                No bank KYC records found
              </TableCell>
            </TableRow>
          )}
        </DataTable>
      </TableWrapper>

      <UserActionKycModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        actionData={{
          status: actionType === "accept" ? 1 : 2,
          data: selectedGroup,
        }}
        type="bankKyc"
      />

      <KycFilePreviewDialog
        open={imageOpen}
        onOpenChange={setImageOpen}
        selectedFile={selectedImage}
        fileName="New Bank KYC Document Preview"
      />
    </>
  );
}
