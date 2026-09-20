import { apiClient } from './client';
import type {
  AccountSession,
  SecurityEventsResponse,
} from '@/types/security';

/**
 * Get all active sessions for authenticated user.
 */
export async function getSessions(): Promise<{ items: AccountSession[] }> {
  return apiClient.get<{ items: AccountSession[] }>('/account/sessions');
}

/**
 * Revoke an individual session.
 */
export async function revokeSession(id: string): Promise<{ revoked: boolean; id: string }> {
  return apiClient.delete<{ revoked: boolean; id: string }>(`/account/sessions/${id}`);
}

/**
 * Revoke all other active sessions.
 */
export async function revokeOtherSessions(): Promise<{ revoked_count: number }> {
  return apiClient.post<{ revoked_count: number }>('/account/sessions/revoke-others');
}

/**
 * Get paginated security activity events.
 */
export async function getSecurityEvents(params?: {
  page?: number;
  per_page?: number;
}): Promise<SecurityEventsResponse> {
  return apiClient.get<SecurityEventsResponse>('/account/security-events', {
    params: params as Record<string, string>,
  });
}
