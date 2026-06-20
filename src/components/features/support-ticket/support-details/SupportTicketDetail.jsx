"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import TicketAttachment from "./support-features/TicketAttachment";
import TicketChat from "./support-features/TicketChat";
import TicketOverview from "./support-features/TicketOverview";
import TicketReply from "./support-features/TicketReply";
import { normalizeAttachmentUrl } from "../utils";

import { decryptData } from "@/lib/utils";
import { useReplySupportTicketMutation } from "@/services/supportticket/supportticket.mutation";
import { useSupportTicketDetailsQuery } from "@/services/supportticket/supportticket.query";

const getField = (item, keys, fallback = "--") => {
  const value = keys.map(key => item?.[key]).find(field => field !== undefined && field !== null);

  return value === "" ? fallback : value || fallback;
};

const sanitizeEncryptedString = value => {
  return String(value)
    .trim()
    .replace(/^```[^\n]*\n?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
};

const getReadableText = (value, fallback = "--") => {
  if (!value) return fallback;
  if (typeof value !== "string") return value?.result || value?.message || fallback;

  try {
    const decrypted = decryptData(sanitizeEncryptedString(value));

    return (
      decrypted?.data?.result ||
      decrypted?.data?.message ||
      decrypted?.result ||
      decrypted?.message ||
      decrypted
    );
  } catch {
    return value.trim().startsWith("```") ? fallback : value;
  }
};

const getTicketDetail = data => {
  const response = data?.response;

  if (!response) return {};
  if (response?.ticket_details) return response.ticket_details;
  if (response?.ticket_detail) return response.ticket_detail;
  if (response?.ticket) return response.ticket;
  if (response?.details) return response.details;
  if (Array.isArray(response?.ticket_list)) return response.ticket_list[0] || {};

  return response;
};

const getMessages = data => {
  const response = data?.response;
  const messages =
    response?.messages ||
    response?.chat_list ||
    response?.reply_list ||
    response?.replies ||
    response?.conversation ||
    response?.chat ||
    [];

  if (!Array.isArray(messages)) return [];

  return messages.map((message, index) => ({
    id: getField(message, ["message_id", "id", "reply_id"], index + 1),
    sender: getField(message, ["sender_type", "sender", "type", "reply_by"], "user")
      .toString()
      .toLowerCase()
      .match(/admin|staff/)
      ? "admin"
      : "user",
    name: getField(message, ["sender_name", "name", "username", "reply_by", "user_name"], "User"),
    message: getReadableText(getField(message, ["message", "remark", "reply", "details"], "")),
    attachment: normalizeAttachmentUrl(
      getField(message, ["file_url", "file", "attachment", "image", "document"], "")
    ),
    time: getField(message, ["time", "date", "created_at"], "--"),
  }));
};

const normalizeTicket = (ticket, ticketId, status) => {
  const normalizedStatus = getField(ticket, ["status", "ticket_status"], status || "Open");

  return {
    id: getField(ticket, ["ticket_id", "id", "support_id"], ticketId),
    title: getField(ticket, ["ticket_name", "ticket", "subject", "title", "category"]),
    user: getField(ticket, ["user_name", "name", "username", "client_name"], "User"),
    email: getField(ticket, ["email", "user_email", "user_id", "userid"]),
    date: getField(ticket, ["date", "created_at", "ticket_date", "req_date"]),
    status: normalizedStatus,
    question: getField(ticket, ["question", "message", "description", "details"], "--"),
    attachment: normalizeAttachmentUrl(
      getField(ticket, ["file_url", "file", "attachment", "image", "document"], "")
    ),
  };
};

const getSuccessMessage = (response, fallback) => {
  let successMessage = response?.result;

  if (!successMessage) return fallback;

  if (typeof successMessage !== "string") {
    return successMessage?.result || successMessage?.message || fallback;
  }

  try {
    const decryptedResult = decryptData(sanitizeEncryptedString(successMessage));

    successMessage =
      decryptedResult?.data?.result ||
      decryptedResult?.data?.message ||
      decryptedResult?.result ||
      decryptedResult?.message ||
      decryptedResult;
  } catch (err) {
      }

  return typeof successMessage === "string" && !successMessage.includes("::")
    ? successMessage
    : fallback;
};

export default function SupportTicketDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const ticketId = searchParams.get("ticket_id") || "";
  const status = searchParams.get("status") || "open";

  const { data, isLoading, error } = useSupportTicketDetailsQuery({
    ticket_id: ticketId,
  });
  const { mutate: replyTicket, isPending: replying } = useReplySupportTicketMutation();

  const ticket = normalizeTicket(getTicketDetail(data), ticketId, status);
  const messages = getMessages(data);
  const isClosed = ticket.status.toString().toLowerCase().includes("closed") || status === "closed";

  const handleReply = ({ remark, closeTicket, attachment }) => {
    replyTicket(
      {
        ticket_id: ticketId,
        remark,
        close_ticket: closeTicket ? "1" : "0",
        attachment,
      },
      {
        onSuccess: response => {
          toast.success(getSuccessMessage(response, "Reply sent successfully"));
          queryClient.invalidateQueries({ queryKey: ["support-ticket-details", ticketId] });
          queryClient.invalidateQueries({ queryKey: ["open-support-ticket-list"] });
          queryClient.invalidateQueries({ queryKey: ["close-support-ticket-list"] });

          if (closeTicket) {
            queryClient.refetchQueries({ queryKey: ["open-support-ticket-list"] });
            router.push("/support-ticket/open-support-ticket");
          }
        },
        onError: mutationError => {
          toast.error(mutationError?.message || "Unable to send reply");
        },
      }
    );
  };

  if (!ticketId) {
    return (
      <div className="rounded-3xl border border-border bg-background p-8 text-sm text-muted-foreground">
        Ticket id missing.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-background p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-5">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </button>

            <div>
              <h1 className="text-3xl font-bold text-foreground">Support Ticket Detail</h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Manage conversation and ticket activity
              </p>
            </div>
          </div>

          <div className="space-y-3 text-right">
            <span className="inline-flex rounded-2xl bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
              #{ticket.id}
            </span>

            <div>
              <span className="inline-flex rounded-2xl bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-600">
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-border bg-background p-8 text-sm text-muted-foreground">
          Loading support ticket details...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-border bg-background p-8 text-sm text-red-500">
          {error?.message || "Failed to load support ticket details."}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid gap-8 xl:grid-cols-[1.5fr_.7fr]">
            <TicketOverview ticket={ticket} />

            <TicketAttachment attachment={ticket.attachment} />
          </div>

          <TicketChat messages={messages} />

          {!isClosed && <TicketReply onSubmit={handleReply} isPending={replying} />}
        </>
      )}
    </div>
  );
}
