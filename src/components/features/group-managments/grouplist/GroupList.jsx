"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import EditGroupModal from "@/components/common/modals/EditGroupModal";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useGetMT5GroupListQuery } from "@/services/groups/group.query";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "MT5 Name", key: "mt5_name", sortable: true },
  { label: "Status", key: "status", sortable: true },
  { label: "Generated Date", key: "generated_date", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

export default function GroupList() {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError } = useGetMT5GroupListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });
  const groups = data?.response?.group_list || [];
  // pagination calculations
  const total = Number(data?.response?.total_records) || 0;
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <>
      <TableWrapper
        title="Group List"
        description="Manage all MT5 trading groups"
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
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center">
                Loading groups...
              </TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-red-500">
                Failed to load groups
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            groups?.map((group, index) => (
              <TableRow
                key={group.id}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5">{offset + index + 1}</TableCell>

                <TableCell className="px-6 py-5 font-semibold">{group.name}</TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                    {group.mt5_name}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold ${
                      group.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {group.status}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {group.generated_date}
                </TableCell>
                <TableCell className="px-6 py-5">
                  <button
                    onClick={() => {
                      setSelectedGroup(group);
                      setOpen(true);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          {!isLoading && groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center">
                No groups found
              </TableCell>
            </TableRow>
          )}
        </DataTable>
      </TableWrapper>
      <EditGroupModal open={open} setOpen={setOpen} group={selectedGroup} />
    </>
  );
}
