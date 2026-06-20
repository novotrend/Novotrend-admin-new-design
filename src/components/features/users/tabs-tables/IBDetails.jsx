"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useClientPagination } from "@/hooks/useClientPagination";
import { useGetUserDownlineMutation } from "@/services/users/user.mutation";
import { useUserIbDetailsQuery } from "@/services/users/user.query";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Name", key: "name" },
  { label: "Reg Code", key: "regCode" },
  { label: "Mobile", key: "mobile" },
  { label: "Country", key: "country" },
  { label: "Reg Date", key: "regDate" },
  { label: "Ref Name", key: "refName" },
  { label: "Total IB Commission", key: "totalIbCommission" },
  { label: "Total Lots", key: "totalLots" },
  { label: "Remaining Commission", key: "remainingCommission" },
  { label: "IB Status", key: "ibStatus" },
  { label: "Action", key: "action" },
];

const fallbackValue = "Unavailable";

const getValue = (source, keys, fallback = fallbackValue) => {
  const key = keys.find(
    item => source?.[item] !== undefined && source?.[item] !== null && source?.[item] !== ""
  );

  return key ? source[key] : fallback;
};

const getDownlineRows = data => {
  const levels = data?.response?.levels ?? data?.result?.data?.response?.levels ?? [];

  if (!Array.isArray(levels)) return [];

  return levels.flatMap(levelItem =>
    (levelItem?.users ?? []).map(user => ({
      level: user?.level ?? levelItem?.level ?? fallbackValue,
      name: user?.name ?? fallbackValue,
      regCode: user?.reg_code ?? fallbackValue,
      userId: user?.user_id,
    }))
  );
};

export default function IBDetails({ userDetails }) {
  const [search, setSearch] = useState("");
  const { data, error, isFetching, isLoading } = useUserIbDetailsQuery({
    user_id: userDetails?.user?.user_id,
  });
  const ibDetails =
    data?.response?.ib_list ??
    data?.result?.data?.response?.ib_list ??
    (Array.isArray(data?.response) ? data.response : []);
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(ibDetails, 10, search);
  const isTableLoading = isLoading || (isFetching && ibDetails.length === 0);
  const [loadingDownlineId, setLoadingDownlineId] = useState("");
  const [isDownlineModalOpen, setIsDownlineModalOpen] = useState(false);
  const [downlineRows, setDownlineRows] = useState([]);
  const { mutate: getUserDownline, isPending: isDownlineLoading } =
    useGetUserDownlineMutation();

  const handleDownline = row => {
    const downlineId = getValue(row, ["user_id", "id", "ib_user_id"], "");
    const regCode = getValue(row, ["reg_code", "user_reg_code"], "");
    const email = getValue(row, ["email"], "");
    const requestId = downlineId || regCode || email;

    if (!requestId || isDownlineLoading) return;

    setLoadingDownlineId(requestId);
    getUserDownline(
      {
        user_id: downlineId,
        reg_code: regCode,
        email,
      },
      {
        onSuccess: response => {
          setDownlineRows(getDownlineRows(response));
          setIsDownlineModalOpen(true);
          setLoadingDownlineId("");
        },
        onError: error => {
          setLoadingDownlineId("");
          toast.error(error?.message || "Unable to fetch downline");
        },
      }
    );
  };

  return (
    <>
      <TableWrapper
        title="IB Details"
        description="Manage IB users and their commission data"
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
          {isTableLoading && (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
                Loading IB details...
              </TableCell>
            </TableRow>
          )}

          {!isTableLoading && error && (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-red-500">
                Failed to load IB details.
              </TableCell>
            </TableRow>
          )}

          {!isTableLoading && !error && paginatedItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
                No data found.
              </TableCell>
            </TableRow>
          )}

          {paginatedItems.map((row, index) => (
            <TableRow key={`${getValue(row, ["user_id"], index)}-${index}`} className="border-b border-border hover:bg-muted/40">
              {/* # */}
              <TableCell>{offset + index + 1}</TableCell>

              {/* NAME */}
              <TableCell className="font-medium">{getValue(row, ["name", "user_name"])}</TableCell>

              {/* REG CODE */}
              <TableCell>{getValue(row, ["reg_code", "user_reg_code", "email"])}</TableCell>

              {/* MOBILE */}
              <TableCell>{getValue(row, ["mobile", "user_mobile"])}</TableCell>

              {/* COUNTRY */}
              <TableCell>{getValue(row, ["country"])}</TableCell>

              {/* REG DATE */}
              <TableCell className="whitespace-nowrap">{getValue(row, ["reg_date", "date"])}</TableCell>

              {/* REF NAME */}
              <TableCell className="font-medium text-primary">{getValue(row, ["ref_name", "ib_name", "ibName"])}</TableCell>

              {/* TOTAL IB COMMISSION */}
              <TableCell className="font-semibold text-green-600">
                {getValue(row, ["total_ib_commission", "total_commission", "totalCommission"])}
              </TableCell>

              {/* TOTAL LOTS */}
              <TableCell>{getValue(row, ["total_lots", "total_volume", "totalVolume"])}</TableCell>

              {/* REMAINING COMMISSION */}
              <TableCell>{getValue(row, ["remaining_commission", "remain"])}</TableCell>

              {/* IB STATUS */}
              <TableCell>{getValue(row, ["is_ib_complete"])}</TableCell>

              {/* ACTION */}
              <TableCell>
                <button
                  type="button"
                  onClick={() => handleDownline(row)}
                  disabled={isDownlineLoading}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-primary/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-primary
                    transition-all
                    hover:bg-primary/15
                    hover:scale-[1.02]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Downline
                  {loadingDownlineId === getValue(row, ["user_id", "id", "ib_user_id", "reg_code", "user_reg_code", "email"], "") ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </TableWrapper>

      <Dialog open={isDownlineModalOpen} onOpenChange={setIsDownlineModalOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-3xl border border-border bg-background p-0">
          <DialogHeader className="border-b border-border px-8 py-6">
            <DialogTitle className="text-2xl font-bold text-foreground">User Downline</DialogTitle>
            <DialogDescription>
              Level-wise users connected under this IB account.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] overflow-auto px-8 pb-8">
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-muted/60 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <tr>
                    <th className="w-20 px-5 py-4">#</th>
                    <th className="px-5 py-4">User Name</th>
                    <th className="px-5 py-4">User Code</th>
                    <th className="w-28 px-5 py-4">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {downlineRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                        No downline users found.
                      </td>
                    </tr>
                  ) : (
                    downlineRows.map((row, index) => (
                      <tr key={`${row.userId || row.regCode}-${index}`} className="border-t border-border hover:bg-muted/40">
                        <td className="px-5 py-4 text-muted-foreground">{index + 1}</td>
                        <td className="px-5 py-4 font-medium text-foreground">{row.name}</td>
                        <td className="px-5 py-4 text-muted-foreground">{row.regCode}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex min-w-9 justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {row.level}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
