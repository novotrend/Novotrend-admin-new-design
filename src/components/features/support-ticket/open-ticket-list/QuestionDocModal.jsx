"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QuestionDocModal({ open, onOpenChange, selectedTicket }) {
  if (!selectedTicket) return null;

  const attachment =
    selectedTicket?.file ||
    selectedTicket?.file_url ||
    selectedTicket?.attachment ||
    selectedTicket?.image ||
    selectedTicket?.document;
  const isPdf = attachment?.toString().toLowerCase().includes(".pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl border border-border bg-background p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-8 py-7">
          <DialogTitle className="text-3xl font-bold text-foreground">Ticket Preview</DialogTitle>

          <DialogDescription className="pt-2 text-base text-muted-foreground">
            Review question and uploaded document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 px-8 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold">Ticket Name</p>

              <div className="rounded-2xl border border-border bg-muted/20 px-5 py-4">
                {selectedTicket.ticket}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Status</p>

              <span className="inline-flex rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600">
                {selectedTicket.status}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Question</p>

            <div className="rounded-2xl border border-border bg-muted/20 p-5 leading-7 text-muted-foreground">
              {selectedTicket.question}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold">Uploaded Attachment</p>

            {attachment ? (
              <div className="overflow-hidden rounded-3xl border border-border">
                {isPdf ? (
                  <div className="flex h-[320px] flex-col items-center justify-center gap-4 bg-muted/20 px-5 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      PDF attachment available
                    </p>

                    <button
                      onClick={() => window.open(attachment, "_blank", "noopener,noreferrer")}
                      className="rounded-2xl bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/15"
                    >
                      View PDF
                    </button>
                  </div>
                ) : (
                  <img src={attachment} alt="Attachment" className="h-[320px] w-full object-cover" />
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-muted/20 px-5 py-10 text-center text-sm text-muted-foreground">
                No attachment found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
