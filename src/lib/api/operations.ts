import { apiClient } from './client';
import type {
  FailedJobsResponse,
  OperationalMetricsResponse,
  OperationsHealthResponse,
  QueueHealthResponse,
  ScheduledTasksResponse,
} from '@/types/operations';

/**
 * Get detailed operations health status (Admin-only).
 */
export async function getAdminHealth(): Promise<OperationsHealthResponse> {
  return apiClient.get<OperationsHealthResponse>('/admin/operations/health');
}

/**
 * Get background queue metrics and health (Admin-only).
 */
export async function getAdminQueue(): Promise<QueueHealthResponse> {
  return apiClient.get<QueueHealthResponse>('/admin/operations/queue');
}

/**
 * Get scheduled tasks execution history and monitoring (Admin-only).
 */
export async function getAdminScheduler(): Promise<ScheduledTasksResponse> {
  return apiClient.get<ScheduledTasksResponse>('/admin/operations/scheduler');
}

/**
 * Get aggregated operational system metrics (Admin-only).
 */
export async function getAdminMetrics(): Promise<OperationalMetricsResponse> {
  return apiClient.get<OperationalMetricsResponse>('/admin/operations/metrics');
}

/**
 * Refresh operational metrics immediately (Admin-only).
 */
export async function refreshAdminMetrics(): Promise<OperationalMetricsResponse> {
  return apiClient.post<OperationalMetricsResponse>('/admin/operations/metrics/refresh');
}

/**
 * Get paginated list of failed jobs (Admin-only).
 */
export async function getFailedJobs(params?: {
  page?: number;
  per_page?: number;
}): Promise<FailedJobsResponse> {
  return apiClient.get<FailedJobsResponse>('/admin/operations/failed-jobs', {
    params: params as Record<string, string>,
  });
}

/**
 * Retry a specific failed job (Admin-only).
 */
export async function retryFailedJob(id: string): Promise<{ job_id: string; retried: boolean }> {
  return apiClient.post<{ job_id: string; retried: boolean }>(`/admin/operations/failed-jobs/${id}/retry`);
}

/**
 * Retry all failed jobs (Admin-only).
 */
export async function retryAllFailedJobs(): Promise<{ retried_count: number }> {
  return apiClient.post<{ retried_count: number }>('/admin/operations/failed-jobs/retry-all');
}

/**
 * Permanently discard a specific failed job (Admin-only).
 */
export async function discardFailedJob(id: string): Promise<{ job_id: string; discarded: boolean }> {
  return apiClient.delete<{ job_id: string; discarded: boolean }>(`/admin/operations/failed-jobs/${id}`);
}

/**
 * Flush all failed jobs permanently (Admin-only).
 */
export async function flushFailedJobs(): Promise<{ flushed: boolean }> {
  return apiClient.post<{ flushed: boolean }>('/admin/operations/failed-jobs/flush');
}
