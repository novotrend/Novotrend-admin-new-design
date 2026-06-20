"use client";

import { useState } from "react";
import { USER_TABS } from "./tab-config";

export default function UserTabs({ userDetails, bankDetails }) {
  const [activeTab, setActiveTab] = useState("trading");

  const ActiveComponent = USER_TABS.find(tab => tab.value === activeTab)?.component;

  return (
    <div className="space-y-5">
      {/* TAB NAVIGATION */}
      <div className="overflow-x-auto rounded-3xl border border-border bg-background px-2 py-2">
        <div className="inline-flex min-w-max gap-2">
          {USER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`min-w-[136px] whitespace-nowrap rounded-full px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        {ActiveComponent ? (
          <ActiveComponent userDetails={userDetails} bankDetails={bankDetails} />
        ) : null}
      </div>
    </div>
  );
}
