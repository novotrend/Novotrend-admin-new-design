"use client";

import DataTable from "@/components/common/tables/DataTable";
import ExportDropdown from "@/components/common/tables/ExportDropdown";
import TableFooter from "@/components/common/tables/TableFooter";
import TableSearch from "@/components/common/tables/TableSearch";
import TableWrapper from "@/components/common/tables/TableWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useClientPagination } from "@/hooks/useClientPagination";
import { useUserTradingReportQuery } from "@/services/users/user.query";
import { useState } from "react";

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

const getTradeType = row => {
  const action = getValue(row, ["action", "OpenAction", "CloseAction", "type"], "");

  return String(action) === "0" ? "BUY" : "SELL";
};

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

const getTodayInputValue = () => new Date().toISOString().slice(0, 10);

export default function TradeReport({ userDetails }) {
  const [search, setSearch] = useState("");
  const [selectedAccno, setSelectedAccno] = useState("");
  const [sdate, setSdate] = useState("");
  const [edate, setEdate] = useState("");
  const today = getTodayInputValue();
  const accounts = userDetails?.mt5_accounts ?? [];
  const hasRequiredFilters = Boolean(selectedAccno && sdate && edate);
  const { data, error, isFetching, isLoading } = useUserTradingReportQuery({
    user_id: userDetails?.user?.user_id,
    sdate,
    edate,
    accno: selectedAccno,
  });
  const trades = data?.result?.data?.response?.trades ?? data?.response?.trades ?? [];
  const { limit, setLimit, offset, setOffset, total, paginatedItems } =
    useClientPagination(trades, 10, search);
  const isTableLoading = hasRequiredFilters && (isLoading || (isFetching && trades.length === 0));
  const handleStartDateChange = value => {
    if (value > today) return;

    setSdate(value);
    setOffset(0);

    if (value && edate && edate < value) {
      setEdate("");
    }
  };

  const handleEndDateChange = value => {
    if (value > today || (sdate && value < sdate)) return;

    setEdate(value);
    setOffset(0);
  };

  return (
    <TableWrapper
      title="Trade Report"
      description="Complete record of all trading activity"
      actions={
        <>
          <Select
            value={selectedAccno}
            onValueChange={value => {
              setSelectedAccno(value);
              setOffset(0);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-border bg-background px-4 sm:w-[210px]">
              <SelectValue placeholder="MT5 Account" />
            </SelectTrigger>
            <SelectContent className="z-[80] border border-border bg-background shadow-2xl">
              {accounts.map(account => (
                <SelectItem key={account.accno} value={String(account.accno)}>
                  {account.accno}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="date"
            value={sdate}
            max={edate || today}
            onChange={event => handleStartDateChange(event.target.value)}
            className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-[155px]"
          />

          <input
            type="date"
            value={edate}
            min={sdate || undefined}
            max={today}
            onChange={event => handleEndDateChange(event.target.value)}
            className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-[155px]"
          />

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
        {!hasRequiredFilters && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              Select MT5 account, start date, and end date to load trade report.
            </TableCell>
          </TableRow>
        )}

        {isTableLoading && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              Loading trade report...
            </TableCell>
          </TableRow>
        )}

        {hasRequiredFilters && !isTableLoading && error && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-red-500">
              Failed to load trade report.
            </TableCell>
          </TableRow>
        )}

        {hasRequiredFilters && !isTableLoading && !error && paginatedItems.length === 0 && (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} className="py-8 text-center text-sm text-muted-foreground">
              No data found.
            </TableCell>
          </TableRow>
        )}

        {paginatedItems.map((row, index) => (
          <TableRow key={`${getValue(row, ["order", "orderId", "order_id"], index)}-${index}`} className="border-b border-border hover:bg-muted/40">
            {/* # */}
            <TableCell>{offset + index + 1}</TableCell>

            {/* SYMBOL */}
            <TableCell className="font-semibold">{getValue(row, ["symbol"])}</TableCell>

            {/* TYPE */}
            <TableCell>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold
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

            {/* OPENING TIME */}
            <TableCell className="whitespace-nowrap">{formatDate(getValue(row, ["open_date", "openingTime", "opening_time"]))}</TableCell>

            {/* CLOSING TIME */}
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
