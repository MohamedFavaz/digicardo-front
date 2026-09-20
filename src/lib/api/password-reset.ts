import { apiClient } from './client';

/**
 * Request a password reset link.
 * Always returns success to prevent user enumeration.
 */
export async function forgotPassword(email: string): Promise<{ queued: boolean }> {
  return apiClient.post<{ queued: boolean }>('/auth/forgot-password', { email });
}

/**
 * Reset user password with token from email.
 */
export async function resetPassword(payload: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<{ reset: boolean }> {
  return apiClient.post<{ reset: boolean }>('/auth/reset-password', payload);
}

/**
 * Resend email verification notification for the authenticated user.
 */
export async function resendVerificationEmail(): Promise<{ sent: boolean }> {
  return apiClient.post<{ sent: boolean }>('/auth/email/verification-notification');
}
