"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";
import { useMT5PasswordRejectedQuery } from "@/services/users/user.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Account Number", key: "accountnumber" },
  { label: "MT5 Password Request", key: "mt5" },
];

export default function MT5PassRejectedList() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useMT5PasswordRejectedQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  // FINAL USERS ARRAY
  const rejectpasswordlist = data?.response?.data || [];
  
  // pagination calculations
  const total = Number(data?.response?.total_records) || rejectpasswordlist?.length;
  const currentPage = Math.floor(offset / limit) + 1;
  return (
    <TableWrapper
      title="MT5 Password Rejected List"
      description="Manage MT5 password request approvals"
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
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-muted-foreground"
            >
              Loading rejected MT5 password requests...
            </TableCell>
          </TableRow>
        )}

        {error && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-red-500"
            >
              Failed to load rejected MT5 password requests.
            </TableCell>
          </TableRow>
        )}

        {!isLoading && !error && rejectpasswordlist.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-muted-foreground"
            >
              No rejected MT5 password requests found.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          !error &&
          rejectpasswordlist.map((user, index) => (
            <TableRow key={user.id} className="border-b border-border hover:bg-muted/40">
              {/* NAME */}
              <TableCell className="px-6 py-5 font-medium">{user.user_name}</TableCell>

              {/* EMAIL */}
              <TableCell className="px-6 py-5">{user.email}</TableCell>

              {/* ACCOUNT NUMBER */}
              <TableCell className="px-6 py-5">{user.account_number}</TableCell>

              {/* STATUS */}
              <TableCell className="px-6 py-5">
                <span
                  className="
                    rounded-xl px-3 py-1 text-xs font-semibold
                    bg-yellow-500/10 text-yellow-600
                  "
                >
                  {user.mainpassword}
                </span>
              </TableCell>
            </TableRow>
          ))}
      </DataTable>
    </TableWrapper>
  );
}
