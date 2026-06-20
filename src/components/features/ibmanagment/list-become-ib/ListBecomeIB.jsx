"use client";

import { UserX } from "lucide-react";
import { useState } from "react";

import DeactivateConfirmation from "@/components/common/modals/DeactivateConfirmation";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";

import { useApprovedIBList } from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Mobile", key: "mobile", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "IB Name", key: "ibName", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

export default function ListBecomeIB() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading } = useApprovedIBList({
    limit,
    offset,
    search,
  });

  const rows = data?.data?.response?.records;
  const total = data?.data?.response?.total_records || 0;

  return (
    <TableWrapper
      title="Become IB List"
      description="Manage and monitor all IB members"
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
          total={total}
        />
      }
    >
      <DataTable headers={tableHeaders}>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="py-10 text-center">
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
                    {(item?.name || "U").charAt(0)}
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

              <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                {item?.date || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-600">
                  {item?.ib_name || "-"}
                </span>
              </TableCell>

              <TableCell className="px-6 py-5">
                <button
                  onClick={() => {
                    setSelectedUser(item);
                    setOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  <UserX className="h-4 w-4" />
                  Deactivate
                </button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={7}
              className="py-10 text-center text-muted-foreground"
            >
              No records found
            </TableCell>
          </TableRow>
        )}
      </DataTable>

      <DeactivateConfirmation
        open={open}
        setOpen={setOpen}
        selectedUser={selectedUser}
      />
    </TableWrapper>
  );
}
