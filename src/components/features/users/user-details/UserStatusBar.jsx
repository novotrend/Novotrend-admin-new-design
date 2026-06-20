"use client";

export default function UserStatusBar() {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Verification Status
        </p>
        <span className="text-sm font-semibold text-green-600">Active</span>
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">IB Status</p>
        <span className="text-sm font-semibold text-green-600">Active</span>
      </div>
    </div>
  );
}
