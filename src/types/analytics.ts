/**
 * TypeScript Type Definitions for Digicardo Analytics & Event Tracking Engine
 */

export type AnalyticsEventType =
  | "profile_view"
  | "profile_unique_view"
  | "link_click"
  | "social_click"
  | "cta_click"
  | "email_click"
  | "phone_click"
  | "whatsapp_click"
  | "booking_click"
  | "contact_submit"
  | "image_click"
  | "video_play"
  | "gallery_open"
  | "faq_open"
  | "countdown_complete";

export type AnalyticsPeriod = "today" | "7d" | "30d" | "90d" | "custom";

export interface AnalyticsMetadata {
  destination_host?: string;
  provider?: string;
  image_index?: number;
  item_index?: number;
  [key: string]: unknown;
}

export interface TrackEventInput {
  profile_id: string;
  event_type: AnalyticsEventType;
  block_id?: string | null;
  referrer?: string | null;
  metadata?: AnalyticsMetadata | null;
  occurred_at?: string;
}

export interface TopBlockSummary {
  id: string;
  type: string;
  title: string;
  clicks: number;
}

export interface AnalyticsOverview {
  total_views: number;
  unique_views: number;
  total_clicks: number;
  total_contact_submissions: number;
  click_through_rate: number;
  top_block: TopBlockSummary | null;
  period: AnalyticsPeriod;
  start_date: string;
  end_date: string;
}

export interface AnalyticsTimeseriesPoint {
  date: string;
  views: number;
  unique_views: number;
  clicks: number;
}

export interface AnalyticsBlockMetric {
  block_id: string;
  block_type: string;
  title: string;
  count: number;
}

export interface AnalyticsReferrerMetric {
  referrer: string;
  count: number;
  percentage: number;
}
