"use client";

import { Ban } from "lucide-react";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import {
  useAdminUserActionMutation,
  useGetUserDetailsMutation,
} from "@/services/users/user.mutation";
import { useUsersQuery } from "@/services/users/user.query";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";
import { useDebounce } from "use-debounce";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Email", key: "email", sortable: true },
  { label: "Name", key: "name", sortable: true },
  { label: "Password", key: "password", sortable: false },
  { label: "Mobile Number", key: "mobile", sortable: true },
  { label: "Country", key: "country", sortable: true },
  { label: "Wallet Balance", key: "balance", sortable: true },
  { label: "IB Name", key: "ibName", sortable: true },
  { label: "Reg Date", key: "regDate", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

export default function ListUserTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loadingUserId, setLoadingUserId] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useUsersQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const queryClient = useQueryClient();
  const { mutate: userAction } = useAdminUserActionMutation();
  const { mutate: getUserDetails, isPending: isDetailsLoading } = useGetUserDetailsMutation();
  // FINAL USERS ARRAY
  const users = data?.response?.users ?? [];

  // pagination calculations
  const total = Number(data?.response?.total_records) || users.length;
  const currentPage = Math.floor(offset / limit) + 1;

  // Active status toggle handler (placeholder)
  const handleToggleStatus = user => {
    const action = user.status === "Active" ? "deactive" : "active";
    const willBeActive = action === "active";
    const queryKey = ["users", limit, offset, debouncedSearch];

    // snapshot for rollback
    const previous = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, old => {
      if (!old?.response?.users) return old;
      const users = old.response.users.map(u =>
        u.user_id === user.user_id ? { ...u, status: willBeActive ? "Active" : "Inactive" } : u
      );
      return { ...old, response: { ...old.response, users } };
    });

    userAction(
      {
        user_id: user.user_id,
        type: action,
      },
      {
        onSuccess: res => {
          // refresh server data to ensure consistency
          queryClient.invalidateQueries(queryKey);
        },
        onError: err => {
          // rollback
          queryClient.setQueryData(queryKey, previous);
        },
      }
    );
  };

  const handleForceLogout = user => {
    userAction(
      {
        user_id: user.user_id,
        type: "logout",
      },
      {
        onSuccess: res => {
          // show a simple confirmation message
          try {
            alert("User logged out successfully");
          } catch (e) {}
        },
        onError: err => {
          try {
            alert("Failed to logout user");
          } catch (e) {}
        },
      }
    );
  };

  const handleUserDetails = user => {
    const userId = user.user_id || user.id;

    if (!userId || isDetailsLoading) return;

    setLoadingUserId(userId);
    getUserDetails(
      {
        user_id: userId,
      },
      {
        onSuccess: response => {
          sessionStorage.setItem("selectedUserDetails", JSON.stringify(response));
          router.push("/users/user-details");
        },
        onError: error => {
          setLoadingUserId("");
          toast.error(error?.message || "Unable to fetch user details");
        },
      }
    );
  };

  return (
    <TableWrapper
      title="User List"
      description="Manage and monitor all registered users"
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
      {isDetailsLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-5 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-semibold text-foreground">Loading user details...</span>
          </div>
        </div>
      )}
      <DataTable headers={tableHeaders}>
        {/* Loading */}
        {isLoading && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-muted-foreground"
            >
              Loading users...
            </TableCell>
          </TableRow>
        )}

        {/* Error */}
        {error && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-red-500"
            >
              Failed to load users.
            </TableCell>
          </TableRow>
        )}

        {/* Empty */}
        {!isLoading && !error && users.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              className="px-6 py-8 text-center text-sm text-muted-foreground"
            >
              No users found.
            </TableCell>
          </TableRow>
        )}

        {/* API DATA */}
        {users.map((user, index) => (
          <TableRow
            key={`${user.user_id}-${index}`}
            onClick={() => handleUserDetails(user)}
            className={`cursor-pointer border-b border-border transition-all hover:bg-muted/40 ${
              loadingUserId === user.user_id ? "bg-primary/5" : ""
            }`}
          >
            {/* ID */}
            <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
              {String(offset + index + 1).padStart(2, "0")}
            </TableCell>

            {/* Email */}
            <TableCell className="px-6 py-5">
              <button
                type="button"
                className="text-left text-sm font-medium text-foreground hover:text-primary hover:underline"
              >
                {user.email}
              </button>
            </TableCell>

            {/* Name */}
            <TableCell className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                  {loadingUserId === user.user_id && isDetailsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    user.name?.charAt(0)
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    className="text-left text-sm font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {user.name}
                  </button>
                </div>
              </div>
            </TableCell>

            {/* Password */}
            <TableCell className="px-6 py-5 text-sm text-muted-foreground">
              {user.password}
            </TableCell>

            {/* Mobile */}
            <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
              {user.mobile}
            </TableCell>

            {/* Country */}
            <TableCell className="px-6 py-5 text-sm text-foreground">{user.country}</TableCell>

            {/* Wallet */}
            <TableCell className="px-6 py-5">
              <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                ${Number(user.wallet_balance || 0).toFixed(2)}
              </span>
            </TableCell>

            {/* IB Name */}
            <TableCell className="px-6 py-5 text-sm text-foreground">
              {user.ib_name || user.ibName || user["ib name"] || "-"}
            </TableCell>

            {/* Registration Date */}
            <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
              {user.registration_date}
            </TableCell>
            {/* Action */}
            <TableCell className="px-6 py-5">
              <div className="flex items-center gap-2">
                {/* Activate / Deactivate */}
                <button
                  onClick={event => {
                    event.stopPropagation();
                    handleToggleStatus(user);
                  }}
                  className={`group flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300
      ${
        user.status === "Active"
          ? "border-green-500/20 bg-green-500/10 text-green-500 hover:bg-red-500 hover:border-red-500 hover:text-white"
          : "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-green-500 hover:border-green-500 hover:text-white"
      }`}
                >
                  {user.status === "Active" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Ban className="h-5 w-5" />
                  )}
                </button>

                {/* Force Logout */}
                <button
                  onClick={event => {
                    event.stopPropagation();
                    handleForceLogout(user);
                  }}
                  className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-500 transition-all duration-300 hover:scale-105 hover:bg-orange-500 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </TableWrapper>
  );
}
