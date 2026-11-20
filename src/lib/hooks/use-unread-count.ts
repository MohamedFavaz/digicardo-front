"use client";

import useSWR from "swr";
import { getUnreadCount } from "@/lib/api/notifications";

/** Unread notifications for the nav badges (one shared request, refreshed every minute). */
export function useUnreadCount(): number {
  const { data } = useSWR("dashboard-unread-count", () => getUnreadCount().then((r) => r.count).catch(() => 0), {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
    dedupingInterval: 15_000,
  });
  return data ?? 0;
}
