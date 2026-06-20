"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";

import MT5AccountDetailsModal from "@/components/common/modals/MT5AccountDetailsModal";
import { useGetMT5AccountDetailsMutation } from "@/services/users/user.mutation";
import { useMT5UsersQuery } from "@/services/users/user.query";
import { toast } from "sonner";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "MT5 ID", key: "mt5Id" },
  { label: "Email", key: "email" },
  { label: "Name", key: "name" },
  { label: "Mobile Number", key: "mobile" },
  { label: "Country", key: "country" },
  { label: "Generate Date", key: "generateDate" },
  { label: "Group Name", key: "groupname" },
  { label: "Group Wallet Balance", key: "walletBalance" },
  { label: "Action", key: "action" },
];

export default function MT5UserList() {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingAccountId, setLoadingAccountId] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { mutate: getMT5AccountDetails, isPending: loadingAccountDetails } =
    useGetMT5AccountDetailsMutation();
  const { data, isLoading, error } = useMT5UsersQuery({
    limit,
    offset,
    search: debouncedSearch,
  });
  const mt5Response = data?.result?.data?.response ?? data?.response ?? {};
  const users = mt5Response?.mt5_users ?? [];

  const total = Number(mt5Response?.total_records) || users.length;

  const handleView = user => {
    const accno = user?.mt5_id || user?.accno || "";
    setLoadingAccountId(accno);
    getMT5AccountDetails(
      { accno },
      {
        onSuccess: response => {
          const details = response?.response || response?.data?.response || response;
          setSelectedUser({
            ...user,
            mt5AccountDetails: details,
          });
          setOpenDetailsModal(true);
        },
        onError: error => {
          toast.error(error?.message || "Failed to fetch MT5 account details");
        },
        onSettled: () => {
          setLoadingAccountId("");
        },
      }
    );
  };

  return (
    <TableWrapper
      title="MT5 User List"
      description="Manage and monitor all MT5 registered users"
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
            <TableCell colSpan={tableHeaders.length} className="py-10 text-center">
              Loading...
            </TableCell>
          </TableRow>
        )}

        {error && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-10 text-center text-red-500">
              Failed to load users
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          users.map((user, index) => (
            <TableRow key={user.id} className="border-b border-border hover:bg-muted/40">
              {/* SR NO */}
              <TableCell className="px-6 py-5">{offset + index + 1}</TableCell>

              {/* MT5 ID */}
              <TableCell className="px-6 py-5">{user.mt5_id}</TableCell>

              {/* EMAIL */}
              <TableCell className="px-6 py-5">{user.email}</TableCell>

              {/* NAME */}
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {user.name?.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>
              </TableCell>
              {/* MOBILE */}
              <TableCell className="px-6 py-5">{user.mobile}</TableCell>
              {/* COUNTRY */}
              <TableCell className="px-6 py-5">{user.country}</TableCell>
              {/* DATE */}
              <TableCell className="px-6 py-5">{user.generate_date}</TableCell>
              {/* GROUP */}
              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-blue-500">
                  {user.group_name}
                </span>
              </TableCell>

              {/* BALANCE */}
              <TableCell className="px-6 py-5">
                <span className="rounded-xl bg-primary/10 px-3 py-1 font-semibold text-primary">
                  ${user.wallet_balance}
                </span>
              </TableCell>

              {/* ACTION */}
              <TableCell className="px-6 py-5">
                <button
                  onClick={() => handleView(user)}
                  disabled={loadingAccountDetails && loadingAccountId === user.mt5_id}
                  className="flex h-10 w-10 items-center justify-center rounded-xl disabled:opacity-60"
                >
                  {loadingAccountDetails && loadingAccountId === user.mt5_id ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </TableCell>
            </TableRow>
          ))}
      </DataTable>

      <MT5AccountDetailsModal
        open={openDetailsModal}
        onOpenChange={setOpenDetailsModal}
        user={selectedUser}
      />
    </TableWrapper>
  );
}
