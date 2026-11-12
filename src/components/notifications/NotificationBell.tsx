'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, BellRing, Check, Trash2 } from 'lucide-react';
import {
  getUnreadCount,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/lib/api/notifications';
import type { Notification } from '@/types/notifications';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  system: 'bg-slate-900',
  security: 'bg-rose-500',
  subscription: 'bg-emerald-500',
  domain: 'bg-indigo-500',
  contact: 'bg-amber-500',
  profile: 'bg-sky-500',
  marketing: 'bg-violet-500',
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export interface NotificationBellProps {
  align?: 'left' | 'right';
  className?: string;
}

export function NotificationBell({ align = 'right', className }: NotificationBellProps) {
  const [open, setOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = React.useCallback(async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.count);
    } catch {
      // Silently ignore
    }
  }, []);

  const fetchNotifications = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications({ per_page: 10 });
      setNotifications(res.items);
      setUnreadCount(res.items.filter((n) => !n.is_read).length);
    } catch {
      // Silently ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll unread count every 30s
  React.useEffect(() => {
    fetchCount();
    pollRef.current = setInterval(fetchCount, 30_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchCount]);

  // Fetch notifications when opening panel
  React.useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    const wasUnread = notifications.find((n) => n.id === id && !n.is_read);
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  };

  const hasUnread = unreadCount > 0;

  return (
    <div className="relative" id="notification-bell-container">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        id="notification-bell-button"
        aria-label={`Notifications${hasUnread ? ` — ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer shadow-2xs focus:outline-none select-none",
          open
            ? "bg-slate-100 border-slate-300 text-slate-900 ring-2 ring-slate-200"
            : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300",
          className
        )}
      >
        {hasUnread ? (
          <BellRing className="h-4 w-4 text-slate-900 animate-[wiggle_0.6s_ease-in-out_infinite]" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white shadow-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Notifications panel"
          className={cn(
            "z-50 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150",
            // Mobile responsive: anchored cleanly within screen margins
            "max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-16 max-sm:w-auto max-sm:max-w-none",
            // Desktop: anchored relative to the bell button
            "sm:absolute sm:top-11 sm:w-80 md:w-96 sm:max-w-[380px]",
            align === "left" ? "sm:left-0" : "sm:right-0"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Notifications</span>
              {hasUnread && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {hasUnread && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <Check className="h-3 w-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-900 hover:bg-slate-100 transition-colors"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/80">
            {isLoading ? (
              <div className="flex flex-col gap-3 px-4 py-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-slate-200 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 rounded bg-slate-200" />
                      <div className="h-2.5 w-full rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">No notifications yet</p>
                <p className="text-[11px] text-slate-400">We will notify you when something important happens</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100" role="list">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={cn(
                      "group flex items-start gap-3 px-4 py-3 transition-colors",
                      notif.is_read
                        ? "bg-white hover:bg-slate-50/70 opacity-70 hover:opacity-100"
                        : "bg-slate-50/50 hover:bg-slate-100/60"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-1.5 h-2 w-2 flex-shrink-0 rounded-full",
                        notif.is_read ? "bg-slate-300" : (CATEGORY_COLORS[notif.category] || "bg-slate-900")
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 leading-snug">{notif.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.body}</p>
                      <p className="mt-1 text-[10px] text-slate-400 font-medium">{timeAgo(notif.created_at)}</p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          title="Mark read"
                          className="rounded-full p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        title="Delete"
                        className="rounded-full p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer link */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/60">
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Manage all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
