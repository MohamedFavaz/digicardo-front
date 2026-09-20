import { describe, it, expect, vi, beforeEach } from "vitest";
import { subscriptionApi } from "@/lib/api/subscription";
import { apiClient } from "@/lib/api/client";
import type { Subscription } from "@/types/subscription";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("subscriptionApi Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches current active subscription", async () => {
    const mockSubscription: Subscription = {
      id: "01M0SUB123",
      provider: "stripe",
      status: "active",
      billing_interval: "monthly",
      current_period_start: "2026-08-15T00:00:00Z",
      current_period_end: "2026-09-15T00:00:00Z",
      cancel_at_period_end: false,
      canceled_at: null,
      trial_ends_at: null,
      is_active: true,
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockSubscription);

    const sub = await subscriptionApi.getCurrent();

    expect(apiClient.get).toHaveBeenCalledWith("/subscription");
    expect(sub?.status).toBe("active");
  });

  it("initiates checkout session", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      checkout_url: "https://checkout.stripe.com/c/pay/cs_test_123",
      session_id: "cs_test_123",
      provider: "stripe",
    });

    const res = await subscriptionApi.checkout({
      plan: "pro",
      interval: "monthly",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/subscription/checkout", {
      plan: "pro",
      interval: "monthly",
    });
    expect(res.checkout_url).toContain("checkout.stripe.com");
  });

  it("requests customer billing portal session", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      portal_url: "https://billing.stripe.com/p/session/test_123",
      provider: "stripe",
    });

    const res = await subscriptionApi.portal();

    expect(apiClient.post).toHaveBeenCalledWith("/subscription/portal");
    expect(res.portal_url).toContain("billing.stripe.com");
  });

  it("requests subscription plan change", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      id: "01M0SUB123",
      plan_code: "business",
      status: "active",
      billing_interval: "yearly",
      is_active: true,
    });

    const res = await subscriptionApi.changePlan({
      plan: "business",
      interval: "yearly",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/subscription/change-plan", {
      plan: "business",
      interval: "yearly",
    });
    expect(res.plan_code).toBe("business");
  });

  it("cancels and resumes subscription", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      id: "01M0SUB123",
      cancel_at_period_end: true,
      is_active: true,
    });

    const canceled = await subscriptionApi.cancel();
    expect(apiClient.post).toHaveBeenCalledWith("/subscription/cancel");
    expect(canceled.cancel_at_period_end).toBe(true);

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      id: "01M0SUB123",
      cancel_at_period_end: false,
      is_active: true,
    });

    const resumed = await subscriptionApi.resume();
    expect(apiClient.post).toHaveBeenCalledWith("/subscription/resume");
    expect(resumed.cancel_at_period_end).toBe(false);
  });
});
