import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AdminDashboardPage from "@/app/(app)/dashboard/admin/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/api/admin", () => ({
  getAdminOverview: vi.fn().mockResolvedValue({
    metrics: {
      users: { total: 42, active: 40, suspended: 2 },
      profiles: { total: 35, under_review: 3, restricted_or_suspended: 1 },
      reports: { open: 5, investigating: 2, total_pending: 7 },
    },
    recent_actions: [
      {
        id: "01ACT",
        actor_id: "01ADMIN",
        actor: { id: "01ADMIN", name: "SuperAdmin", email: "admin@test.com", role: "admin" },
        target_type: "profile",
        target_id: "01TARGETPROF",
        action_type: "profile_restricted",
        reason: "Spam content",
        internal_notes: null,
        created_at: "2026-08-16T12:00:00Z",
      },
    ],
  }),
}));

describe("AdminDashboardPage Component", () => {
  it("renders administration and governance dashboard elements", () => {
    const html = renderToStaticMarkup(<AdminDashboardPage />);

    expect(html).toContain("Platform Administration &amp; Governance");
    expect(html).toContain("Total Users");
    expect(html).toContain("Total Profiles");
    expect(html).toContain("Abuse Reports");
    expect(html).toContain("User Management");
    expect(html).toContain("Profile Moderation");
    expect(html).toContain("Recent Moderation &amp; Governance Actions");
  });
});
