"use client";

import { useState } from "react";

import StatsCard from "@/components/shared/cards/stats-card";
import { dashboardCards } from "@/confiq/DashboardCards";
import { useDashboardQuery } from "@/services/dashboard/dashboard.query";

const tabs = ["overview", "deposits", "withdrawals", "ib", "registrations", "mt5"];

const formatCardValue = (value, type) => {
  if (value === undefined || value === null || value === "") return "--";

  if (type === "currency") {
    return `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return Number(value || 0).toLocaleString("en-US");
};

export default function DashboardCards() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data } = useDashboardQuery();
  const dashboardData = data?.response ?? {};

  const filteredCards =
    activeTab === "overview"
      ? dashboardCards.filter(card => card.category === "overview")
      : dashboardCards.filter(card => card.category === activeTab);

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Left */}
        {/* <div>
          <h1 className="text-[30px] font-bold tracking-tight text-foreground">
            Welcome back, Shubham 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor platform performance, transactions and activity.
          </p>
        </div> */}

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                rounded-2xl
                px-5
                py-2.5
                text-sm
                font-semibold
                capitalize
                transition-all
                duration-300
                ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        {filteredCards.map(card => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={
              card.valueKey
                ? formatCardValue(dashboardData[card.valueKey], card.valueType)
                : card.value
            }
            icon={card.icon}
            href={card.href}
          />
        ))}
      </div>
    </section>
  );
}
