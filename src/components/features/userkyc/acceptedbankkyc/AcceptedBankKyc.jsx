"use client";

import { X } from "lucide-react";

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
import { useBankKycAcceptedListQuery } from "@/services/userkyc/userkyc.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import DateInputFilter from "../acceptedkyc/DateInputFilter";

const tableHeaders = [
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Country", key: "country", sortable: true },
  { label: "Bank Image", key: "bankimage", sortable: true },
  { label: "Bank Information", key: "bankInfo", sortable: false },
  { label: "Date", key: "date", sortable: true },
  { label: "Accepted By", key: "acceptedBy", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

export default function AcceptedBankKyc() {
  const [search, setSearch] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [debouncedSearch] = useDebounce(search, 500);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionData, setActionData] = useState(null);
  const [filters, setFilters] = useState({
    sdate: "",
    edate: "",
  });

  const { data, isLoading, isError } = useBankKycAcceptedListQuery({
    limit,
    offset,
    search: debouncedSearch,
    sdate: filters.sdate,
    edate: filters.edate,
  });
  const acceptedBankKyc = data?.response?.records || [];
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
      />
      <TableWrapper
        title="Accepted Bank KYC"
        description="Manage and review all accepted bank KYC submissions"
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
                Loading accepted bank KYC records...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
                Failed to load accepted bank KYC records
              </TableCell>
            </TableRow>
          ) : acceptedBankKyc.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeaders.length}
                className="py-10 text-center text-muted-foreground"
              >
                No accepted bank KYC records found
              </TableCell>
            </TableRow>
          ) : (
            acceptedBankKyc.map((item, index) => (
              <TableRow
                key={`${item?.kyc_id ?? item?.id ?? item?.email ?? "accepted-bank-kyc"}-${item?.kyc_date ?? offset + index}-${index}`}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name || "N/A"}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground">
                  {item.email || "N/A"}
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground">
                  {item.country_name || "-"}
                </TableCell>

                {/* <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    {item.bank_name || "-"}
                  </span>
                </TableCell> */}

                <TableCell className="px-6 py-5">
                  <KycThumbnail
                    src={item.bank_image}
                    alt="bank_image"
                    width={94}
                    height={94}
                    onPreview={() => {
                      setSelectedImage(item.bank_image);
                      setImageOpen(true);
                    }}
                  />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="min-w-[260px] rounded-2xl border border-border bg-muted/30 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Bank A/C No
                        </span>

                        <span className="text-sm font-semibold text-foreground">
                          {item.bank_account_no || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Acc Name
                        </span>

                        <span className="text-sm font-semibold text-foreground">
                          {item.account_name || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          IFSC
                        </span>

                        <span className="text-sm font-semibold text-foreground">
                          {item.ifsc_code || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          IBAN
                        </span>

                        <span className="text-sm font-semibold text-foreground">
                          {item.iban_code || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item.kyc_date || "-"}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                    {item.accepted_by || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <button
                    onClick={() => {
                      setActionData({
                        status: 2,
                        data: item,
                      });
                      setActionOpen(true);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-all hover:bg-muted"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </DataTable>
        <UserActionKycModal
          open={actionOpen}
          onOpenChange={setActionOpen}
          actionData={actionData}
          type="bankKyc"
        />

        <KycFilePreviewDialog
          open={imageOpen}
          onOpenChange={setImageOpen}
          selectedFile={selectedImage}
          fileName="Bank KYC Document Preview"
        />
      </TableWrapper>
    </>
  );
}
