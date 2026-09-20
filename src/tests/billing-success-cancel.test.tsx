import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BillingSuccessPage from "@/app/(app)/dashboard/billing/success/page";
import BillingCancelPage from "@/app/(app)/dashboard/billing/cancel/page";

vi.mock("@/lib/hooks/use-entitlements", () => ({
  useEntitlements: () => ({
    plan: {
      id: 2,
      code: "pro",
      name: "Pro Plan",
    },
    subscription: {
      billing_interval: "yearly",
      is_active: true,
    },
    isFree: false,
    mutate: vi.fn(),
  }),
}));

describe("Billing Success & Cancel Pages", () => {
  it("renders BillingSuccessPage with verified confirmation", () => {
    const html = renderToStaticMarkup(<BillingSuccessPage />);

    expect(html).toContain("Payment Successful!");
    expect(html).toContain("Plan Activated");
    expect(html).toContain("Go to Dashboard");
  });

  it("renders BillingCancelPage with safe cancellation message", () => {
    const html = renderToStaticMarkup(<BillingCancelPage />);

    expect(html).toContain("Checkout Canceled");
    expect(html).toContain("No charges were made to your account");
    expect(html).toContain("Return to Billing");
  });
});
