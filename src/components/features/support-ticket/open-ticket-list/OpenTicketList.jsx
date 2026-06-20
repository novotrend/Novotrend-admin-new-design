"use client";

import { ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useOpenSupportTicketListQuery } from "@/services/supportticket/supportticket.query";
import { normalizeAttachmentUrl } from "../utils";
import QuestionDocModal from "./QuestionDocModal";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Date", key: "date", sortable: true },
  { label: "User Name", key: "name", sortable: true },
  { label: "User ID", key: "email", sortable: true },
  { label: "Ticket Name", key: "ticket", sortable: true },
  { label: "Preview", key: "preview", sortable: false },
  { label: "Action", key: "action", sortable: false },
];

const getRecords = data => {
  const response = data?.response;

  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.running_tickets)) return response.running_tickets;
  if (Array.isArray(response?.open_tickets)) return response.open_tickets;
  if (Array.isArray(response?.support_tickets)) return response.support_tickets;
  if (Array.isArray(response?.ticket_list)) return response.ticket_list;
  if (Array.isArray(response?.tickets)) return response.tickets;
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

const normalizeTicket = item => {
  const ticket = getField(item, ["ticket", "ticket_name", "subject", "title", "category"]);
  const file = getField(
    item,
    ["file_url", "file", "attachment", "image", "document", "support_file", "ticket_file"],
    ""
  );

  return {
    ...item,
    id: getField(item, ["id", "ticket_id", "support_id", "req_id"]),
    date: getField(item, ["date", "created_at", "ticket_date", "req_date"]),
    name: getField(item, ["name", "user_name", "username", "client_name"], "User"),
    email: getField(item, ["email", "user_id", "userid", "user_email"]),
    ticket,
    status: getField(item, ["status", "ticket_status"], "Open"),
    question: getField(item, ["question", "message", "description", "details"], "--"),
    file: normalizeAttachmentUrl(file),
  };
};

export default function OpenTicketList() {
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useOpenSupportTicketListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const tickets = getRecords(data).map(normalizeTicket);
  const total = getTotalRecords(data, tickets);

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-border bg-background">
        <div className="overflow-x-auto">
          <TableWrapper
            title="Open Support Ticket"
            description="Review and manage all support requests"
            actions={
              <>
                <TableSearch
                  value={search}
                  onChange={value => {
                    setSearch(value);
                    setOffset(0);
                  }}
                  placeholder="Search support tickets"
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
                    Loading open support tickets...
                  </TableCell>
                </TableRow>
              )}

              {error && (
                <TableRow>
                  <TableCell
                    colSpan={tableHeaders.length}
                    className="px-6 py-8 text-center text-sm text-red-500"
                  >
                    {error?.message || "Failed to load open support tickets."}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !error && tickets.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={tableHeaders.length}
                    className="px-6 py-8 text-center text-sm text-muted-foreground"
                  >
                    No open support tickets found.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !error &&
                tickets.map((item, index) => (
                  <TableRow
                    key={`${item.id}-${index}`}
                    className="border-b border-border transition-all hover:bg-muted/40"
                  >
                    <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                      {String(offset + index + 1).padStart(2, "0")}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                      {item.date}
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                          {item.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>

                          <p className="text-xs text-muted-foreground">Support User</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-sm text-foreground">{item.email}</TableCell>

                    <TableCell className="px-6 py-5">
                      <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                        {item.ticket}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <button
                        onClick={() => {
                          setSelectedTicket(item);
                          setOpen(true);
                        }}
                        className="inline-flex h-11 items-center gap-2 rounded-2xl bg-primary/10 px-5 text-sm font-semibold text-primary transition-all hover:bg-primary/15"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <Link href={`/support-ticket/support-details?ticket_id=${item.id}&status=open`}>
                        <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-500/10 px-5 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-500/15">
                          Details
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </DataTable>
          </TableWrapper>
        </div>
      </div>

      <QuestionDocModal
        open={open}
        onOpenChange={setOpen}
        selectedTicket={selectedTicket}
      />
    </>
  );
}
