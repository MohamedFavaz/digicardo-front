import { apiClient } from './client';
import type {
  AccountUser,
  ChangePasswordPayload,
  ConfirmPasswordPayload,
  DeleteAccountPayload,
  UpdateAccountPayload,
} from '@/types/account';

/**
 * Get authenticated user's account details.
 */
export async function getAccount(): Promise<AccountUser> {
  return apiClient.get<AccountUser>('/account');
}

/**
 * Update authenticated user's account details.
 */
export async function updateAccount(payload: UpdateAccountPayload): Promise<AccountUser> {
  return apiClient.patch<AccountUser>('/account', payload);
}

/**
 * Change account password.
 */
export async function changePassword(payload: ChangePasswordPayload): Promise<{ changed: boolean }> {
  return apiClient.post<{ changed: boolean }>('/account/change-password', payload);
}

/**
 * Confirm password for recent authentication step-up.
 */
export async function confirmRecentAuth(password: string): Promise<{ confirmed: boolean }> {
  return apiClient.post<{ confirmed: boolean }>('/account/confirm-password', { password } as ConfirmPasswordPayload);
}

/**
 * Permanently delete user account.
 */
export async function deleteAccount(payload: DeleteAccountPayload): Promise<void> {
  return apiClient.delete<void>('/account', { data: payload });
}
