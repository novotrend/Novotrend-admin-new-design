"use client";

import { FileText, Headset, User } from "lucide-react";

const isImageAttachment = value => {
  return /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(value || "");
};

export default function TicketChat({ messages }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-8">
      <h3 className="mb-8 text-2xl font-bold">Conversation</h3>

      <div className="space-y-6">
        {messages.length === 0 && (
          <div className="rounded-3xl bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
            No messages yet.
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
          >
            {message.sender !== "admin" && (
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
                <User size={20} />
              </div>
            )}

            <div
              className={`max-w-[min(620px,72%)] px-5 py-4 shadow-sm ${
                message.sender === "admin"
                  ? "rounded-3xl rounded-tr-md bg-primary text-white shadow-primary/10"
                  : "rounded-3xl rounded-tl-md border border-border bg-muted/20"
              }`}
            >
              <p className="text-sm font-semibold">{message.name}</p>

              <p className="mt-2 leading-7">{message.message}</p>

              {message.attachment && (
                <button
                  type="button"
                  onClick={() => window.open(message.attachment, "_blank", "noopener,noreferrer")}
                  className={`mt-4 block overflow-hidden rounded-2xl border text-left transition hover:opacity-90 ${
                    message.sender === "admin" ? "border-white/20 bg-white/10" : "border-border bg-background"
                  }`}
                >
                  {isImageAttachment(message.attachment) ? (
                    <img
                      src={message.attachment}
                      alt="Reply attachment"
                      className="max-h-56 w-full min-w-56 object-cover"
                    />
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-3 text-sm font-medium">
                      <FileText size={16} />
                      View attachment
                    </span>
                  )}
                </button>
              )}

              <p className="mt-3 text-xs opacity-70">{message.time}</p>
            </div>

            {message.sender === "admin" && (
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                <Headset size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
