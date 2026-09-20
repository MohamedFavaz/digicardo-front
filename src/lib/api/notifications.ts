import { apiClient } from './client';
import type {
  Notification,
  NotificationCategory,
  NotificationListResponse,
} from '@/types/notifications';

/**
 * Fetch paginated notifications for the authenticated user.
 */
export async function getNotifications(params?: {
  category?: NotificationCategory;
  unread_only?: boolean;
  per_page?: number;
  page?: number;
}): Promise<NotificationListResponse> {
  return apiClient.get<NotificationListResponse>('/notifications', { params: params as Record<string, string> });
}

/**
 * Get unread notifications count.
 */
export async function getUnreadCount(): Promise<{ count: number }> {
  return apiClient.get<{ count: number }>('/notifications/unread-count');
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(id: string): Promise<Notification> {
  return apiClient.patch<Notification>(`/notifications/${id}/read`);
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  return apiClient.patch<{ updated: number }>('/notifications/read-all');
}

/**
 * Delete a notification.
 */
export async function deleteNotification(id: string): Promise<void> {
  return apiClient.delete<void>(`/notifications/${id}`);
}
