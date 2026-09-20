import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BillingPage from "@/app/(app)/dashboard/billing/page";

vi.mock("@/lib/hooks/use-entitlements", () => ({
  useEntitlements: () => ({
    entitlements: null,
    plan: {
      id: 2,
      code: "pro",
      name: "Pro Plan",
      description: "Professional creators",
      price_monthly_cents: 900,
      price_yearly_cents: 8400,
      currency: "USD",
      features: {},
      is_active: true,
    },
    subscription: {
      id: "01M0SUB123",
      provider: "stripe",
      status: "active",
      billing_interval: "monthly",
      current_period_start: "2026-08-15T00:00:00Z",
      current_period_end: "2026-09-15T00:00:00Z",
      cancel_at_period_end: true,
      is_active: true,
    },
    plans: [],
    isLoading: false,
    isPlansLoading: false,
    error: null,
    plansError: null,
    mutate: vi.fn(),
    can: vi.fn().mockReturnValue(true),
    limit: vi.fn((key) => (key === "profile_count" ? 3 : key === "custom_domain_count" ? 1 : 90)),
    usage: vi.fn(() => 1),
    remaining: vi.fn(() => 2),
    isFree: false,
    isPro: true,
    isBusiness: false,
  }),
}));

describe("BillingPage Lifecycle Rendering", () => {
  it("renders scheduled cancellation banner when cancel_at_period_end is true", () => {
    const html = renderToStaticMarkup(<BillingPage />);

    expect(html).toContain("Subscription Scheduled for Cancellation");
    expect(html).toContain("Resume Subscription");
    expect(html).toContain("Manage Billing");
    expect(html).toContain("Pro Plan");
  });
});
