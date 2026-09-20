import useSWR from "swr";
import { analyticsApi, type AnalyticsQueryOptions } from "@/lib/api/analytics";
import type {
  AnalyticsOverview,
  AnalyticsTimeseriesPoint,
  AnalyticsBlockMetric,
  AnalyticsReferrerMetric,
  AnalyticsPeriod,
} from "@/types/analytics";

export function useAnalytics(
  period: AnalyticsPeriod = "7d",
  startDate?: string,
  endDate?: string
) {
  const options: AnalyticsQueryOptions = {
    period,
    start_date: startDate,
    end_date: endDate,
  };

  const keyOverview = [`analytics-overview`, period, startDate, endDate];
  const keyTimeseries = [`analytics-timeseries`, period, startDate, endDate];
  const keyBlocks = [`analytics-blocks`, period, startDate, endDate];
  const keyReferrers = [`analytics-referrers`, period, startDate, endDate];

  const {
    data: overview,
    error: overviewError,
    isLoading: isOverviewLoading,
    mutate: mutateOverview,
  } = useSWR<AnalyticsOverview>(keyOverview, () => analyticsApi.getOverview(options), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const {
    data: timeseries,
    error: timeseriesError,
    isLoading: isTimeseriesLoading,
    mutate: mutateTimeseries,
  } = useSWR<AnalyticsTimeseriesPoint[]>(keyTimeseries, () => analyticsApi.getTimeseries(options), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const {
    data: blocks,
    error: blocksError,
    isLoading: isBlocksLoading,
    mutate: mutateBlocks,
  } = useSWR<AnalyticsBlockMetric[]>(keyBlocks, () => analyticsApi.getBlocks(options), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const {
    data: referrers,
    error: referrersError,
    isLoading: isReferrersLoading,
    mutate: mutateReferrers,
  } = useSWR<AnalyticsReferrerMetric[]>(keyReferrers, () => analyticsApi.getReferrers(options), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const isLoading = isOverviewLoading || isTimeseriesLoading || isBlocksLoading || isReferrersLoading;
  const isError = Boolean(overviewError || timeseriesError || blocksError || referrersError);
  const errorMessage = overviewError?.message || timeseriesError?.message || blocksError?.message || referrersError?.message;

  const refresh = () => {
    mutateOverview();
    mutateTimeseries();
    mutateBlocks();
    mutateReferrers();
  };

  return {
    overview,
    timeseries: timeseries || [],
    blocks: blocks || [],
    referrers: referrers || [],
    isLoading,
    isError,
    errorMessage,
    refresh,
  };
}
