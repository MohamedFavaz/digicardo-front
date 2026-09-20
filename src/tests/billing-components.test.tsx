import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { UsageMeter } from "@/components/billing/UsageMeter";
import { LockedFeatureOverlay } from "@/components/billing/LockedFeatureOverlay";

describe("Billing UI Components", () => {
  it("renders PlanBadge correctly for Free, Pro, and Business", () => {
    const freeHtml = renderToStaticMarkup(<PlanBadge planCode="free" />);
    expect(freeHtml).toContain("Free Plan");

    const proHtml = renderToStaticMarkup(<PlanBadge planCode="pro" />);
    expect(proHtml).toContain("Pro");

    const businessHtml = renderToStaticMarkup(<PlanBadge planCode="business" />);
    expect(businessHtml).toContain("Business");
  });

  it("renders UsageMeter with accurate percentage and at-limit warning", () => {
    const normalHtml = renderToStaticMarkup(
      <UsageMeter
        title="Custom Domains"
        usage={0}
        limit={1}
        unit="domains"
      />
    );
    expect(normalHtml).toContain("Custom Domains");
    expect(normalHtml).toContain("0");
    expect(normalHtml).toContain("/ 1 domains");

    // At limit
    const limitHtml = renderToStaticMarkup(
      <UsageMeter
        title="Custom Domains"
        usage={1}
        limit={1}
        unit="domains"
      />
    );
    expect(limitHtml).toContain("Limit reached. Upgrade to increase capacity.");

    // Unlimited
    const unlimitedHtml = renderToStaticMarkup(
      <UsageMeter
        title="Analytics History"
        usage={365}
        limit={null}
      />
    );
    expect(unlimitedHtml).toContain("Unlimited");
  });

  it("renders LockedFeatureOverlay badge with Pro and Business label", () => {
    const proHtml = renderToStaticMarkup(<LockedFeatureOverlay planRequired="pro" />);
    expect(proHtml).toContain("Pro");

    const businessHtml = renderToStaticMarkup(<LockedFeatureOverlay planRequired="business" />);
    expect(businessHtml).toContain("Business");
  });
});
