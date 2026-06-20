"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";
import { useClientPagination } from "@/hooks/useClientPagination";
import { useUserIbDetailsQuery } from "@/services/users/user.query";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Name", key: "name" },
  { label: "Reg Code", key: "regCode" },
  { label: "Mobile", key: "mobile" },
  { label: "Country", key: "country" },
  { label: "Reg Date", key: "regDate" },
  { label: "Ref Name", key: "refName" },
  { label: "Total IB Commission", key: "totalIbCommission" },
  { label: "Total Lots", key: "totalLots" },
  { label: "Remaining Commission", key: "remainingCommission" },
  { label: "IB Status", key: "ibStatus" },
  { label: "Action", key: "action" },
];

const fallbackValue = "Unavailable";

const getValue = (source, keys, fallback = fallbackValue) => {
  const key = keys.find(
    item => source?.[item] !== undefined && source?.[item] !== null && source?.[item] !== ""
  );

  return key ? source[key] : fallback;
};

export default function IBDetails({ userDetails }) {
  const [search, setSearch] = useState("");
  const { data } = useUserIbDetailsQuery({
    user_id: userDetails?.user?.user_id,
  });
  const ibDetails = Array.isArray(data?.response) ? data.response : [];
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(ibDetails, 10, search);

  const handleDownline = row => {
        // later: navigate or modal open
  };

  return (
    <TableWrapper
      title="IB Details"
      description="Manage IB users and their commission data"
      actions={
        <>
          <TableSearch value={search} onChange={value => { setSearch(value); setOffset(0); }} />
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
        {ibDetails.length === 0 && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              No data found.
            </TableCell>
          </TableRow>
        )}

        {paginatedItems.map((row, index) => (
          <TableRow key={`${getValue(row, ["user_id"], index)}-${index}`} className="border-b border-border hover:bg-muted/40">
            {/* # */}
            <TableCell>{offset + index + 1}</TableCell>

            {/* NAME */}
            <TableCell className="font-medium">{getValue(row, ["name", "user_name"])}</TableCell>

            {/* REG CODE */}
            <TableCell>{getValue(row, ["reg_code", "user_reg_code", "email"])}</TableCell>

            {/* MOBILE */}
            <TableCell>{getValue(row, ["mobile", "user_mobile"])}</TableCell>

            {/* COUNTRY */}
            <TableCell>{getValue(row, ["country"])}</TableCell>

            {/* REG DATE */}
            <TableCell className="whitespace-nowrap">{getValue(row, ["reg_date", "date"])}</TableCell>

            {/* REF NAME */}
            <TableCell className="font-medium text-primary">{getValue(row, ["ref_name", "ib_name", "ibName"])}</TableCell>

            {/* TOTAL IB COMMISSION */}
            <TableCell className="font-semibold text-green-600">
              {getValue(row, ["total_ib_commission", "total_commission", "totalCommission"])}
            </TableCell>

            {/* TOTAL LOTS */}
            <TableCell>{getValue(row, ["total_lots", "total_volume", "totalVolume"])}</TableCell>

            {/* REMAINING COMMISSION */}
            <TableCell>{getValue(row, ["remaining_commission", "remain"])}</TableCell>

            {/* IB STATUS */}
            <TableCell>{getValue(row, ["is_ib_complete"])}</TableCell>

            {/* ACTION */}
            <TableCell>
              <button
                onClick={() => handleDownline(row)}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-primary/10
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-primary
                  transition-all
                  hover:bg-primary/15
                  hover:scale-[1.02]
                "
              >
                Downline
                <ArrowRight className="h-4 w-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </TableWrapper>
  );
}
