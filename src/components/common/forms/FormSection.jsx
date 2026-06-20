"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function FormSection({ title, description, children }) {
  return (
    <Card className="overflow-hidden rounded-[28px] border border-border/80 bg-card shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <div className="border-b border-border/70 px-8 py-7">
        <h2 className="text-[22px] font-semibold tracking-tight text-foreground">{title}</h2>

        <p className="mt-1.5 text-sm font-medium text-muted-foreground">{description}</p>
      </div>

      <CardContent className="p-8">{children}</CardContent>
    </Card>
  );
}
