"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useReadUserLogsQuery } from "@/services/notification/notification.query";

const tableHeaders = [
  { label: "Date", key: "date", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Name", key: "name", sortable: true },
  { label: "Details", key: "details", sortable: false },
  { label: "Read By", key: "readBy", sortable: true },
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

export default function ReadLogs() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useReadUserLogsQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const readLogs = getRecords(data);
  const total = getTotalRecords(data, readLogs);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="overflow-x-auto">
        <TableWrapper
          title="Read Logs"
          description="View all reviewed and completed activity logs"
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
                  Loading read logs...
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="px-6 py-8 text-center text-sm text-red-500"
                >
                  {error?.message || "Failed to load read logs."}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !error && readLogs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  No read logs found.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !error &&
              readLogs.map((item, index) => {
                const name = getField(item, ["name", "username", "user_name", "fullname"], "User");
                const date = getField(item, ["date", "created_at", "log_date", "req_date"]);
                const email = getField(item, ["email", "user_email", "useremail"], "N/A");
                const details = getField(item, ["details", "message", "log", "description", "activity"]);
                const readBy = getField(item, ["read_by", "readBy", "admin_name", "read_username"], "--");

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

                          <p className="text-xs text-muted-foreground">Reviewed Activity</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="min-w-[320px] rounded-2xl border border-border bg-muted/30 px-4 py-3">
                        <p className="text-sm text-foreground">{details}</p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <span className="inline-flex rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600">
                        {readBy}
                      </span>
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
