"use client";

import { useState } from "react";
import { Copy, DollarSign, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TableCell, TableRow } from "@/components/ui/table";
import { useIBList } from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Mobile", key: "mobile", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "IB Name", key: "ib_name", sortable: true },
  {
    label: "Total Commission",
    key: "total_commission",
    sortable: true,
  },
  {
    label: "Available Commission",
    key: "available_commission",
    sortable: true,
  },
  { label: "Ref Link", key: "ref_link", sortable: false },
  { label: "Action", key: "action", sortable: false },
];

export default function ListIB() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching } = useIBList({
    limit,
    offset,
    search,
  });

  const rows = data?.data?.response?.records || data?.response?.records || [];
  const totalRecords =
    Number(data?.data?.response?.total_records ?? data?.response?.total_records ?? data?.total_records) ||
    rows.length;

  const copyReferralLink = async (link) => {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);

      toast.success("Referral link copied");
    } catch {
      toast.error("Failed to copy referral link");
    }
  };

  return (
    <TableWrapper
      title="IB List"
      description="Manage and monitor all IB users and commissions"
      actions={
        <>
          <TableSearch
            value={search}
            onChange={(value) => {
              setSearch(value);
              setOffset(0);
            }}
          />

          <ExportDropdown />
        </>
      }
      footer={
        <TableFooter
          limit={limit}
          setLimit={setLimit}
          offset={offset}
          setOffset={setOffset}
          total={totalRecords}
        />
      }
    >
      <DataTable headers={tableHeaders}>
        {isLoading || isFetching ? (
          <TableRow>
            <TableCell colSpan={10} className="py-10 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : rows.length > 0 ? (
          rows.map((item, index) => (
            <TableRow
              key={item.user_id}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {offset + index + 1}
              </TableCell>

              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                    {item?.name?.charAt(0) || "-"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item?.name || "-"}
                    </p>

                    <p className="text-xs text-muted-foreground">IB Member</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm text-foreground">
                {item?.email || "-"}
              </TableCell>

              <TableCell className="px-6 py-5 text-sm text-foreground">
                {item?.mobile || "-"}
              </TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                {item?.date || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  {item?.ib_name || "-"}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                  {item?.total_commission ?? 0}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-600">
                  {item?.available_commission ?? 0}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <button
                  type="button"
                  title="Copy referral link"
                  onClick={() => copyReferralLink(item?.ref_link)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-white transition-all hover:opacity-90"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </TableCell>

              <TableCell className="px-6 py-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-all hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="z-[999] w-48 rounded-2xl border border-border bg-background p-2 shadow-2xl"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/ib-managment/list-ib/ib-level-list?userCode=${item?.email}`}
                        className="flex items-center rounded-xl py-2.5 text-sm font-medium"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Downline
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href={`/ib-managment/list-ib/ib-commission-list?ibUser=${item.user_id}`}
                        className="flex items-center rounded-xl py-2.5 text-sm font-medium"
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Commission
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={10}
              className="py-10 text-center text-muted-foreground"
            >
              No IB users found
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
