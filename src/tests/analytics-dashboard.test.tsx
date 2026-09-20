import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { AnalyticsDateRangeSelector } from "@/components/analytics/AnalyticsDateRangeSelector";
import { AnalyticsTopBlocks } from "@/components/analytics/AnalyticsTopBlocks";
import { AnalyticsReferrers } from "@/components/analytics/AnalyticsReferrers";
import { AnalyticsEmptyState, AnalyticsSkeleton } from "@/components/analytics/AnalyticsEmptyState";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import type { AnalyticsOverview, AnalyticsBlockMetric, AnalyticsReferrerMetric, AnalyticsTimeseriesPoint } from "@/types/analytics";

describe("Analytics Dashboard Components", () => {
  const mockOverview: AnalyticsOverview = {
    total_views: 1250,
    unique_views: 890,
    total_clicks: 420,
    total_contact_submissions: 15,
    click_through_rate: 33.6,
    top_block: {
      id: "01J5K2BLOCK0000000000001",
      type: "link",
      title: "My Portfolio",
      clicks: 210,
    },
    period: "7d",
    start_date: "2026-08-08",
    end_date: "2026-08-15",
  };

  it("renders AnalyticsSummaryCards correctly with metrics and CTR", () => {
    const html = renderToStaticMarkup(<AnalyticsSummaryCards overview={mockOverview} />);

    expect(html).toContain("Total Views");
    expect(html).toContain("1250");
    expect(html).toContain("Unique Visitors");
    expect(html).toContain("890");
    expect(html).toContain("Total Clicks");
    expect(html).toContain("420");
    expect(html).toContain("Click-Through Rate");
    expect(html).toContain("33.6%");
    expect(html).toContain("Contact Inquiries");
    expect(html).toContain("15");
  });

  it("renders AnalyticsDateRangeSelector with period options", () => {
    const html = renderToStaticMarkup(
      <AnalyticsDateRangeSelector period="7d" onPeriodChange={() => {}} />
    );

    expect(html).toContain("Last 7 Days");
    expect(html).toContain("Last 30 Days");
    expect(html).toContain("Last 90 Days");
    expect(html).toContain("Custom");
  });

  it("renders AnalyticsTopBlocks with rankings and counts", () => {
    const mockBlocks: AnalyticsBlockMetric[] = [
      {
        block_id: "01J5K2BLOCK0000000000001",
        block_type: "link",
        title: "Portfolio",
        count: 120,
      },
      {
        block_id: "01J5K2BLOCK0000000000002",
        block_type: "cta",
        title: "Join Newsletter",
        count: 65,
      },
    ];

    const html = renderToStaticMarkup(<AnalyticsTopBlocks blocks={mockBlocks} />);

    expect(html).toContain("Top Performing Blocks");
    expect(html).toContain("Portfolio");
    expect(html).toContain("120");
    expect(html).toContain("Join Newsletter");
    expect(html).toContain("65");
  });

  it("renders AnalyticsReferrers with traffic sources", () => {
    const mockReferrers: AnalyticsReferrerMetric[] = [
      { referrer: "twitter.com", count: 80, percentage: 50.0 },
      { referrer: "direct", count: 50, percentage: 31.25 },
    ];

    const html = renderToStaticMarkup(<AnalyticsReferrers referrers={mockReferrers} />);

    expect(html).toContain("Traffic Sources");
    expect(html).toContain("twitter.com");
    expect(html).toContain("direct");
    expect(html).toContain("50%");
  });

  it("renders AnalyticsChart with timeseries points", () => {
    const mockTimeseries: AnalyticsTimeseriesPoint[] = [
      { date: "2026-08-14", views: 100, unique_views: 80, clicks: 40 },
      { date: "2026-08-15", views: 150, unique_views: 110, clicks: 65 },
    ];

    const html = renderToStaticMarkup(<AnalyticsChart timeseries={mockTimeseries} />);

    expect(html).toContain("Performance Trend");
    expect(html).toContain("2026-08-14");
    expect(html).toContain("2026-08-15");
  });

  it("renders AnalyticsEmptyState and AnalyticsSkeleton gracefully", () => {
    const emptyHtml = renderToStaticMarkup(<AnalyticsEmptyState />);
    expect(emptyHtml).toContain("No Analytics Data Yet");

    const skeletonHtml = renderToStaticMarkup(<AnalyticsSkeleton />);
    expect(skeletonHtml).toContain("animate-pulse");
  });
});
