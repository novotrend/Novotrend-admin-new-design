"use client";

import FormInput from "@/components/common/forms/FormInput";
import FormSubmit from "@/components/common/forms/FormSubmit";

import { Paperclip, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TicketReply({ onSubmit, isPending }) {
  const [remark, setRemark] = useState("");
  const [closeTicket, setCloseTicket] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = () => {
    if (!remark.trim()) {
      toast.error("Remark is required");
      return;
    }

    onSubmit?.({
      remark: remark.trim(),
      closeTicket,
      attachment,
    });

    setRemark("");
    setCloseTicket(false);
    setAttachment(null);
  };

  return (
    <div className="rounded-3xl border border-border bg-background p-8">
      <h3 className="mb-8 text-2xl font-bold">Reply</h3>

      <div className="space-y-6">
        <FormInput
          label="Remark"
          placeholder="Write reply..."
          value={remark}
          onChange={event => setRemark(event.target.value)}
        />

        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">Attachment</p>

          <label className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-border transition-all hover:bg-muted/30">
            <Paperclip size={18} />
            <span className="text-sm font-medium">
              {attachment ? attachment.name : "Upload Attachment"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={event => setAttachment(event.target.files?.[0] || null)}
            />
          </label>

          {attachment && (
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              <X size={14} />
              Remove attachment
            </button>
          )}
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={closeTicket}
            onChange={event => setCloseTicket(event.target.checked)}
          />

          <span className="text-sm font-medium">Close Ticket</span>
        </label>

        <div className="flex justify-end">
          <FormSubmit title={isPending ? "Sending..." : "Send Reply"} onClick={handleSubmit} disabled={isPending} />
        </div>
      </div>
    </div>
  );
}
