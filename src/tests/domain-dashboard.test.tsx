import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import DomainsDashboardPage from "@/app/(app)/dashboard/domains/page";

vi.mock("@/lib/api/domains", () => ({
  domainsApi: {
    list: vi.fn().mockResolvedValue({ success: true, data: [] }),
    create: vi.fn(),
    verify: vi.fn(),
    activate: vi.fn(),
    setPrimary: vi.fn(),
    disable: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("DomainsDashboardPage Component", () => {
  it("renders the dashboard page heading and action buttons", () => {
    const html = renderToStaticMarkup(<DomainsDashboardPage />);

    expect(html).toContain("Custom Domains");
    expect(html).toContain("Connect your personal domain");
    expect(html).toContain("Add Custom Domain");
    expect(html).toContain("Dashboard");
  });
});
