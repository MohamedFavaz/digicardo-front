"use client";

import * as React from "react";
import { AlertCircle, Bell, CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { ConsolePage, EmptyState, PageHeader } from "@/components/console/ui";
import { NotificationFilterBar } from "@/components/notifications/NotificationFilterBar";
import { NotificationItemCard } from "@/components/notifications/NotificationItemCard";
import { useNotifications } from "@/lib/hooks/use-notifications";

/** Agent inbox: messages from the Digicardo team and account notifications. */
export default function AgentInboxPage() {
  const { notifications, pagination, unreadCount, isLoading, error, filterCategory, unreadOnly, setFilterCategory, setUnreadOnly, loadPage, markRead, markAllRead, remove } =
    useNotifications(20);

  // Keep the sidebar badge in step after reading here.
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent("agent-inbox-changed", { detail: { unread: unreadCount } }));
  }, [unreadCount]);

  return (
    <ConsolePage width="narrow">
      <PageHeader
        title="Inbox"
        description="Messages from the Digicardo team and updates about your account."
        actions={
          unreadCount > 0 ? (
            <button type="button" onClick={() => void markAllRead()} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold hover:bg-muted">
              <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark all read
            </button>
          ) : undefined
        }
      />
      <NotificationFilterBar filterCategory={filterCategory} unreadOnly={unreadOnly} onSelectCategory={setFilterCategory} onToggleUnreadOnly={() => setUnreadOnly(!unreadOnly)} />
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
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState icon={Bell} title={unreadOnly ? "Nothing unread" : "Your inbox is empty"} text="When the Digicardo team sends you a message, it appears here." />
        </div>
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
    </ConsolePage>
  );
}
