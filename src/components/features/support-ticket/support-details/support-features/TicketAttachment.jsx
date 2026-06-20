"use client";

import { FileText } from "lucide-react";

export default function TicketAttachment({ attachment }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-8">
      <h3 className="mb-8 text-2xl font-bold">Attachment</h3>

      {attachment ? (
        <div className="overflow-hidden rounded-3xl">
          <img src={attachment} alt="Ticket attachment" className="h-[260px] w-full object-cover" />
        </div>
      ) : (
        <div className="rounded-3xl bg-muted/20 px-5 py-12 text-center text-sm text-muted-foreground">
          No attachment found
        </div>
      )}

      <button
        disabled={!attachment}
        onClick={() => attachment && window.open(attachment, "_blank", "noopener,noreferrer")}
        className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary/10 py-4 text-sm font-semibold text-primary transition-all hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileText size={18} />
        View Full
      </button>
    </div>
  );
}
