"use client";

import { useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { useDashboardQuery } from "@/services/dashboard/dashboard.query";

const fallbackChartData = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 18500 },
  { month: "Mar", amount: 14200 },
  { month: "Apr", amount: 24800 },
  { month: "May", amount: 19200 },
  { month: "Jun", amount: 28400 },
  { month: "Jul", amount: 33200 },
  { month: "Aug", amount: 29800 },
  { month: "Sep", amount: 41200 },
  { month: "Oct", amount: 36800 },
  { month: "Nov", amount: 47200 },
  { month: "Dec", amount: 52800 },
];

const filters = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
];

export default function AnalyticsChart() {
  const [activeFilter, setActiveFilter] = useState("3M");
  const { data } = useDashboardQuery();
  const monthWiseDeposit = data?.response?.month_wise_deposit;
  const allChartData = Array.isArray(monthWiseDeposit) && monthWiseDeposit.length
    ? monthWiseDeposit.map(item => ({
        month: item.month_name?.slice(0, 3) || item.month_no,
        amount: Number(item.amount || 0),
      }))
    : fallbackChartData;
  const activeMonths = filters.find(filter => filter.label === activeFilter)?.months || 3;
  const chartData = allChartData.slice(-activeMonths);
  const totalRevenue = Number(data?.response?.total_deposit || 0);

  return (
    <Card className="overflow-hidden rounded-[32px] border border-border bg-card">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Revenue Analytics</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Monthly deposits and withdrawal analytics overview.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 p-1.5">
            {filters.map(filter => {
              const isActive = activeFilter === filter.label;

              return (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  className={`rounded-xl px-4 py-2 text-sm transition-all ${
                    isActive
                      ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                      : "font-medium text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 flex flex-wrap items-center gap-10">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight">
              ${totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Monthly Growth</p>

            <h3 className="mt-2 text-xl font-semibold text-primary">+18.24%</h3>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -20,
                bottom: 0,
              }}
            >
              {/* Gradient */}
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6456ff" stopOpacity={0.35} />

                  <stop offset="95%" stopColor="#6456ff" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(120,120,120,0.12)"
              />

              {/* X Axis */}
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 13,
                  fill: "#8b8d98",
                }}
              />

              {/* Y Axis */}
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 13,
                  fill: "#8b8d98",
                }}
                tickFormatter={value => `$${Number(value) / 1000}k`}
              />

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  background: "#11131a",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "18px",
                  padding: "12px 14px",
                  color: "#fff",
                }}
                formatter={value => [
                  `$${Number(value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Revenue",
                ]}
              />

              {/* Area */}
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6456ff"
                strokeWidth={3}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
