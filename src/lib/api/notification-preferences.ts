import { apiClient } from './client';
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesPayload,
} from '@/types/notifications';

/**
 * Get authenticated user's notification preferences.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return apiClient.get<NotificationPreferences>('/profile/notification-preferences');
}

/**
 * Update authenticated user's notification preferences.
 */
export async function updateNotificationPreferences(
  payload: UpdateNotificationPreferencesPayload
): Promise<NotificationPreferences> {
  return apiClient.patch<NotificationPreferences>('/profile/notification-preferences', payload);
}
