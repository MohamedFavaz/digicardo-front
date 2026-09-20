import { describe, it, expect, vi, beforeEach } from "vitest";
import { plansApi } from "@/lib/api/plans";
import { apiClient } from "@/lib/api/client";
import type { Plan, Subscription, EntitlementsData } from "@/types/plans";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("plansApi Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches active public plans list", async () => {
    const mockPlans: Plan[] = [
      {
        id: 1,
        code: "free",
        slug: "free",
        name: "Free",
        description: "Starter link-in-bio",
        price_monthly_cents: 0,
        price_yearly_cents: 0,
        currency: "USD",
        features: {
          profile_count: 1,
          custom_domain_count: 0,
          analytics_history_days: 7,
          advanced_templates: false,
          gallery_blocks: false,
          video_blocks: false,
          music_blocks: false,
          booking_blocks: false,
          contact_forms: true,
          image_uploads: true,
          remove_branding: false,
          priority_support: false,
        },
        is_active: true,
      },
      {
        id: 2,
        code: "pro",
        slug: "pro",
        name: "Pro",
        description: "Professional creators",
        price_monthly_cents: 900,
        price_yearly_cents: 8400,
        currency: "USD",
        features: {
          profile_count: 3,
          custom_domain_count: 1,
          analytics_history_days: 90,
          advanced_templates: true,
          gallery_blocks: true,
          video_blocks: true,
          music_blocks: true,
          booking_blocks: true,
          contact_forms: true,
          image_uploads: true,
          remove_branding: true,
          priority_support: false,
        },
        is_active: true,
      },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockPlans);

    const plans = await plansApi.list();

    expect(apiClient.get).toHaveBeenCalledWith("/plans");
    expect(plans).toHaveLength(2);
    expect(plans[0].code).toBe("free");
    expect(plans[1].code).toBe("pro");
  });

  it("fetches user current subscription", async () => {
    const mockSubscription: Subscription = {
      id: "01M0SUB1234567890ABCDEF001",
      plan_id: 2,
      plan_code: "pro",
      provider: "stripe",
      provider_customer_id: "cus_123",
      provider_subscription_id: "sub_123",
      status: "active",
      billing_interval: "monthly",
      current_period_start: "2026-08-15T00:00:00Z",
      current_period_end: "2026-09-15T00:00:00Z",
      cancel_at_period_end: false,
      canceled_at: null,
      trial_ends_at: null,
      plan: null,
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockSubscription);

    const sub = await plansApi.getSubscription();

    expect(apiClient.get).toHaveBeenCalledWith("/subscription");
    expect(sub.status).toBe("active");
    expect(sub.plan_code).toBe("pro");
  });

  it("fetches user resolved entitlements", async () => {
    const mockEntitlements: EntitlementsData = {
      plan: {
        id: 2,
        code: "pro",
        slug: "pro",
        name: "Pro",
        description: "Pro tier",
        price_monthly_cents: 900,
        price_yearly_cents: 8400,
        currency: "USD",
        features: {
          profile_count: 3,
          custom_domain_count: 1,
          analytics_history_days: 90,
          advanced_templates: true,
          gallery_blocks: true,
          video_blocks: true,
          music_blocks: true,
          booking_blocks: true,
          contact_forms: true,
          image_uploads: true,
          remove_branding: true,
          priority_support: false,
        },
        is_active: true,
      },
      subscription: null,
      features: {
        advanced_templates: true,
        gallery_blocks: true,
        video_blocks: true,
        music_blocks: true,
        booking_blocks: true,
        remove_branding: true,
      },
      limits: {
        profile_count: 3,
        custom_domain_count: 1,
        analytics_history_days: 90,
      },
      usage: {
        profile_count: 1,
        custom_domain_count: 0,
      },
      remaining: {
        profile_count: 2,
        custom_domain_count: 1,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockEntitlements);

    const res = await plansApi.getEntitlements();

    expect(apiClient.get).toHaveBeenCalledWith("/entitlements");
    expect(res.plan.code).toBe("pro");
    expect(res.features.advanced_templates).toBe(true);
    expect(res.remaining.profile_count).toBe(2);
  });
});
