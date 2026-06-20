"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useUserLoginLogsQuery } from "@/services/notification/notification.query";

const tableHeaders = [
  { label: "Date", key: "date", sortable: true },
  { label: "Details", key: "details", sortable: false },
];

const getRecords = data => {
  const response = data?.response;

  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.user_logs)) return response.user_logs;
  if (Array.isArray(response?.user_login_logs)) return response.user_login_logs;
  if (Array.isArray(response?.login_logs)) return response.login_logs;
  if (Array.isArray(response?.logs)) return response.logs;
  if (Array.isArray(response?.records)) return response.records;
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

const getField = (item, keys, fallback = "--") => {
  const value = keys.map(key => item?.[key]).find(field => field !== undefined && field !== null);

  return value === "" ? fallback : value || fallback;
};

const getDetailLines = details => {
  if (!details) return [];

  return String(details)
    .split(/<br\s*\/?>/i)
    .map(line => line.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean);
};

export default function UserLoginLogs() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useUserLoginLogsQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const userLoginLogs = getRecords(data);
  const total = getTotalRecords(data, userLoginLogs);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="overflow-x-auto">
        <TableWrapper
          title="User Login Logs"
          description="Track user login activity and request information"
          actions={
            <>
              <TableSearch
                value={search}
                onChange={value => {
                  setSearch(value);
                  setOffset(0);
                }}
                placeholder="Search user login logs"
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
                  Loading user login logs...
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="px-6 py-8 text-center text-sm text-red-500"
                >
                  {error?.message || "Failed to load user login logs."}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !error && userLoginLogs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  No user login logs found.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !error &&
              userLoginLogs.map((log, index) => {
                const date = getField(log, ["date", "login_date", "created_at", "time"]);
                const username = getField(log, ["username", "login", "name", "user_name", "email"]);
                const referer = getField(log, ["referer", "HTTP_REFERER", "http_referer"]);
                const browser = getField(log, ["browser", "HTTP_USER_AGENT", "user_agent", "http_user_agent"]);
                const ip = getField(log, ["ip", "REMOTE_ADDR", "remote_addr"]);
                const requestTime = getField(log, ["requestTime", "REQUEST_TIME", "request_time"]);
                const detailLines = getDetailLines(log?.details);

                return (
                  <TableRow
                    key={`${log?.id || log?.log_id || log?.user_id || index}-${index}`}
                    className="border-b border-border align-top hover:bg-muted/30"
                  >
                    <TableCell className="min-w-[220px] px-6 py-8">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">{date}</p>

                        <span className="inline-flex rounded-xl bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Login Activity
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[900px] px-6 py-8">
                      <div className="rounded-3xl border border-border bg-muted/20 p-6">
                        {detailLines.length > 0 ? (
                          <div className="space-y-2 text-sm leading-7">
                            {detailLines.map((line, lineIndex) => (
                              <p key={`${log?.id || index}-detail-${lineIndex}`} className="break-all text-muted-foreground">
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4 text-sm leading-8">
                            <div>
                              <span className="font-semibold text-foreground">Login :</span>

                              <span className="ml-2 text-muted-foreground">{username}</span>
                            </div>

                            <div className="break-all">
                              <span className="font-semibold text-foreground">HTTP_REFERER :</span>

                              <p className="mt-1 text-muted-foreground">{referer}</p>
                            </div>

                            <div className="break-all">
                              <span className="font-semibold text-foreground">HTTP_USER_AGENT :</span>

                              <p className="mt-1 text-muted-foreground">{browser}</p>
                            </div>

                            <div>
                              <span className="font-semibold text-foreground">REMOTE_ADDR :</span>

                              <span className="ml-2 text-muted-foreground">{ip}</span>
                            </div>

                            <div>
                              <span className="font-semibold text-foreground">REQUEST_TIME :</span>

                              <span className="ml-2 text-muted-foreground">{requestTime}</span>
                            </div>
                          </div>
                        )}
                      </div>
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
