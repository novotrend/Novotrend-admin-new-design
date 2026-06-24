"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";

import { useIBLevelWiseUserDetail } from "@/services/ib-managment/ib-managment.query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Phone", key: "phone", sortable: true },
  { label: "MT5 ID", key: "mt5Id", sortable: true },
  { label: "Total Lots", key: "totalLots", sortable: true },
  { label: "Total Commission", key: "totalCommission", sortable: true },
  { label: "IB Name", key: "ibName", sortable: true },
  { label: "Registration Date", key: "registrationDate", sortable: true },
];

export default function ShowIBTeamList() {
  const searchParams = useSearchParams();
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const encodedIds = searchParams.get("encodedIds");
  const level = searchParams.get("level");

  const { data, isLoading } = useIBLevelWiseUserDetail({
    encodedIds,
    level,
  });

  const rows = data?.data?.response?.data || [];
  const effectiveOffset = offset < rows.length ? offset : 0;
  const visibleRows = rows.slice(effectiveOffset, effectiveOffset + limit);

  const handleLimitChange = value => {
    setLimit(value);
    setOffset(0);
  };

  return (
    <TableWrapper
      title="IB Team List"
      description="Manage and monitor all IB team members"
      actions={
        <>
          <TableSearch />
          <ExportDropdown />
        </>
      }
      footer={
        <TableFooter
          limit={limit}
          offset={effectiveOffset}
          total={rows.length}
          setLimit={handleLimitChange}
          setOffset={setOffset}
        />
      }
    >
      <DataTable headers={tableHeaders}>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={9} className="py-10 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : visibleRows.length > 0 ? (
          visibleRows.map((item, index) => (
            <TableRow
              key={item.user_id || index}
              className="border-b border-border transition-all hover:bg-muted/40"
            >
              <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                {String(effectiveOffset + index + 1).padStart(2, "0")}
              </TableCell>

              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item?.name || "-"}</p>

                    <p className="text-xs text-muted-foreground">Team Member</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm text-foreground">
                {item?.email || "-"}
              </TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
                {item?.phone || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  {item?.mt5_id || "-"}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-600">
                  {item?.total_lots ?? 0}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                  {item?.total_commission ?? 0}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-600">
                  {item?.ib_name || "-"}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                {item?.registration_date || "-"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
              No team members found
            </TableCell>
          </TableRow>
        )}
      </DataTable>
    </TableWrapper>
  );
}
