"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";

import {
  usePendingIBList,
  useIBRequestAction,
} from "@/services/ib-managment/ib-managment.query";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Mobile", key: "mobile", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

export default function ListIBRequest() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = usePendingIBList({
    limit,
    offset,
    search,
  });

  const { mutate, isPending } = useIBRequestAction();
  const rows = data?.data?.response?.records || [];

  const handleAccept = (userId) => {
    mutate({
      type: "rejectib_user",
      user_id: userId,
      status: 1,
    });
  };

  const handleReject = (userId) => {
    mutate({
      type: "adminrejectib_user",
      user_id: userId,
      status: 2,
    });
  };

  return (
    <TableWrapper
      title="IB Request List"
      description="Manage all incoming IB requests"
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
          total={data?.data?.response?.total_records || 0}
        />
      }
    >
      <DataTable headers={tableHeaders}>
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-10 text-center text-muted-foreground"
            >
              Loading...
            </TableCell>
          </TableRow>
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-10 text-center text-muted-foreground"
            >
              No pending IB requests found
            </TableCell>
          </TableRow>
        ) : (
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
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item?.name || "-"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      IB Applicant
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm text-foreground">
                {item?.email || "-"}
              </TableCell>

              <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
                {item?.mobile || "-"}
              </TableCell>

              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <button
                    disabled={isPending}
                    onClick={() => handleAccept(item.user_id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </button>

                  <button
                    disabled={isPending}
                    onClick={() => handleReject(item.user_id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </DataTable>
    </TableWrapper>
  );
}
