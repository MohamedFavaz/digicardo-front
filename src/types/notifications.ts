// Notification types for Phase 14 — Digicardo Notifications & Communication System

export type NotificationCategory =
  | 'system'
  | 'security'
  | 'subscription'
  | 'domain'
  | 'contact'
  | 'profile'
  | 'marketing'
  | 'message';

export type NotificationType =
  | 'welcome'
  | 'email_verification'
  | 'password_reset'
  | 'login_alert'
  | 'subscription_started'
  | 'subscription_renewed'
  | 'subscription_payment_failed'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'domain_verified'
  | 'domain_failed'
  | 'contact_received'
  | 'system_alert'
  | 'admin_message'
  | 'agent_message';

/** Extra data on a message sent by an admin or an agent (category "message"). */
export interface MessageNotificationData {
  broadcast_id?: string;
  sender_name?: string;
  sender_role?: 'admin' | 'agent';
  link_url?: string | null;
}

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  data: Record<string, unknown>;
  read_at: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

export interface NotificationListResponse {
  items: Notification[];
  pagination: NotificationPagination;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  security_email_enabled: boolean;
  marketing_email_enabled: boolean;
  contact_email_enabled: boolean;
  subscription_email_enabled: boolean;
  domain_email_enabled: boolean;
  in_app_enabled: boolean;
  updated_at: string | null;
}

export interface UpdateNotificationPreferencesPayload {
  email_enabled?: boolean;
  marketing_email_enabled?: boolean;
  contact_email_enabled?: boolean;
  subscription_email_enabled?: boolean;
  domain_email_enabled?: boolean;
  in_app_enabled?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
