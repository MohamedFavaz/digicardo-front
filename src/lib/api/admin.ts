import {
  AdminOverviewResponse,
  AdminUserItem,
  AdminUserDetails,
  AdminProfileItem,
  AdminProfileDetails,
  AbuseReportItem,
  ModerationActionItem,
  AdminAuditLogItem,
  PaginatedResult,
} from "@/types/admin";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "An unexpected error occurred.");
  }
  return json.data;
}

export async function getAdminOverview(): Promise<AdminOverviewResponse> {
  const res = await fetch("/api/bff/v1/admin/overview", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<AdminOverviewResponse>(res);
}

// User Management
export async function getAdminUsers(params: {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: string;
  email_verified?: boolean;
}): Promise<PaginatedResult<AdminUserItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.status) searchParams.set("status", params.status);
  if (params.email_verified !== undefined) searchParams.set("email_verified", String(params.email_verified));

  const res = await fetch(`/api/bff/v1/admin/users?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<PaginatedResult<AdminUserItem>>(res);
}

export async function getAdminUserDetails(id: string): Promise<AdminUserDetails> {
  const res = await fetch(`/api/bff/v1/admin/users/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<AdminUserDetails>(res);
}

export async function updateAdminUserStatus(
  id: string,
  status: "active" | "suspended" | "banned",
  reason?: string
): Promise<{ user_id: string; status: string }> {
  const res = await fetch(`/api/bff/v1/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reason }),
  });
  return handleResponse<{ user_id: string; status: string }>(res);
}

export async function updateAdminUserRole(
  id: string,
  role: "user" | "moderator" | "admin",
  reason?: string
): Promise<{ user_id: string; role: string }> {
  const res = await fetch(`/api/bff/v1/admin/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, reason }),
  });
  return handleResponse<{ user_id: string; role: string }>(res);
}

export async function createAdminUser(data: {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: "user" | "moderator" | "admin";
  status?: "active" | "suspended" | "banned";
}): Promise<{ user: { id: string; name: string; email: string; role: string; status: string; username?: string } }> {
  const res = await fetch("/api/bff/v1/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<{ user: { id: string; name: string; email: string; role: string; status: string; username?: string } }>(res);
}

// Profile Moderation
export async function getAdminProfiles(params: {
  page?: number;
  per_page?: number;
  search?: string;
  moderation_status?: string;
  is_public?: boolean;
}): Promise<PaginatedResult<AdminProfileItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.search) searchParams.set("search", params.search);
  if (params.moderation_status) searchParams.set("moderation_status", params.moderation_status);
  if (params.is_public !== undefined) searchParams.set("is_public", String(params.is_public));

  const res = await fetch(`/api/bff/v1/admin/profiles?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<PaginatedResult<AdminProfileItem>>(res);
}

export async function getAdminProfileDetails(id: string): Promise<AdminProfileDetails> {
  const res = await fetch(`/api/bff/v1/admin/profiles/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<AdminProfileDetails>(res);
}

export async function moderateProfileStatus(
  id: string,
  moderation_status: "active" | "under_review" | "restricted" | "suspended",
  reason?: string,
  notes?: string
): Promise<{ profile_id: string; moderation_status: string; moderation_reason: string | null }> {
  const res = await fetch(`/api/bff/v1/admin/profiles/${id}/moderation`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moderation_status, reason, notes }),
  });
  return handleResponse<{ profile_id: string; moderation_status: string; moderation_reason: string | null }>(res);
}

// Abuse Reports
export async function getAdminReports(params: {
  page?: number;
  per_page?: number;
  status?: string;
  reason?: string;
  profile_id?: string;
}): Promise<PaginatedResult<AbuseReportItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.status) searchParams.set("status", params.status);
  if (params.reason) searchParams.set("reason", params.reason);
  if (params.profile_id) searchParams.set("profile_id", params.profile_id);

  const res = await fetch(`/api/bff/v1/admin/reports?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<PaginatedResult<AbuseReportItem>>(res);
}

export async function getAdminReportDetails(id: string): Promise<AbuseReportItem> {
  const res = await fetch(`/api/bff/v1/admin/reports/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<AbuseReportItem>(res);
}

export async function updateAdminReportStatus(
  id: string,
  status: "open" | "investigating" | "resolved" | "dismissed",
  resolution_notes?: string
): Promise<{ report_id: string; status: string; resolved_at: string | null }> {
  const res = await fetch(`/api/bff/v1/admin/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, resolution_notes }),
  });
  return handleResponse<{ report_id: string; status: string; resolved_at: string | null }>(res);
}

// Moderation Actions & Audit Logs
export async function getAdminModerationActions(params: {
  page?: number;
  per_page?: number;
  target_type?: string;
  target_id?: string;
  action_type?: string;
}): Promise<PaginatedResult<ModerationActionItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.target_type) searchParams.set("target_type", params.target_type);
  if (params.target_id) searchParams.set("target_id", params.target_id);
  if (params.action_type) searchParams.set("action_type", params.action_type);

  const res = await fetch(`/api/bff/v1/admin/moderation-actions?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<PaginatedResult<ModerationActionItem>>(res);
}

export async function getAdminAuditLogs(params: {
  page?: number;
  per_page?: number;
  action?: string;
  target_type?: string;
  request_id?: string;
}): Promise<PaginatedResult<AdminAuditLogItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.action) searchParams.set("action", params.action);
  if (params.target_type) searchParams.set("target_type", params.target_type);
  if (params.request_id) searchParams.set("request_id", params.request_id);

  const res = await fetch(`/api/bff/v1/admin/audit-logs?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse<PaginatedResult<AdminAuditLogItem>>(res);
}

// Public Abuse Reporting
export async function submitPublicAbuseReport(
  username: string,
  payload: {
    reason: string;
    description: string;
    block_id?: string;
    reporter_email?: string;
    hp_field?: string;
  }
): Promise<{ report_id: string; status: string }> {
  const res = await fetch(`/api/bff/v1/p/${username}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ report_id: string; status: string }>(res);
}
