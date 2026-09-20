// Types for Phase 17 — Production Reliability, Background Jobs & Observability

export interface HealthCheckComponent {
  status: 'healthy' | 'degraded' | 'unhealthy' | string;
  latency_ms?: number;
  details?: string;
  pending_jobs?: number;
  failed_jobs?: number;
}

export interface OperationsHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy' | string;
  timestamp: string;
  php_version: string;
  laravel_version: string;
  environment: string;
  checks: Record<string, HealthCheckComponent>;
}

export interface QueueBreakdownItem {
  name: string;
  pending_jobs: number;
  status: 'healthy' | 'degraded' | 'critical' | string;
}

export interface QueueHealthResponse {
  status: 'healthy' | 'degraded' | 'critical' | string;
  pending_jobs: number;
  failed_jobs: number;
  failed_last_hour: number;
  oldest_pending_seconds: number;
  queues: QueueBreakdownItem[];
}

export interface FailedJobItem {
  id: string;
  uuid: string | null;
  connection: string;
  queue: string;
  name: string;
  failed_at: string | null;
  exception_preview: string;
}

export interface FailedJobsPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

export interface FailedJobsResponse {
  items: FailedJobItem[];
  pagination: FailedJobsPagination;
}

export interface ScheduledTaskItem {
  name: string;
  command: string;
  expression: string;
  frequency: string;
  last_run_at: string | null;
  last_duration_seconds: number | null;
  status: 'healthy' | 'pending' | 'running' | 'failed' | 'delayed' | string;
  next_due_at: string | null;
}

export interface ScheduledTasksResponse {
  tasks: ScheduledTaskItem[];
}

export interface OperationalMetricsUsers {
  total: number;
  verified: number;
  unverified: number;
  new_last_24h: number;
  new_last_7d: number;
}

export interface OperationalMetricsProfiles {
  total: number;
  published: number;
}

export interface OperationalMetricsDomains {
  total: number;
  active: number;
  pending: number;
}

export interface OperationalMetricsSubscriptions {
  active: number;
  pro: number;
  business: number;
  in_grace_period: number;
}

export interface OperationalMetricsQueues {
  status: string;
  pending_jobs: number;
  failed_jobs: number;
}

export interface OperationalMetricsResponse {
  users: OperationalMetricsUsers;
  profiles: OperationalMetricsProfiles;
  domains: OperationalMetricsDomains;
  subscriptions: OperationalMetricsSubscriptions;
  queues: OperationalMetricsQueues;
  media: { total_items: number };
  security: { events_last_24h: number };
  computed_at: string;
}
