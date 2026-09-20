import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AdminOperationsPage from '@/app/(app)/dashboard/admin/operations/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('@/lib/api/operations', () => ({
  getAdminHealth: vi.fn().mockResolvedValue({
    status: 'healthy',
    timestamp: '2026-08-16T12:00:00Z',
    php_version: '8.3.0',
    laravel_version: '11.0.0',
    environment: 'production',
    checks: {
      application: { status: 'healthy', details: 'Configured' },
      database: { status: 'healthy', latency_ms: 2.5 },
      cache: { status: 'healthy', latency_ms: 1.1 },
      queue: { status: 'healthy', pending_jobs: 0, failed_jobs: 0 },
      storage: { status: 'healthy', latency_ms: 0.8 },
    },
  }),
  getAdminQueue: vi.fn().mockResolvedValue({
    status: 'healthy',
    pending_jobs: 5,
    failed_jobs: 1,
    failed_last_hour: 0,
    oldest_pending_seconds: 15,
    queues: [{ name: 'default', pending_jobs: 5, status: 'healthy' }],
  }),
  getAdminScheduler: vi.fn().mockResolvedValue({
    tasks: [],
  }),
  getAdminMetrics: vi.fn().mockResolvedValue({
    users: { total: 150, verified: 140, unverified: 10, new_last_24h: 12, new_last_7d: 45 },
    profiles: { total: 120, published: 110 },
    domains: { total: 15, active: 12, pending: 3 },
    subscriptions: { active: 45, pro: 35, business: 10, in_grace_period: 0 },
    queues: { status: 'healthy', pending_jobs: 5, failed_jobs: 1 },
    media: { total_items: 85 },
    security: { events_last_24h: 30 },
    computed_at: '2026-08-16T12:00:00Z',
  }),
  getFailedJobs: vi.fn().mockResolvedValue({
    items: [],
    pagination: { current_page: 1, last_page: 1, per_page: 10, total: 0, has_more: false },
  }),
  retryFailedJob: vi.fn(),
  retryAllFailedJobs: vi.fn(),
  discardFailedJob: vi.fn(),
  flushFailedJobs: vi.fn(),
}));

describe('AdminOperationsPage Component', () => {
  it('renders operations dashboard container and sections', () => {
    const html = renderToStaticMarkup(<AdminOperationsPage />);

    expect(html).toContain('Operations &amp; Reliability');
    expect(html).toContain('System Readiness Probes');
    expect(html).toContain('Queue Processing &amp; Reliability');
    expect(html).toContain('Scheduled Maintenance Tasks');
    expect(html).toContain('Refresh Status');
  });
});
