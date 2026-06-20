"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useClientPagination } from "@/hooks/useClientPagination";
import { decryptData } from "@/lib/utils";
import { useChangeMT5LeverageMutation } from "@/services/users/user.mutation";
import { useState } from "react";
import { toast } from "sonner";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "MT5 Account No", key: "mt5Account" },
  { label: "Reg Date Time", key: "regDate" },
  { label: "Leverage", key: "leverage" },
  { label: "Action", key: "action" },
];

export default function Leverage({ userDetails }) {
  const [search, setSearch] = useState("");
  const [selectedLeverage, setSelectedLeverage] = useState(null);
  const [leverageValue, setLeverageValue] = useState("");
  const leverages = userDetails?.mt5_leverage ?? [];
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(leverages, 10, search);
  const { mutate: changeLeverage, isPending } = useChangeMT5LeverageMutation();

  const handleOpenModal = row => {
    setSelectedLeverage(row);
    setLeverageValue(String(row?.leverage ?? ""));
  };

  const handleCloseModal = open => {
    if (isPending) return;

    if (!open) {
      setSelectedLeverage(null);
      setLeverageValue("");
    }
  };

  const handleUpdateLeverage = () => {
    if (!selectedLeverage?.accno || !leverageValue) return;

    changeLeverage(
      {
        accno: selectedLeverage.accno,
        leverage: leverageValue,
      },
      {
        onSuccess: data => {
          let successMessage = "Leverage changed successfully";
          try {
            if (typeof data?.result === "string") {
              const decryptedResult = decryptData(data.result);
              successMessage =
                decryptedResult?.data?.result || decryptedResult?.result || successMessage;
            }
          } catch (error) {
                    }
          toast.success(successMessage);
          setSelectedLeverage(null);
          setLeverageValue("");
        },
        onError: error => {
          toast.error(error?.message || "Failed to update leverage");
        },
      }
    );
  };

  return (
    <>
      <TableWrapper
        title="Leverage Management"
        description="Update MT5 account leverage settings"
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
          {leverages.length === 0 && (
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
                No leverage records found.
              </TableCell>
            </TableRow>
          )}

          {paginatedItems.map((row, index) => (
            <TableRow key={`${row.accno}-${index}`} className="border-b border-border hover:bg-muted/40">
              <TableCell className="px-6 py-5">{offset + index + 1}</TableCell>

              <TableCell className="px-6 py-5 font-medium">{row.accno || "-"}</TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-muted-foreground">
                {row.date || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                  {row.leverage}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <Button
                  type="button"
                  onClick={() => handleOpenModal(row)}
                  className="h-10 rounded-2xl bg-primary px-4 text-sm text-white hover:bg-primary/90"
                >
                  Update Leverage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </TableWrapper>

      <Dialog open={Boolean(selectedLeverage)} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border border-border bg-background p-0 shadow-[0_25px_80px_rgba(0,0,0,0.12)]">
          <DialogHeader className="border-b border-border px-8 py-6">
            <DialogTitle className="text-3xl font-bold tracking-tight text-foreground">
              Update Leverage
            </DialogTitle>
            <DialogDescription className="pt-2 text-base text-muted-foreground">
              Update MT5 account leverage for this trading account
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 px-8 py-8 md:grid-cols-2">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold tracking-tight text-foreground">
                Account Number
              </label>
              <input
                type="text"
                value={selectedLeverage?.accno || ""}
                readOnly
                className="h-13 w-full rounded-2xl border border-border bg-muted/30 px-4 text-sm font-medium text-muted-foreground shadow-sm outline-none"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold tracking-tight text-foreground">
                Leverage
              </label>
              <input
                type="text"
                value={leverageValue}
                onChange={event => setLeverageValue(event.target.value)}
                placeholder="Enter leverage"
                className="h-13 w-full rounded-2xl border border-border bg-muted/30 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-primary/30 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border bg-background px-8 py-6">
            <Button
              type="button"
              onClick={handleUpdateLeverage}
              disabled={isPending || !leverageValue}
              className="h-11 rounded-2xl bg-primary px-6 text-white hover:bg-primary/90"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
