import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ReportProfileModal } from "@/components/profile/ReportProfileModal";

vi.mock("@/lib/api/admin", () => ({
  submitPublicAbuseReport: vi.fn().mockResolvedValue({
    report_id: "01TESTREP",
    status: "received",
  }),
}));

describe("ReportProfileModal Component", () => {
  it("renders report profile trigger button", () => {
    const html = renderToStaticMarkup(<ReportProfileModal username="alice" />);

    expect(html).toContain("Report profile");
    expect(html).toContain('data-testid="report-profile-button"');
  });
});
