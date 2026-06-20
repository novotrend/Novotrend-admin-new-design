"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DataTable({ headers, children }) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = key => {
    if (sortField === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40">
            {headers.map(header => (
              <TableHead
                key={header.key}
                className="h-14 px-6 text-left text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"
              >
                <div
                  onClick={() => header.sortable && handleSort(header.key)}
                  className={`flex items-center gap-2 ${header.sortable ? "cursor-pointer select-none" : ""}`}
                >
                  {header.label}

                  {header.sortable &&
                    (sortField === header.key ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                    ))}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
