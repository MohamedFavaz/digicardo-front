'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, BellRing, Check, Trash2 } from 'lucide-react';
import { getUnreadCount, getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '@/lib/api/notifications';
import type { Notification } from '@/types/notifications';

const CATEGORY_COLORS: Record<string, string> = {
  system: 'bg-indigo-500',
  security: 'bg-red-500',
  subscription: 'bg-emerald-500',
  domain: 'bg-purple-500',
  contact: 'bg-amber-500',
  profile: 'bg-sky-500',
  marketing: 'bg-pink-500',
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

export function NotificationBell() {
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
      setUnreadCount(res.items.filter(n => !n.is_read).length);
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
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
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
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    const wasUnread = notifications.find(n => n.id === id && !n.is_read);
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
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
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 transition-colors hover:border-indigo-500 hover:bg-slate-700 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        {hasUnread ? (
          <BellRing className="h-4 w-4 animate-[wiggle_0.6s_ease-in-out_infinite]" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow"
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
          className="absolute right-0 top-10 z-50 w-80 sm:w-96 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 ring-1 ring-white/5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
            <span className="text-sm font-semibold text-slate-100">Notifications</span>
            <div className="flex items-center gap-2">
              {hasUnread && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  title="Mark all as read"
                >
                  <Check className="h-3 w-3" />
                  All read
                </button>
              )}
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-[11px] font-medium text-indigo-400 transition-colors hover:bg-slate-800 hover:text-indigo-300"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col gap-2 px-4 py-6">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-slate-700 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 rounded bg-slate-700" />
                      <div className="h-2.5 w-full rounded bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <Bell className="h-8 w-8 text-slate-600" />
                <p className="text-sm text-slate-500">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-800" role="list">
                {notifications.map(notif => (
                  <li
                    key={notif.id}
                    className={`group flex items-start gap-3 px-4 py-3 transition-colors ${notif.is_read ? 'opacity-60 hover:opacity-100' : 'bg-slate-800/40 hover:bg-slate-800/60'}`}
                  >
                    <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${notif.is_read ? 'bg-slate-600' : (CATEGORY_COLORS[notif.category] || 'bg-indigo-500')}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-slate-200 leading-snug">{notif.title}</p>
                      <p className="mt-0.5 text-[12px] text-slate-400 line-clamp-2 leading-relaxed">{notif.body}</p>
                      <p className="mt-1 text-[11px] text-slate-600">{timeAgo(notif.created_at)}</p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          title="Mark read"
                          className="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-emerald-400 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        title="Delete"
                        className="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-red-400 transition-colors"
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
            <div className="border-t border-slate-700 px-4 py-2.5">
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
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
