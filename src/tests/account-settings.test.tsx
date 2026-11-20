import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AccountSettingsPage from '@/app/(app)/dashboard/settings/account/page';
import { SettingsSkeleton } from '@/components/settings/SettingsSkeleton';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('AccountSettingsPage Component', () => {
  // Static rendering never runs effects, so the page shows its loading skeleton until
  // account data arrives. Section content is covered when the page is rebuilt (Phase 6).
  it('shows the settings loading skeleton before account data arrives', () => {
    const html = renderToStaticMarkup(<AccountSettingsPage />);

    expect(html).toBe(renderToStaticMarkup(<SettingsSkeleton />));
  });
});
