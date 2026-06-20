"use client";

import { CalendarDays, Mail, MessageSquare, User } from "lucide-react";

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl bg-muted/20 p-5">
      <div className="mb-3 flex items-center gap-3 text-primary">
        {icon}

        <span className="text-sm font-medium">{label}</span>
      </div>

      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function TicketOverview({ ticket }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-8">
      <h3 className="mb-8 text-2xl font-bold">Ticket Information</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard icon={<MessageSquare size={18} />} label="Ticket Name" value={ticket.title} />

        <InfoCard icon={<CalendarDays size={18} />} label="Created" value={ticket.date} />

        <InfoCard icon={<Mail size={18} />} label="Email" value={ticket.email} />

        <InfoCard icon={<User size={18} />} label="User" value={ticket.user} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold">Question</p>

        <div className="rounded-3xl bg-muted/20 p-6 leading-7 text-muted-foreground">
          {ticket.question}
        </div>
      </div>
    </div>
  );
}
