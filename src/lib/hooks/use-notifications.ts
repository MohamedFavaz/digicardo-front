'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/lib/api/notifications';
import type { Notification, NotificationCategory, NotificationPagination } from '@/types/notifications';

const POLL_INTERVAL_MS = 30_000; // 30 seconds

interface UseNotificationsReturn {
  notifications: Notification[];
  pagination: NotificationPagination | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  filterCategory: NotificationCategory | undefined;
  unreadOnly: boolean;
  setFilterCategory: (category: NotificationCategory | undefined) => void;
  setUnreadOnly: (value: boolean) => void;
  loadPage: (page: number) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(initialPerPage = 15): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<NotificationPagination | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<NotificationCategory | undefined>(undefined);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const currentPageRef = useRef(1);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const [listRes, countRes] = await Promise.all([
        getNotifications({
          category: filterCategory,
          unread_only: unreadOnly,
          per_page: initialPerPage,
          page,
        }),
        getUnreadCount(),
      ]);
      setNotifications(listRes.items);
      setPagination(listRes.pagination);
      setUnreadCount(countRes.count);
      currentPageRef.current = page;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, unreadOnly, initialPerPage]);

  const pollUnreadCount = useCallback(async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.count);
    } catch {
      // Silently ignore polling errors
    }
  }, []);

  // Initial load & re-fetch when filters change
  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  // Poll unread count every 30s
  useEffect(() => {
    pollRef.current = setInterval(pollUnreadCount, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollUnreadCount]);

  const loadPage = useCallback(async (page: number) => {
    await fetchNotifications(page);
  }, [fetchNotifications]);

  const markRead = useCallback(async (id: string) => {
    try {
      const updated = await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updated } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read.');
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read.');
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      const wasUnread = notifications.find(n => n.id === id && !n.is_read);
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification.');
    }
  }, [notifications]);

  const refresh = useCallback(() => fetchNotifications(currentPageRef.current), [fetchNotifications]);

  return {
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
    refresh,
  };
}
