"use client";

import { CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useMarkUserLogAsReadMutation } from "@/services/notification/notification.mutation";
import { useUnreadUserLogsQuery } from "@/services/notification/notification.query";
import { useQueryClient } from "@tanstack/react-query";

const tableHeaders = [
  { label: "Date", key: "date", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Name", key: "name", sortable: true },
  { label: "Details", key: "details", sortable: false },
  { label: "Actions", key: "actions", sortable: false },
];

const getRecords = data => {
  const response = data?.response;

  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.records)) return response.records;
  if (Array.isArray(response?.logs)) return response.logs;
  if (Array.isArray(response?.user_logs)) return response.user_logs;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(data?.records)) return data.records;

  return [];
};

const getTotalRecords = (data, records) => {
  return (
    Number(data?.response?.total_records) ||
    Number(data?.response?.total) ||
    Number(data?.total_records) ||
    records.length
  );
};

const getField = (item, keys, fallback = "N/A") => {
  const value = keys.map(key => item?.[key]).find(field => field !== undefined && field !== null);

  return value === "" ? fallback : value || fallback;
};

export default function UnreadLogs() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useUnreadUserLogsQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const unreadLogs = getRecords(data);
  const total = getTotalRecords(data, unreadLogs);
  const { mutate: markAsRead, isPending: markingRead } = useMarkUserLogAsReadMutation();

  const handleMarkAsRead = item => {
    const id = item?.id || item?.log_id;

    if (!id) {
      toast.error("Log id missing");
      return;
    }

    setSelectedLogId(id);

    markAsRead(
      { id },
      {
        onSuccess: response => {
          toast.success(response?.result || "Log marked as read");
          queryClient.invalidateQueries({ queryKey: ["unread-user-logs"] });
          queryClient.invalidateQueries({ queryKey: ["read-user-logs"] });
        },
        onError: mutationError => {
          toast.error(mutationError?.message || "Unable to mark log as read");
        },
        onSettled: () => {
          setSelectedLogId(null);
        },
      }
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="overflow-x-auto">
        <TableWrapper
          title="Unread Logs"
          description="Manage and review all unread activity logs"
          actions={
            <>
              <TableSearch
                value={search}
                onChange={value => {
                  setSearch(value);
                  setOffset(0);
                }}
                placeholder="Search by name, email or details"
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
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  Loading unread logs...
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="px-6 py-8 text-center text-sm text-red-500"
                >
                  {error?.message || "Failed to load unread logs."}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !error && unreadLogs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  No unread logs found.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !error &&
              unreadLogs.map((item, index) => {
                const name = getField(item, ["name", "username", "user_name", "fullname"], "User");
                const date = getField(item, ["date", "created_at", "log_date", "req_date"]);
                const email = getField(item, ["email", "user_email", "useremail"], "N/A");
                const details = getField(item, ["details", "message", "log", "description", "activity"]);

                return (
                  <TableRow
                    key={`${item?.id || item?.log_id || item?.user_id || index}-${index}`}
                    className="border-b border-border transition-all hover:bg-muted/40"
                  >
                    <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                      {date}
                    </TableCell>

                    <TableCell className="px-6 py-5 text-sm text-foreground">{email}</TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{name}</p>

                          <p className="text-xs text-muted-foreground">Unread Activity</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="min-w-[280px] rounded-2xl border border-border bg-muted/30 px-4 py-3">
                        <p className="text-sm text-foreground">{details}</p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <button
                        onClick={() => handleMarkAsRead(item)}
                        disabled={markingRead && selectedLogId === (item?.id || item?.log_id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCheck className="h-4 w-4" />
                        {markingRead && selectedLogId === (item?.id || item?.log_id)
                          ? "Reading..."
                          : "Read"}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </DataTable>
        </TableWrapper>
      </div>
    </div>
  );
}
