import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminOverview,
  getAdminUsers,
  updateAdminUserStatus,
  moderateProfileStatus,
  submitPublicAbuseReport,
} from "@/lib/api/admin";

describe("Admin API Client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches admin overview metrics successfully", async () => {
    const mockData = {
      metrics: {
        users: { total: 100, active: 95, suspended: 5 },
        profiles: { total: 80, under_review: 2, restricted_or_suspended: 1 },
        reports: { open: 3, investigating: 1, total_pending: 4 },
      },
      recent_actions: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response);

    const result = await getAdminOverview();
    expect(result.metrics.users.total).toBe(100);
    expect(result.metrics.reports.open).toBe(3);
    expect(global.fetch).toHaveBeenCalledWith("/api/bff/v1/admin/overview", expect.any(Object));
  });

  it("lists admin users with search and filter parameters", async () => {
    const mockResult = {
      items: [
        { id: "01TESTUSER", name: "Jane", email: "jane@test.com", role: "user" as const, status: "active" as const, email_verified_at: null, created_at: "", updated_at: "" },
      ],
      pagination: { current_page: 1, last_page: 1, per_page: 15, total: 1, has_more: false },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockResult }),
    } as Response);

    const result = await getAdminUsers({ page: 1, per_page: 15, search: "jane", role: "user" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].email).toBe("jane@test.com");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/bff/v1/admin/users?page=1&per_page=15&search=jane&role=user",
      expect.any(Object)
    );
  });

  it("updates user status through BFF", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { user_id: "01USER", status: "suspended" } }),
    } as Response);

    const result = await updateAdminUserStatus("01USER", "suspended", "Spam activity");
    expect(result.status).toBe("suspended");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/bff/v1/admin/users/01USER/status",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "suspended", reason: "Spam activity" }),
      })
    );
  });

  it("moderates profile status through BFF", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { profile_id: "01PROF", moderation_status: "restricted", moderation_reason: "Violation" },
      }),
    } as Response);

    const result = await moderateProfileStatus("01PROF", "restricted", "Violation", "Internal notes");
    expect(result.moderation_status).toBe("restricted");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/bff/v1/admin/profiles/01PROF/moderation",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          moderation_status: "restricted",
          reason: "Violation",
          notes: "Internal notes",
        }),
      })
    );
  });

  it("submits public abuse report", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { report_id: "01REP", status: "received" } }),
    } as Response);

    const result = await submitPublicAbuseReport("alice", {
      reason: "phishing",
      description: "Phishing links on page",
      reporter_email: "visitor@test.com",
    });

    expect(result.status).toBe("received");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/bff/v1/p/alice/report",
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
