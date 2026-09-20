import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAccount,
  updateAccount,
  changePassword,
  confirmRecentAuth,
  deleteAccount,
} from '@/lib/api/account';

describe('Account API Client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches account details successfully', async () => {
    const mockAccount = {
      id: '01HZMD5R4GKJA7TFP4QYX8VBJN',
      name: 'Alice Developer',
      email: 'alice@example.com',
      role: 'user',
      status: 'active',
      email_verified_at: '2026-08-15T12:00:00Z',
      is_email_verified: true,
      created_at: '2026-08-15T12:00:00Z',
      updated_at: '2026-08-15T12:00:00Z',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: mockAccount,
      }),
    } as unknown as Response);

    const account = await getAccount();
    expect(account.id).toBe('01HZMD5R4GKJA7TFP4QYX8VBJN');
    expect(account.name).toBe('Alice Developer');
    expect(account.is_email_verified).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('updates account information', async () => {
    const updatedUser = {
      id: '01HZMD5R4GKJA7TFP4QYX8VBJN',
      name: 'Alice Updated',
      email: 'alice.updated@example.com',
      role: 'user',
      status: 'active',
      email_verified_at: null,
      is_email_verified: false,
      created_at: '2026-08-15T12:00:00Z',
      updated_at: '2026-08-16T12:00:00Z',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: updatedUser,
      }),
    } as unknown as Response);

    const result = await updateAccount({
      name: 'Alice Updated',
      email: 'alice.updated@example.com',
    });

    expect(result.name).toBe('Alice Updated');
    expect(result.is_email_verified).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Alice Updated',
          email: 'alice.updated@example.com',
        }),
      })
    );
  });

  it('handles password changes', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { changed: true },
      }),
    } as unknown as Response);

    const res = await changePassword({
      current_password: 'OldPassword123!',
      password: 'NewPassword456!',
      password_confirmation: 'NewPassword456!',
    });

    expect(res.changed).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account/change-password'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('handles recent authentication confirmation', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { confirmed: true },
      }),
    } as unknown as Response);

    const res = await confirmRecentAuth('CurrentPass123!');
    expect(res.confirmed).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account/confirm-password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ password: 'CurrentPass123!' }),
      })
    );
  });

  it('handles account deletion', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: null,
      }),
    } as unknown as Response);

    await deleteAccount({
      current_password: 'Password123!',
      confirmation: 'DELETE MY ACCOUNT',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account'),
      expect.objectContaining({
        method: 'DELETE',
        body: JSON.stringify({
          current_password: 'Password123!',
          confirmation: 'DELETE MY ACCOUNT',
        }),
      })
    );
  });
});
