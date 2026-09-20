"use client";

import * as React from "react";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { NotificationsHeader } from "@/components/notifications/NotificationsHeader";
import { NotificationFilterBar } from "@/components/notifications/NotificationFilterBar";
import { NotificationItemCard } from "@/components/notifications/NotificationItemCard";
import { NotificationEmptyState } from "@/components/notifications/NotificationEmptyState";
import { NotificationsSkeleton } from "@/components/notifications/NotificationsSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    pagination,
    unreadCount,
    isLoading,
    error,
    filterCategory,
    unreadOnly,
    setFilterCategory,
    setUnreadOnly,
    loadPage,
    markRead,
    markAllRead,
    remove,
  } = useNotifications(20);

  if (isLoading && notifications.length === 0) {
    return <NotificationsSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* ── Studio Header ── */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
      />

      {/* ── Error Banner if any ── */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Category Filters & Unread Switcher ── */}
      <NotificationFilterBar
        filterCategory={filterCategory}
        unreadOnly={unreadOnly}
        onSelectCategory={setFilterCategory}
        onToggleUnreadOnly={() => setUnreadOnly(!unreadOnly)}
      />

      {/* ── Notifications List or Empty State ── */}
      {notifications.length === 0 ? (
        <NotificationEmptyState unreadOnly={unreadOnly} />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationItemCard
              key={notif.id}
              notification={notif}
              onMarkRead={markRead}
              onRemove={remove}
            />
          ))}
        </div>
      )}

      {/* ── Pagination Controls ── */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/70 select-none">
          <p className="text-xs font-mono font-bold text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page} · {pagination.total} alerts total
          </p>

          <div className="flex items-center gap-2">
            <Button
              id="notifications-prev-page"
              type="button"
              variant="outline"
              size="sm"
              disabled={pagination.current_page <= 1}
              onClick={() => loadPage(pagination.current_page - 1)}
              className="rounded-full text-xs font-bold gap-1 h-9 px-4 bg-card"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>

            <Button
              id="notifications-next-page"
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.has_more}
              onClick={() => loadPage(pagination.current_page + 1)}
              className="rounded-full text-xs font-bold gap-1 h-9 px-4 bg-card"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
