import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

import { ArrowUpRight } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, href = "#" }) {
  return (
    <Card className="group overflow-hidden rounded-[28px] border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
      <CardContent className="p-5">
        {/* Top */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-[18px] w-[18px]" />
          </div>

          {/* Arrow */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-7">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h3 className="mt-2 text-[30px] font-bold leading-none tracking-tight text-foreground">
            {value}
          </h3>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between">
          <Link
            href={href}
            className="text-sm font-semibold text-primary transition-all hover:opacity-80"
          >
            View Details
          </Link>

          <div className="h-2 w-2 rounded-full bg-primary/70" />
        </div>
      </CardContent>
    </Card>
  );
}
