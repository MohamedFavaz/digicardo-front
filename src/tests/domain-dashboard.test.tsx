import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import DomainsDashboardPage from "@/app/(app)/dashboard/domains/page";
import { DomainsSkeleton } from "@/components/domains/DomainsSkeleton";

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
  // Static rendering never runs effects, so the page shows its loading skeleton until
  // the domain list arrives. List and action content is covered in Phase 6.
  it("shows the domains loading skeleton before the domain list arrives", () => {
    const html = renderToStaticMarkup(<DomainsDashboardPage />);

    expect(html).toBe(renderToStaticMarkup(<DomainsSkeleton />));
  });
});
