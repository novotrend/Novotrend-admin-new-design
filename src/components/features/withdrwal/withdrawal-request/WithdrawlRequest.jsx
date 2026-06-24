"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import WithdrawalActionModal from "@/components/common/modals/WithdrawalActionModal";
import { TableCell, TableRow } from "@/components/ui/table";
import { useWithdrawalRequestListQuery } from "@/services/withdrawalrequest/withdrawal.query";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Method", key: "method", sortable: true },
  { label: "Admin", key: "admin", sortable: true },
  { label: "Payment Details", key: "paymentDetails", sortable: false },
  { label: "Action", key: "action", sortable: false },
];

export default function WithdrawlRequest() {
  const [actionType, setActionType] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isError } = useWithdrawalRequestListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });
  const withdrawalRequests = data?.response?.withdrawal_requests || [];
  // pagination calculations
  const total = Number(data?.response?.total_records) || 0;
  const currentPage = Math.floor(offset / limit) + 1;
  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-border bg-background">
        <div className="overflow-x-auto">
          <TableWrapper
            title="Withdrawal Request"
            description="Manage and review all withdrawal requests"
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
                  <TableCell colSpan={9} className="py-10 text-center">
                    Loading withdrawal requests...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-red-500">
                    Failed to load withdrawal requests
                  </TableCell>
                </TableRow>
              ) : withdrawalRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center">
                    No withdrawal requests found
                  </TableCell>
                </TableRow>
              ) : (
                withdrawalRequests.map((item, index) => (
                  <TableRow
                    key={`${item?.req_id ?? index}-${index}`}
                    className="border-b border-border transition-all hover:bg-muted/40"
                  >
                    {/* ID */}
                    <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                      {String(offset + index + 1).padStart(2, "0")}
                    </TableCell>
                    {/* NAME */}
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {item?.name || "-"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* EMAIL */}
                    <TableCell className="px-6 py-5 text-sm text-foreground">
                      {item?.email || "-"}
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                      {item?.date || "-"}
                    </TableCell>

                    {/* AMOUNT */}
                    <TableCell className="px-6 py-5">
                      <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                        {item?.amount || "0"}
                      </span>
                    </TableCell>

                    {/* METHOD */}
                    <TableCell className="px-6 py-5">
                      <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                        {item?.withdraw_type || "-"}
                      </span>
                    </TableCell>

                    {/* ADMIN */}
                    <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                      {item?.admin || "-"}
                    </TableCell>

                    {/* PAYMENT DETAILS */}
                    <TableCell className="px-6 py-5">
                      <div className="min-w-[220px] rounded-2xl border border-border bg-muted/30 px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {item?.payment_details || "-"}
                        </p>
                      </div>
                    </TableCell>

                    {/* ACTION */}
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRequest(item);
                            setActionType("accept");
                            setActionModalOpen(true);
                          }}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background transition-all hover:bg-emerald-500/10"
                        >
                          <Check className="h-5 w-5 text-emerald-500" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRequest(item);
                            setActionType("reject");
                            setActionModalOpen(true);
                          }}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background transition-all hover:bg-red-500/10"
                        >
                          <X className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </DataTable>
          </TableWrapper>
        </div>
      </div>
      <WithdrawalActionModal
        open={actionModalOpen}
        onOpenChange={setActionModalOpen}
        selectedRequest={selectedRequest}
        actionType={actionType}
      />
    </>
  );
}
