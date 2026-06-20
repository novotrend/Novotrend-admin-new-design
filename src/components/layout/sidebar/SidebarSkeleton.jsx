"use client";

import Image from "next/image";
import Link from "next/link";

const skeletonRows = [
  "w-40",
  "w-32",
  "w-44",
  "w-36",
  "w-48",
  "w-32",
  "w-40",
  "w-44",
  "w-36",
  "w-48",
  "w-40",
  "w-32",
];

export default function SidebarSkeleton() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] flex-col border-r border-border/40 bg-gradient-to-b from-background via-background to-background/95 md:flex">
      <div className="flex h-[72px] items-center justify-center border-b border-border/40 px-4">
        <Link
          href="/dashboard"
          className="relative flex h-15 w-full items-center overflow-hidden rounded-2xl bg-card/80 px-4"
        >
          <Image
            src="/darkmode.webp"
            alt="Company Logo"
            width={140}
            height={32}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <div className="flex-1 space-y-7 overflow-hidden px-3 py-6">
        {skeletonRows.map((width, index) => (
          <div key={`${width}-${index}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="h-5 w-5 shrink-0 animate-pulse rounded-md bg-muted" />
            <div className={`h-4 ${width} animate-pulse rounded-full bg-muted`} />
          </div>
        ))}
      </div>

      <div className="border-t border-border/40 p-4">
        <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </aside>
  );
}
