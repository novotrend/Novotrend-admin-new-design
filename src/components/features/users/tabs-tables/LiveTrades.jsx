"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import { TableCell, TableRow } from "@/components/ui/table";
import { useUserLiveTradeQuery } from "@/services/users/user.query";
import { useMemo, useState } from "react";

const tableHeaders = [
  { label: "S.No", key: "id" },
  { label: "Symbol", key: "symbol" },
  { label: "Type", key: "type" },
  { label: "Opening Time", key: "openingTime" },
  { label: "Closing Time", key: "closingTime" },
  { label: "Opening Price", key: "openingPrice" },
  { label: "Closing Price", key: "closingPrice" },
  { label: "Volume", key: "volume" },
  { label: "Profit", key: "profit" },
  { label: "Order ID", key: "orderId" },
  { label: "MT5 ID", key: "mt5Id" },
  { label: "Commission", key: "commission" },
  { label: "Swapcharge", key: "swapcharge" },
];

const fallbackValue = "Unavailable";

const getValue = (source, keys, fallback = fallbackValue) => {
  const key = keys.find(
    item => source?.[item] !== undefined && source?.[item] !== null && source?.[item] !== ""
  );

  return key ? source[key] : fallback;
};

const getTradeType = row => getValue(row, ["OpenAction", "CloseAction", "type", "action"]);

const formatDate = value => {
  if (!value || value === fallbackValue) return fallbackValue;

  const date = new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
};

export default function LiveTrades({ userDetails }) {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const { data } = useUserLiveTradeQuery({
    user_id: userDetails?.user?.user_id,
    limit,
    offset,
  });
  const trades = useMemo(() => data?.response?.trades ?? [], [data?.response?.trades]);
  const filteredTrades = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return trades;

    return trades.filter(row =>
      Object.values(row || {})
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [trades, search]);
  const total = search ? filteredTrades.length : Number(data?.response?.count) || trades.length;

  return (
    <TableWrapper
      title="Live Trades"
      description="Monitor all active and closed trading positions"
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
        {trades.length === 0 && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              No data found.
            </TableCell>
          </TableRow>
        )}

        {filteredTrades.map((row, index) => (
          <TableRow key={`${getValue(row, ["order", "orderId", "order_id"], index)}-${index}`} className="border-b border-border hover:bg-muted/40">
            {/* # */}
            <TableCell>{offset + index + 1}</TableCell>

            {/* SYMBOL */}
            <TableCell className="font-semibold">{getValue(row, ["symbol"])}</TableCell>

            {/* TYPE */}
            <TableCell>
              <span
                className={`rounded-xl px-3 py-1 text-xs font-semibold
                  ${
                    getTradeType(row) === "BUY"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-500"
                  }
                `}
              >
                {getTradeType(row)}
              </span>
            </TableCell>

            {/* OPEN TIME */}
            <TableCell className="whitespace-nowrap">{formatDate(getValue(row, ["open_date", "openingTime", "opening_time"]))}</TableCell>

            {/* CLOSE TIME */}
            <TableCell className="whitespace-nowrap">{formatDate(getValue(row, ["close_date", "closingTime", "closing_time"]))}</TableCell>

            {/* OPEN PRICE */}
            <TableCell>{getValue(row, ["open_price", "openingPrice", "opening_price"])}</TableCell>

            {/* CLOSE PRICE */}
            <TableCell>{getValue(row, ["close_price", "closingPrice", "closing_price"])}</TableCell>

            {/* VOLUME */}
            <TableCell>{getValue(row, ["volume"])}</TableCell>

            {/* PROFIT */}
            <TableCell className="font-semibold text-primary">{getValue(row, ["profit"])}</TableCell>

            {/* ORDER ID */}
            <TableCell className="text-muted-foreground">{getValue(row, ["order", "orderId", "order_id"])}</TableCell>

            {/* MT5 ID */}
            <TableCell>{getValue(row, ["mt5acc", "mt5Id", "mt5_id"])}</TableCell>

            {/* COMMISSION */}
            <TableCell>{getValue(row, ["commission"])}</TableCell>

            {/* SWAPCHARGE */}
            <TableCell>{getValue(row, ["swap", "swapcharge"])}</TableCell>
          </TableRow>
        ))}
      </DataTable>
    </TableWrapper>
  );
}
