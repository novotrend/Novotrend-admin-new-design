"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";

import { useChangeMT5PasswordRequestStatus } from "@/services/users/user.mutation";
import { useMT5PasswordRequestQuery } from "@/services/users/user.query";

const tableHeaders = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Account Number", key: "accountnumber" },
  { label: "MT5 Password Request", key: "mt5" },
  { label: "Action", key: "action" },
];

export default function MT5PassRequestList() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pendingAction, setPendingAction] = useState(null);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useMT5PasswordRequestQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const changeStatusMutation = useChangeMT5PasswordRequestStatus();

  const Passwordlist = data?.response?.data || [];

  const total = Number(data?.response?.total_records) || Passwordlist.length;

  const handleAccept = user => {
    setPendingAction({ id: user.id, status: 1 });
    changeStatusMutation.mutate(
      {
        id: user.id,
        status: 1,
      },
      {
        onSettled: () => setPendingAction(null),
      }
    );
  };

  const handleReject = user => {
    setPendingAction({ id: user.id, status: 2 });
    changeStatusMutation.mutate(
      {
        id: user.id,
        status: 2,
      },
      {
        onSettled: () => setPendingAction(null),
      }
    );
  };

  return (
    <TableWrapper
      title="MT5 Password Requests"
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
              Loading MT5 password requests...
            </TableCell>
          </TableRow>
        )}

        {error && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-red-500"
            >
              Failed to load MT5 password requests.
            </TableCell>
          </TableRow>
        )}

        {!isLoading && !error && Passwordlist.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-muted-foreground"
            >
              No MT5 password requests found.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          !error &&
          Passwordlist.map(user => {
            const isAcceptPending =
              pendingAction?.id === user.id && pendingAction?.status === 1;
            const isRejectPending =
              pendingAction?.id === user.id && pendingAction?.status === 2;

            return (
            <TableRow key={user.id} className="border-b border-border hover:bg-muted/40">
              {/* NAME */}
              <TableCell className="px-6 py-5 font-medium">{user.user_name}</TableCell>

              {/* EMAIL */}
              <TableCell className="px-6 py-5">{user.email}</TableCell>

              {/* ACCOUNT NUMBER */}
              <TableCell className="px-6 py-5">{user.account_number}</TableCell>

              {/* PASSWORD */}
              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600">
                  {user.mainpassword}
                </span>
              </TableCell>

              {/* ACTION */}
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  {/* ACCEPT */}
                  <button
                    onClick={() => handleAccept(user)}
                    disabled={changeStatusMutation.isPending}
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-xl bg-green-500/10 text-green-600
                      transition hover:bg-green-500 hover:text-white
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    {isAcceptPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => handleReject(user)}
                    disabled={changeStatusMutation.isPending}
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-xl bg-red-500/10 text-red-600
                      transition hover:bg-red-500 hover:text-white
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    {isRejectPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
          })}
      </DataTable>
    </TableWrapper>
  );
}
