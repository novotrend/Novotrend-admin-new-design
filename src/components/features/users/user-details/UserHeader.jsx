"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserHeader() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Link href="/users/list-user">
          <Button
            variant="outline"
            size="icon"
            className="border-border text-foreground hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-lg font-semibold">User Details</h1>
          <p className="text-sm text-muted-foreground">Review and manage the user profile</p>
        </div>
      </div>

      {/* RIGHT (Breadcrumb placeholder) */}
      <div className="text-sm text-muted-foreground">Dashboard / User List / Details</div>
    </div>
  );
}
