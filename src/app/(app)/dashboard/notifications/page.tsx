"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, Bell, CheckCheck, ChevronLeft, ChevronRight, Inbox, Mail, Phone, Trash2 } from "lucide-react";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { contactApi, type ContactSubmissionItem } from "@/lib/api/contact";
import { getUnreadCount } from "@/lib/api/notifications";
import { NotificationFilterBar } from "@/components/notifications/NotificationFilterBar";
import { NotificationItemCard } from "@/components/notifications/NotificationItemCard";
import { SocialIcon } from "@/templates/shared/SocialIcon";
import { cn } from "@/lib/utils";

type Tab = "messages" | "notifications";

function when(iso: string): string {
  const date = new Date(iso);
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days < 1) return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (days < 7) return date.toLocaleDateString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function Empty({ icon: Icon, title, text, action }: { icon: typeof Inbox; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-input bg-card px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-3 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function Messages() {
  const [items, setItems] = React.useState<ContactSubmissionItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    contactApi
      .getSubmissions()
      .then(setItems)
      .catch(() => {
        setItems([]);
        setError("We couldn't load your messages. Refresh to try again.");
      });
  }, []);

  const remove = async (id: string) => {
    const before = items;
    setItems((list) => list?.filter((m) => m.id !== id) ?? null);
    try {
      await contactApi.deleteSubmission(id);
    } catch {
      setItems(before);
      setError("Couldn't delete that message.");
    }
  };

  if (items === null) {
    return (
      <div className="space-y-2" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-lg border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
          <AlertCircle className="h-4 w-4" aria-hidden="true" /> {error}
        </p>
      )}
      {items.length === 0 ? (
        <Empty
          icon={Inbox}
          title="No messages yet"
          text="When visitors send you a message from your card, it shows up here. Add a contact form to your card to start receiving them."
          action={
            <Link href="/dashboard/editor?section=blocks" className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#4A32C0]">
              Add a contact form
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {items.map((m) => {
            const isOpen = open === m.id;
            const phoneDigits = (m.phone ?? "").replace(/\D/g, "");
            return (
              <li key={m.id}>
                <button type="button" onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen} className="flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-muted/60">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFECFD] text-sm font-semibold text-[#3D2AAD]">
                    {(m.name || "?").slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-foreground">{m.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{when(m.created_at)}</span>
                    </span>
                    <span className={cn("block text-sm text-[#52525B]", !isOpen && "truncate")}>{m.message}</span>
                  </span>
                </button>
                {isOpen && (
                  <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pl-[68px]">
                    {m.email && (
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:bg-[#4A32C0]">
                        <Mail className="h-4 w-4" aria-hidden="true" /> Reply by email
                      </a>
                    )}
                    {phoneDigits.length >= 7 && (
                      <>
                        <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input px-3 text-[13px] font-semibold hover:bg-muted">
                          <SocialIcon platform="whatsapp" className="h-4 w-4" /> WhatsApp
                        </a>
                        <a href={`tel:${m.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input px-3 text-[13px] font-semibold hover:bg-muted">
                          <Phone className="h-4 w-4" aria-hidden="true" /> Call
                        </a>
                      </>
                    )}
                    <span className="text-[13px] text-muted-foreground">{[m.email, m.phone].filter(Boolean).join(" · ")}</span>
                    <button type="button" onClick={() => void remove(m.id)} className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-[#52525B] hover:bg-[#FDECEC] hover:text-destructive">
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Notifications() {
  const { notifications, pagination, unreadCount, isLoading, error, filterCategory, unreadOnly, setFilterCategory, setUnreadOnly, loadPage, markRead, markAllRead, remove } =
    useNotifications(20);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <NotificationFilterBar filterCategory={filterCategory} unreadOnly={unreadOnly} onSelectCategory={setFilterCategory} onToggleUnreadOnly={() => setUnreadOnly(!unreadOnly)} />
        {unreadCount > 0 && (
          <button type="button" onClick={() => void markAllRead()} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold hover:bg-muted">
            <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark all read
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-lg border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
          <AlertCircle className="h-4 w-4" aria-hidden="true" /> {error}
        </p>
      )}
      {isLoading && notifications.length === 0 ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Empty icon={Bell} title={unreadOnly ? "Nothing unread" : "No notifications"} text="Account and card updates appear here." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItemCard key={n.id} notification={n} onMarkRead={markRead} onRemove={remove} />
          ))}
        </div>
      )}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-[13px] text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={pagination.current_page <= 1} onClick={() => loadPage(pagination.current_page - 1)} className="inline-flex h-9 items-center gap-1 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
            </button>
            <button type="button" disabled={!pagination.has_more} onClick={() => loadPage(pagination.current_page + 1)} className="inline-flex h-9 items-center gap-1 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold disabled:opacity-40">
              Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Inbox: messages from visitors first, account notifications second (plan §3.4). */
export default function InboxPage() {
  const [tab, setTab] = React.useState<Tab>("messages");
  // Unread notifications (e.g. a message from the Digicardo team or your agent) badge the Notifications tab.
  const [unread, setUnread] = React.useState(0);
  React.useEffect(() => {
    if (tab === "notifications") {
      setUnread(0);
      return;
    }
    getUnreadCount()
      .then((r) => setUnread(r.count))
      .catch(() => {});
  }, [tab]);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div role="tablist" aria-label="Inbox" className="inline-flex rounded-[10px] bg-muted p-[3px]">
        {([
          ["messages", "Messages", Inbox],
          ["notifications", "Notifications", Bell],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm", tab === id ? "bg-card font-semibold text-foreground shadow-xs" : "font-medium text-[#52525B] hover:text-foreground")}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
            {id === "notifications" && unread > 0 && (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-[18px] text-white">
                {unread > 9 ? "9+" : unread}
                <span className="sr-only"> unread</span>
              </span>
            )}
          </button>
        ))}
      </div>
      {tab === "messages" ? <Messages /> : <Notifications />}
    </div>
  );
}
