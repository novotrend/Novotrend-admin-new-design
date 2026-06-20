"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";

import { TableCell, TableRow } from "@/components/ui/table";
import { useDiscountListQuery } from "@/services/bouns/bouns.query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const tableHeaders = [
  { label: "S.No", key: "id", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Account ID", key: "accountId", sortable: true },
  { label: "Date", key: "date", sortable: true },
  { label: "Amount", key: "amount", sortable: true },
  { label: "Discount Amount", key: "discountAmount", sortable: true },
];

export default function DiscountList() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError } = useDiscountListQuery({
    limit,
    offset,
    search: debouncedSearch,
  });

  const discountList = data?.response?.discount_list || [];
    // pagination calculations
  const total = Number(data?.response?.total_records) || discountList.length;
  const currentPage = Math.floor(offset / limit) + 1;
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="overflow-x-auto">
        <TableWrapper
          title="Discount List"
          description="Manage and review all account discount transactions"
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
            {discountList.map(item => (
              <TableRow
                key={item.id}
                className="border-b border-border transition-all hover:bg-muted/40"
              >
                <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground">
                  {String(item.id).padStart(2, "0")}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
                  {item.email}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    {item.account_id}
                  </span>
                </TableCell>

                <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-muted-foreground">
                  {item.date}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="inline-flex rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600">
                    {item.amount}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <span className="inline-flex rounded-xl bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600">
                    {item.discount_amount}
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
