import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAdminHealth,
  getAdminQueue,
  getAdminScheduler,
  getAdminMetrics,
  getFailedJobs,
  retryFailedJob,
  retryAllFailedJobs,
  discardFailedJob,
  flushFailedJobs,
} from '@/lib/api/operations';

describe('Admin Operations API Client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  function mockJsonResponse(data: unknown, status = 200) {
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: {
        get: (header: string) => (header.toLowerCase() === 'content-type' ? 'application/json' : null),
      },
      json: async () => ({ success: true, data }),
    };
  }

  it('fetches admin operational health', async () => {
    const mockHealth = {
      status: 'healthy',
      timestamp: '2026-08-16T12:00:00Z',
      php_version: '8.3.0',
      laravel_version: '11.0.0',
      environment: 'production',
      checks: {
        application: { status: 'healthy', details: 'OK' },
        database: { status: 'healthy', latency_ms: 1.2 },
      },
    };

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse(mockHealth));

    const res = await getAdminHealth();
    expect(res.status).toBe('healthy');
    expect(res.checks.database.latency_ms).toBe(1.2);
  });

  it('fetches queue health metrics', async () => {
    const mockQueue = {
      status: 'healthy',
      pending_jobs: 3,
      failed_jobs: 0,
      failed_last_hour: 0,
      oldest_pending_seconds: 12,
      queues: [{ name: 'default', pending_jobs: 3, status: 'healthy' }],
    };

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse(mockQueue));

    const res = await getAdminQueue();
    expect(res.pending_jobs).toBe(3);
    expect(res.queues[0].name).toBe('default');
  });

  it('fetches scheduled tasks', async () => {
    const mockTasks = {
      tasks: [
        {
          name: 'Queue Worker',
          command: 'queue:work',
          expression: '* * * * *',
          frequency: 'Every minute',
          last_run_at: '2026-08-16T12:00:00Z',
          last_duration_seconds: 0.5,
          status: 'healthy',
          next_due_at: '2026-08-16T12:01:00Z',
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse(mockTasks));

    const res = await getAdminScheduler();
    expect(res.tasks).toHaveLength(1);
    expect(res.tasks[0].status).toBe('healthy');
  });

  it('fetches operational metrics and failed jobs list', async () => {
    const mockMetrics = {
      users: { total: 100, verified: 90, unverified: 10, new_last_24h: 5, new_last_7d: 20 },
      profiles: { total: 80, published: 75 },
      domains: { total: 10, active: 8, pending: 2 },
      subscriptions: { active: 30, pro: 25, business: 5, in_grace_period: 0 },
      queues: { status: 'healthy', pending_jobs: 0, failed_jobs: 0 },
      media: { total_items: 50 },
      security: { events_last_24h: 15 },
      computed_at: '2026-08-16T12:00:00Z',
    };

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse(mockMetrics));
    const metrics = await getAdminMetrics();
    expect(metrics.users.total).toBe(100);

    const mockFailedJobs = {
      items: [],
      pagination: { current_page: 1, last_page: 1, per_page: 10, total: 0, has_more: false },
    };

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse(mockFailedJobs));
    const failedJobs = await getFailedJobs();
    expect(failedJobs.items).toEqual([]);
  });

  it('retries, retries all, discards, and flushes failed jobs', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse({ job_id: '123', retried: true }));
    const retryRes = await retryFailedJob('123');
    expect(retryRes.retried).toBe(true);

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse({ retried_count: 5 }));
    const retryAllRes = await retryAllFailedJobs();
    expect(retryAllRes.retried_count).toBe(5);

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse({ job_id: '123', discarded: true }));
    const discardRes = await discardFailedJob('123');
    expect(discardRes.discarded).toBe(true);

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse({ flushed: true }));
    const flushRes = await flushFailedJobs();
    expect(flushRes.flushed).toBe(true);
  });
});
