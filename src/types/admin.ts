export interface AdminOverviewMetrics {
  users: {
    total: number;
    active: number;
    suspended: number;
  };
  profiles: {
    total: number;
    under_review: number;
    restricted_or_suspended: number;
  };
  reports: {
    open: number;
    investigating: number;
    total_pending: number;
  };
}

export interface AdminActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ModerationActionItem {
  id: string;
  actor_id: string;
  actor?: AdminActor;
  target_type: "user" | "profile" | "report";
  target_id: string;
  action_type: string;
  reason: string | null;
  internal_notes: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface AdminOverviewResponse {
  metrics: AdminOverviewMetrics;
  recent_actions: ModerationActionItem[];
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "suspended" | "banned";
  email_verified_at: string | null;
  active_sessions_count?: number;
  created_at: string;
  updated_at: string;
  profile?: {
    id: string;
    username: string;
    display_name: string | null;
    is_public: boolean;
    moderation_status: string;
  } | null;
}

export interface AdminUserDetails {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    is_email_verified: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  profile: {
    id: string;
    username: string;
    display_name: string | null;
    is_public: boolean;
    moderation_status: string;
    blocks_count: number;
    domains_count: number;
  } | null;
  subscription: {
    plan_name: string;
    plan_code: string;
    status: string;
    current_period_end: string | null;
  } | null;
  moderation_history: ModerationActionItem[];
  audit_logs: AdminAuditLogItem[];
}

export interface AdminProfileItem {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  is_public: boolean;
  moderation_status: "active" | "under_review" | "restricted" | "suspended";
  created_at: string;
  blocks_count?: number;
  domains_count?: number;
  open_reports_count?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}

export interface AdminProfileDetails {
  profile: {
    id: string;
    user_id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    template_id: string;
    is_public: boolean;
    moderation_status: "active" | "under_review" | "restricted" | "suspended";
    moderation_reason: string | null;
    moderation_notes: string | null;
    moderated_at: string | null;
    moderated_by: string | null;
    created_at: string;
    updated_at: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
  };
  blocks: Array<{
    id: string;
    type: string;
    config: Record<string, unknown>;
    sort_order: number;
    is_visible: boolean;
  }>;
  domains: Array<{
    id: string;
    domain: string;
    status: string;
    is_primary: boolean;
  }>;
  reports: AbuseReportItem[];
  moderation_history: ModerationActionItem[];
}

export interface AbuseReportItem {
  id: string;
  profile_id: string;
  block_id: string | null;
  reporter_email: string | null;
  reason: "spam" | "phishing" | "impersonation" | "malicious_content" | "copyright" | "harassment" | "inappropriate_content" | "other";
  description: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  resolution_notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  profile?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    moderation_status: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
  block?: {
    id: string;
    type: string;
    config: Record<string, unknown>;
    sort_order: number;
  };
  resolver?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminAuditLogItem {
  id: string;
  actor_id: string;
  actor?: AdminActor;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: Record<string, unknown>;
  request_id: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
}
