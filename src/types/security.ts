// Security & Session types for Phase 15 — Account Security & Management

export interface AccountSession {
  id: string;
  device_name: string;
  browser: string;
  platform: string;
  last_activity_at: string | null;
  created_at: string;
  is_current: boolean;
}

export type SecurityEventType =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_changed'
  | 'password_reset'
  | 'email_verified'
  | 'email_changed'
  | 'session_revoked'
  | 'all_other_sessions_revoked'
  | 'account_details_updated'
  | 'account_deletion_requested'
  | 'account_deleted'
  | 'recent_auth_confirmed';

export interface AccountSecurityEvent {
  id: string;
  event_type: SecurityEventType | string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SecurityEventsPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

export interface SecurityEventsResponse {
  items: AccountSecurityEvent[];
  pagination: SecurityEventsPagination;
}
