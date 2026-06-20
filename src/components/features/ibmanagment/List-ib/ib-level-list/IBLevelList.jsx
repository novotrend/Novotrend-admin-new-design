"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";

import { useIBLevelList } from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Level", key: "level", sortable: true },
  { label: "Team", key: "team", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

export default function IBLevelList() {
  const searchParams = useSearchParams();

  const userCode = searchParams.get("userCode");

  const { data, isLoading } = useIBLevelList({
    email: userCode,
  });

  const rows = data?.data?.response?.data || [];

  return (
    <TableWrapper
      title="IB Level List"
      description="Manage and monitor all IB level teams"
      actions={
        <>
          <TableSearch />
          <ExportDropdown />
        </>
      }
      footer={
        <TableFooter
          limit={10}
          offset={0}
          total={rows.length}
          setLimit={() => {}}
          setOffset={() => {}}
        />
      }
    >
      <DataTable headers={tableHeaders}>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="py-10 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : rows.length > 0 ? (
          rows.map((item, index) => (
            <TableRow
              key={`${item.level}-${index}`}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {String(offset + index + 1).padStart(2, "0")}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  Level {item.level}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm font-semibold text-foreground">
                {item.team_count} Members
              </TableCell>

              <TableCell className="px-6 py-5">
                <Link
                  href={`/ib-managment/list-ib/show-ib-team-list?encodedIds=${encodeURIComponent(
                    item.encoded_ids
                  )}`}
                >
                  <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90">
                    <Users className="h-4 w-4" />
                    Show Team
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
              No levels found
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
