/**
 * Messages sent by admins (to everyone / users / agents / an agent's customers / chosen people)
 * and by agents (to the customers they created). Recipients get them as notifications.
 */

export type AdminAudience = "everyone" | "users" | "agents" | "agent_customers" | "selected";
export type AgentAudience = "my_customers" | "selected";
export type Audience = AdminAudience | AgentAudience;

export interface SentMessage {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  audience: Audience;
  audience_label: string;
  sender_role: "admin" | "agent";
  sender: { id: string; name: string; email: string } | null;
  recipient_count: number;
  read_count: number;
  emailed: boolean;
  retracted_at: string | null;
  created_at: string;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string | null;
}

export interface Paged<T> {
  items: T[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface AdminAudiences {
  counts: { everyone: number; users: number; agents: number };
  agents: { id: string; name: string; email: string; customers: number }[];
}

export interface SendPayload {
  audience: Audience;
  user_ids?: string[];
  agent_id?: string;
  title: string;
  body: string;
  link_url?: string;
  send_email?: boolean;
}

/** The first readable error message from an API error body. */
export function apiErrorMessage(json: unknown, fallback = "Something went wrong. Please try again."): string {
  const err = (json as { error?: { message?: string; details?: Record<string, string[]> } } | null)?.error;
  const firstDetail = err?.details ? Object.values(err.details).flat()[0] : undefined;
  return firstDetail || err?.message || fallback;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/bff/v1${path}`, {
    credentials: "include",
    ...init,
    headers: { Accept: "application/json", ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(apiErrorMessage(json));
  return json?.data as T;
}

const qs = (params: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const adminMessagesApi = {
  list: (page = 1, sender?: "admin" | "agent") => call<Paged<SentMessage>>(`/admin/broadcasts${qs({ page, per_page: 10, sender })}`),
  audiences: () => call<AdminAudiences>("/admin/broadcasts/audiences"),
  recipients: (search: string) => call<{ items: Recipient[] }>(`/admin/broadcasts/recipients${qs({ search })}`),
  send: (payload: SendPayload) => call<{ message: SentMessage }>("/admin/broadcasts", { method: "POST", body: JSON.stringify(payload) }),
  unsend: (id: string) => call<{ message: SentMessage }>(`/admin/broadcasts/${id}`, { method: "DELETE" }),
};

export const agentMessagesApi = {
  list: (page = 1) => call<Paged<SentMessage> & { customers: number }>(`/agent/messages${qs({ page, per_page: 10 })}`),
  recipients: (search: string) => call<{ items: Recipient[] }>(`/agent/messages/recipients${qs({ search })}`),
  send: (payload: SendPayload) => call<{ message: SentMessage }>("/agent/messages", { method: "POST", body: JSON.stringify(payload) }),
  unsend: (id: string) => call<{ message: SentMessage }>(`/agent/messages/${id}`, { method: "DELETE" }),
};
