"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function TableWrapper({ title, description, actions, children, footer }) {
  return (
    <Card
      data-table-export-root
      data-table-title={title}
      className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>
      </div>
      <CardContent className="p-0">{children}</CardContent>
      {footer}
    </Card>
  );
}
