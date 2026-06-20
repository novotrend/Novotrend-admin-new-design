"use client";

import { cn } from "@/lib/utils";

export default function ThemeLoader({ label = "Loading...", className = "" }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-primary", className)}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
}
