"use client";

import { useState } from "react";

import TableFooter from "@/components/common/tables/TableFooter";
import { Card, CardContent } from "@/components/ui/card";
import { useAssignDashboardTicketMutation } from "@/services/dashboard/dashboard.mutation";
import { useDashboardQuery } from "@/services/dashboard/dashboard.query";
import { useQueryClient } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SupportTicketTable() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const queryClient = useQueryClient();
  const { data, isFetching } = useDashboardQuery({ limit, offset });
  const { mutate: assignTicket, isPending: isAssigning } = useAssignDashboardTicketMutation();
  const supportTickets = data?.response?.support_ticket;
  const totalRecords = Number(data?.response?.total_records) || 0;
  const staffList = Array.isArray(data?.response?.staff_list) ? data.response.staff_list : [];
  const dashboardTickets = Array.isArray(supportTickets)
    ? supportTickets.map((ticket, index) => ({
        id: ticket.support_id || ticket.id || ticket.ticket_id || index + 1,
        name: ticket.name || ticket.user_name || ticket.username || "User",
        email: ticket.email || ticket.user_id || "--",
        mobile: ticket.mobile || ticket.phone || "--",
        date: ticket.date || ticket.created_at || "--",
        supportId: ticket.support_id || ticket.ticket_id || ticket.id || "--",
        subject: ticket.subject || ticket.ticket || ticket.ticket_name || "--",
        assignedTo: ticket.assigned_to || ticket.assignedTo || "0",
        currentAssignedTo: ticket.assigned_to || ticket.assignedTo || "0",
      }))
    : [];
  const [assignedById, setAssignedById] = useState({});
  const [savedAssignedById, setSavedAssignedById] = useState({});
  const tickets = dashboardTickets.map(ticket => ({
    ...ticket,
    currentAssignedTo: savedAssignedById[ticket.id] ?? ticket.currentAssignedTo,
    assignedTo: assignedById[ticket.id] ?? ticket.assignedTo,
  }));

  const handleAssign = (ticketId, value) => {
    setAssignedById(prev => ({
      ...prev,
      [ticketId]: value,
    }));
  };

  const handleAssignSubmit = ticket => {
    assignTicket(
      {
        sid: ticket.supportId,
        user: ticket.assignedTo,
      },
      {
        onSuccess: () => {
          setSavedAssignedById(prev => ({
            ...prev,
            [ticket.id]: ticket.assignedTo,
          }));
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
      }
    );
  };

  const assigned = tickets.filter(ticket => ticket.assignedTo !== "0").length;

  const unassigned = tickets.length - assigned;
  return (
    <Card className="overflow-hidden rounded-[28px] border border-border bg-card">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-foreground">
              Support Tickets
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and assign support requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-border bg-muted/40 px-4 py-2">
              <p className="text-xs text-muted-foreground">Active Tickets</p>

              <h4 className="mt-1 text-sm font-semibold">{totalRecords || tickets.length}</h4>
            </div>

            <div className="rounded-2xl border border-border bg-primary/5 px-4 py-2">
              <p className="text-xs text-muted-foreground">Pending</p>

              <h4 className="mt-1 text-sm font-semibold text-primary">{unassigned}</h4>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto overflow-y-visible">
          {isFetching && (
            <div className="absolute right-5 top-4 z-10 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              Loading...
            </div>
          )}
          <Table className="min-w-[1150px]">
            <TableHeader>
              <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                {[
                  "SR NO",
                  "Name",
                  "Email",
                  "Mobile",
                  "Date",
                  "Support ID",
                  "Subject",
                  "Assigned To",
                  "Action",
                ].map(heading => (
                  <TableHead
                    key={heading}
                    className="h-12 px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    No support tickets found.
                  </TableCell>
                </TableRow>
              ) : tickets.map((ticket, index) => {
                const isAssigned = ticket.assignedTo !== "0";
                const isAssignDisabled =
                  ticket.assignedTo === "0" ||
                  ticket.assignedTo === ticket.currentAssignedTo ||
                  isAssigning;

                return (
                  <TableRow
                    key={ticket.id}
                    className="border-border transition-all hover:bg-primary/[0.03]"
                  >
                    {/* SR NO */}
                    <TableCell className="px-5 py-4 text-sm font-medium text-muted-foreground">
                      {String(offset + index + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{ticket.name}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-5 py-4 text-sm text-muted-foreground">
                      {ticket.email}
                    </TableCell>

                    {/* Mobile */}
                    <TableCell className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {ticket.mobile}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {ticket.date}
                    </TableCell>

                    {/* Support ID */}
                    <TableCell className="px-5 py-4">
                      <span className="inline-flex items-center rounded-xl border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                        {ticket.supportId}
                      </span>
                    </TableCell>

                    {/* Subject */}
                    <TableCell className="px-5 py-4">
                      <span className="inline-flex items-center rounded-xl border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                        {ticket.subject}
                      </span>
                    </TableCell>

                    {/* Assigned */}
                    <TableCell className="px-5 py-4">
                      <Select
                        value={ticket.assignedTo}
                        onValueChange={value => handleAssign(ticket.id, value)}
                      >
                        <SelectTrigger className="h-10 w-[170px] rounded-2xl border-border bg-background px-3 text-sm shadow-none transition-all hover:border-primary/30 focus:ring-0">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                isAssigned ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={8}
                          className=" z-[999] min-w-[180px] rounded-2xl border border-border bg-white dark:bg-card backdrop-blur-none shadow-2xl p-2 "
                        >
                          <SelectItem value="0" className="rounded-xl py-2 text-sm">
                            Unassigned
                          </SelectItem>

                          {staffList.map(staff => (
                            <SelectItem
                              key={staff.staff_id}
                              value={staff.staff_id}
                              className="rounded-xl py-2 text-sm"
                            >
                              {staff.staff_username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="px-5 py-4">
                      <button
                        onClick={() => handleAssignSubmit(ticket)}
                        disabled={isAssignDisabled}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isAssigning ? "Assigning..." : "Assign"}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-border bg-muted/20 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <p>
              Total:
              <span className="ml-1 font-semibold text-foreground">
                {totalRecords || tickets.length}
              </span>
            </p>

            <p>
              Assigned:
              <span className="ml-1 font-semibold text-primary">{assigned}</span>
            </p>

            <p>
              Pending:
              <span className="ml-1 font-semibold text-amber-500">{unassigned}</span>
            </p>
          </div>

          <span className="text-sm text-muted-foreground">Current page: {tickets.length}</span>
        </div>

        <TableFooter
          limit={limit}
          setLimit={setLimit}
          offset={offset}
          setOffset={setOffset}
          total={totalRecords || tickets.length}
        />
      </CardContent>
    </Card>
  );
}
