export type FeatureKey =
  | 'profile_count'
  | 'custom_domain_count'
  | 'analytics_history_days'
  | 'advanced_templates'
  | 'gallery_blocks'
  | 'video_blocks'
  | 'music_blocks'
  | 'booking_blocks'
  | 'contact_forms'
  | 'image_uploads'
  | 'remove_branding'
  | 'priority_support';

export interface PlanFeatures {
  profile_count: number;
  custom_domain_count: number;
  analytics_history_days: number;
  advanced_templates: boolean;
  gallery_blocks: boolean;
  video_blocks: boolean;
  music_blocks: boolean;
  booking_blocks: boolean;
  contact_forms: boolean;
  image_uploads: boolean;
  remove_branding: boolean;
  priority_support: boolean;
  [key: string]: boolean | number;
}

export interface Plan {
  id: number | string;
  code: string;
  slug: string;
  name: string;
  description: string | null;
  price_monthly_cents: number;
  price_yearly_cents: number;
  currency: string;
  features: PlanFeatures;
  is_active: boolean;
}

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused';

export interface Subscription {
  id: string | null;
  plan_id: number | string | null;
  plan_code: string;
  provider: string;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  status: SubscriptionStatus;
  billing_interval: 'monthly' | 'yearly';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_ends_at: string | null;
  grace_period_ends_at?: string | null;
  is_active?: boolean;
  plan: Plan | null;
}

export interface EntitlementsData {
  plan: Plan;
  subscription: Subscription | null;
  features: Record<string, boolean>;
  limits: Record<string, number | null>;
  usage: Record<string, number>;
  remaining: Record<string, number | null>;
}
