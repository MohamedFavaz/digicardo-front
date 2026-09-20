import { apiClient } from "./client";
import type {
  AnalyticsOverview,
  AnalyticsTimeseriesPoint,
  AnalyticsBlockMetric,
  AnalyticsReferrerMetric,
  AnalyticsPeriod,
} from "@/types/analytics";

export interface AnalyticsQueryOptions {
  period?: AnalyticsPeriod;
  start_date?: string;
  end_date?: string;
}

function buildQueryString(options?: AnalyticsQueryOptions): string {
  if (!options) return "";
  const params = new URLSearchParams();
  if (options.period) params.append("period", options.period);
  if (options.start_date) params.append("start_date", options.start_date);
  if (options.end_date) params.append("end_date", options.end_date);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const analyticsApi = {
  /**
   * Get high-level overview metrics (views, clicks, CTR, submissions).
   */
  getOverview: async (options?: AnalyticsQueryOptions): Promise<AnalyticsOverview> => {
    return apiClient.get<AnalyticsOverview>(
      `/profile/analytics/overview${buildQueryString(options)}`
    );
  },

  /**
   * Get daily time series metrics for chart rendering.
   */
  getTimeseries: async (options?: AnalyticsQueryOptions): Promise<AnalyticsTimeseriesPoint[]> => {
    return apiClient.get<AnalyticsTimeseriesPoint[]>(
      `/profile/analytics/timeseries${buildQueryString(options)}`
    );
  },

  /**
   * Get interaction metrics grouped by block.
   */
  getBlocks: async (options?: AnalyticsQueryOptions): Promise<AnalyticsBlockMetric[]> => {
    return apiClient.get<AnalyticsBlockMetric[]>(
      `/profile/analytics/blocks${buildQueryString(options)}`
    );
  },

  /**
   * Get normalized referrer breakdown.
   */
  getReferrers: async (options?: AnalyticsQueryOptions): Promise<AnalyticsReferrerMetric[]> => {
    return apiClient.get<AnalyticsReferrerMetric[]>(
      `/profile/analytics/referrers${buildQueryString(options)}`
    );
  },
};
