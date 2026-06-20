"use client";

import { Search } from "lucide-react";

export default function TableSearch({ value = "", onChange, placeholder = "Search....." }) {
  return (
    <div className="relative w-full sm:w-[280px]">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}
