import type { PartnerCard, PartnerContent, PartnerSiteOwner } from "@/lib/partner/types";

/** Agent landing page + leads (agent panel) and agent sites (admin). Calls go through the BFF. */

function firstError(json: unknown, fallback: string): string {
  const err = (json as { error?: { message?: string; details?: Record<string, string[]> } } | null)?.error;
  return (err?.details && Object.values(err.details).flat()[0]) || err?.message || fallback;
}

/** The same landing-page API serves the agent panel and the franchise owner's panel. */
function panelPath(path: string): string {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/franchise") && path.startsWith("/agent/")) {
    return "/franchise/" + path.slice("/agent/".length);
  }
  return path;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  path = panelPath(path);
  const isForm = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const res = await fetch(`/api/bff/v1${path}`, {
    credentials: "include",
    ...init,
    headers: { Accept: "application/json", ...(init?.body && !isForm ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(firstError(json, "Something went wrong. Please try again."));
  return json?.data as T;
}

export interface AgentLead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  package: string | null;
  message: string | null;
  source_host: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminAgentSite {
  site: PartnerSiteOwner;
  dns: { a_records: string[]; cname_target: string };
  customers: number;
  leads: number;
}

export const agentSiteApi = {
  get: () => call<{ site: PartnerSiteOwner; customers: PartnerCard[]; unread_leads: number }>("/agent/site"),
  save: (content: PartnerContent, slug?: string) =>
    call<{ site: PartnerSiteOwner }>("/agent/site", { method: "PUT", body: JSON.stringify({ content, ...(slug ? { slug } : {}) }) }),
  publish: (published: boolean) => call<{ site: PartnerSiteOwner }>("/agent/site/publish", { method: "POST", body: JSON.stringify({ published }) }),
  uploadImage: (file: File | Blob, name = "image.png") => {
    const form = new FormData();
    form.append("image", file, name);
    return call<{ url: string }>("/agent/site/images", { method: "POST", body: form });
  },
  leads: (page = 1) => call<{ items: AgentLead[]; pagination: { current_page: number; last_page: number; total: number }; unread: number }>(`/agent/leads?page=${page}`),
  markLeadRead: (id: string) => call<{ id: string }>(`/agent/leads/${id}/read`, { method: "PATCH" }),
  deleteLead: (id: string) => call<null>(`/agent/leads/${id}`, { method: "DELETE" }),
};

export const adminAgentSiteApi = {
  get: (agentId: string) => call<AdminAgentSite>(`/admin/agents/${agentId}/site`),
  setDomain: (agentId: string, domain: string | null) => call<AdminAgentSite>(`/admin/agents/${agentId}/site/domain`, { method: "PUT", body: JSON.stringify({ domain }) }),
  check: (agentId: string) => call<AdminAgentSite>(`/admin/agents/${agentId}/site/domain/check`, { method: "POST" }),
  activate: (agentId: string) => call<AdminAgentSite>(`/admin/agents/${agentId}/site/domain/activate`, { method: "POST" }),
  remove: (agentId: string) => call<AdminAgentSite>(`/admin/agents/${agentId}/site/domain`, { method: "DELETE" }),
  setLandingDisabled: (agentId: string, disabled: boolean) =>
    call<AdminAgentSite>(`/admin/agents/${agentId}/site/landing`, { method: "PATCH", body: JSON.stringify({ disabled }) }),
};
