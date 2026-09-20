import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BillingPage from "@/app/(app)/dashboard/billing/page";

vi.mock("@/lib/hooks/use-entitlements", () => ({
  useEntitlements: () => ({
    entitlements: {
      plan: {
        id: 1,
        code: "free",
        name: "Free Plan",
        description: "Starter link-in-bio",
        price_monthly_cents: 0,
        price_yearly_cents: 0,
        currency: "USD",
        features: {},
        is_active: true,
      },
      subscription: null,
      features: {
        profile_count: 1,
        custom_domain_count: 0,
        advanced_templates: false,
      },
      limits: {
        profile_count: 1,
        custom_domain_count: 0,
        analytics_history_days: 7,
      },
      usage: {
        profile_count: 1,
        custom_domain_count: 0,
        analytics_history_days: 7,
      },
      remaining: {
        profile_count: 0,
        custom_domain_count: 0,
      },
    },
    plan: {
      id: 1,
      code: "free",
      name: "Free Plan",
      description: "Starter link-in-bio",
      price_monthly_cents: 0,
      price_yearly_cents: 0,
      currency: "USD",
      features: {},
      is_active: true,
    },
    subscription: null,
    plans: [],
    isLoading: false,
    isPlansLoading: false,
    error: null,
    plansError: null,
    mutate: vi.fn(),
    can: vi.fn().mockReturnValue(false),
    limit: vi.fn((key) => (key === "profile_count" ? 1 : key === "custom_domain_count" ? 0 : 7)),
    usage: vi.fn(() => 1),
    remaining: vi.fn(() => 0),
    isFree: true,
    isPro: false,
    isBusiness: false,
  }),
}));

describe("BillingPage Component", () => {
  it("renders subscription header, current tier, usage meters, and plan options", () => {
    const html = renderToStaticMarkup(<BillingPage />);

    expect(html).toContain("Subscription &amp; Plan");
    expect(html).toContain("Free Plan");
    expect(html).toContain("Feature Usage &amp; Capacities");
    expect(html).toContain("Profile Identities");
    expect(html).toContain("Custom Domains");
    expect(html).toContain("Analytics History");
    expect(html).toContain("Available Plans");
    expect(html).toContain("Upgrade to Pro");
    expect(html).toContain("Upgrade to Business");
  });
});
