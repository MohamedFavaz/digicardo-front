/** Small helper for admin console pages (calls go through the BFF with the admin's session). */

export async function adminCall<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/bff/v1/admin${path}`, {
    credentials: "include",
    ...init,
    headers: { Accept: "application/json", ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    const err = json?.error as { message?: string; details?: Record<string, string[]> } | undefined;
    throw new Error((err?.details && Object.values(err.details).flat()[0]) || err?.message || "Something went wrong. Please try again.");
  }
  return json?.data as T;
}

export interface Paged<T> {
  items: T[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number; has_more?: boolean };
}

export function formatDate(iso?: string | null, withTime = false): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", withTime ? { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" } : { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return "—";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} h ago`;
  if (mins < 43200) return `${Math.floor(mins / 1440)} d ago`;
  return formatDate(iso);
}

export function humanize(value: string): string {
  return value.replace(/[._-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
