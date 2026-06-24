"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useBounsListQuery } from "@/services/bouns/bouns.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Email", key: "email", sortable: true },
  { label: "Name", key: "name", sortable: true },
  { label: "Mobile Number", key: "mobile", sortable: true },
  { label: "Country", key: "country", sortable: true },
  { label: "Transaction Date", key: "date", sortable: true },
  { label: "Type", key: "type", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
];

export default function BonusList() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError } = useBounsListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const bonusList = data?.response.bonus_list || [];
    // pagination calculations
  const total = Number(data?.response?.total_records) || bonusList.length;
  const currentPage = Math.floor(offset / limit) + 1;
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="overflow-x-auto">
        <TableWrapper
          title="Bonus List"
          description="View all user bonus transactions and rewards"
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
            {bonusList?.map(item => (
              <TableRow
                key={item.id}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                  {String(item.id).padStart(2, "0")}
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-foreground whitespace-nowrap">
                  {item.email}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
                  {item.mobile}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    {item.country}
                  </span>
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item.transaction_date}
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item.type}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-xl px-4 py-2 text-sm font-semibold ${
                      item.type?.toLowerCase() === "credit"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {item.type?.toLowerCase() === "credit"} {item.amount}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </DataTable>
        </TableWrapper>
      </div>
    </div>
  );
}
