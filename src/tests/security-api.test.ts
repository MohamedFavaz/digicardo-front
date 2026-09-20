import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSessions,
  revokeSession,
  revokeOtherSessions,
  getSecurityEvents,
} from '@/lib/api/security';

describe('Security API Client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches active sessions list', async () => {
    const mockSessions = [
      {
        id: '01HZMD5R4GKJA7TFP4QYX8VBJN',
        device_name: 'MacBook Pro',
        browser: 'Google Chrome',
        platform: 'macOS',
        last_activity_at: '2026-08-16T12:00:00Z',
        created_at: '2026-08-15T12:00:00Z',
        is_current: true,
      },
      {
        id: '01HZMD5R4GKJA7TFP4QYX8VBJM',
        device_name: 'iPhone',
        browser: 'Apple Safari',
        platform: 'iOS',
        last_activity_at: '2026-08-16T11:00:00Z',
        created_at: '2026-08-14T12:00:00Z',
        is_current: false,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { items: mockSessions },
      }),
    } as unknown as Response);

    const res = await getSessions();
    expect(res.items.length).toBe(2);
    expect(res.items[0].is_current).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account/sessions'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('revokes an individual session', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { revoked: true, id: 'session_123' },
      }),
    } as unknown as Response);

    const res = await revokeSession('session_123');
    expect(res.revoked).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account/sessions/session_123'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('revokes all other sessions', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: { revoked_count: 3 },
      }),
    } as unknown as Response);

    const res = await revokeOtherSessions();
    expect(res.revoked_count).toBe(3);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/account/sessions/revoke-others'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('fetches paginated security events', async () => {
    const mockEvents = [
      {
        id: '01HZMD5R4GKJA7TFP4QYX8VBJN',
        event_type: 'login_success',
        description: 'Successful Login',
        metadata: { device: 'Desktop' },
        created_at: '2026-08-16T12:00:00Z',
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        data: {
          items: mockEvents,
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 1,
            has_more: false,
          },
        },
      }),
    } as unknown as Response);

    const res = await getSecurityEvents({ per_page: 10 });
    expect(res.items.length).toBe(1);
    expect(res.items[0].description).toBe('Successful Login');
  });
});
