"use client";

import { KycFileThumbnail as KycThumbnail } from "@/components/common/KycFilePreview";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import TruncatedCell from "@/components/common/TruncatedCell";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBankRejectedHistoryListQuery } from "@/services/userkyc/userkyc.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Country", key: "country", sortable: true },
  { label: "Bank Image", key: "bankImage", sortable: false },
  { label: "Bank Information", key: "bankInfo", sortable: false },
  { label: "Date", key: "date", sortable: true },
  { label: "Edited By", key: "editedBy", sortable: true },
  { label: "Remark", key: "remark", sortable: false },
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

export default function RejectedBankHistory() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isError } = useBankRejectedHistoryListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });
  const rejectedBankHistory = data?.response?.data || [];
  const total = Number(data?.response?.total_records) || 0;
  return (
    <TableWrapper
      title="Rejected Bank History"
      description="Manage and review all rejected bank KYC requests"
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
              Loading rejected bank history...
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
              Failed to load rejected bank history
            </TableCell>
          </TableRow>
        ) : rejectedBankHistory.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="py-10 text-center text-muted-foreground"
            >
              No rejected bank history records found
            </TableCell>
          </TableRow>
        ) : (
          rejectedBankHistory.map((item, index) => {
            const bankImageSrc = normalizeImageSrc(item?.bank_image);

            return (
              <TableRow
                key={`${item?.kyc_id ?? item?.id ?? item?.email ?? "rejected-bank-history"}-${item?.date ?? offset + index}-${index}`}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      {item.name?.charAt(0) || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name || "N/A"}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground">
                  {item.email || "N/A"}
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground">
                  {item.country || "-"}
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
                    <div className="flex h-20 w-32 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-xs font-medium text-muted-foreground">
                      No image
                    </div>
                  )}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="min-w-[200px] rounded-2xl border border-border bg-muted/30 p-4">
                    {(item.bank_info || "").split(/\s*\|\s*/).map((part, partIndex) => (
                      <p
                        key={`${part || "bank-info"}-${partIndex}`}
                        className="text-sm font-medium text-foreground break-words"
                      >
                        {part}
                      </p>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item.date || "-"}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500">
                    {item.edited_by || "-"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div>
                    <p className="text-sm font-medium leading-6 text-red-500">
                      <TruncatedCell text={item.remark} maxLength={50} className="!text-red-500" />
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </DataTable>
    </TableWrapper>
  );
}
