import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AccountSettingsPage from '@/app/(app)/dashboard/settings/account/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('AccountSettingsPage Component', () => {
  it('renders all sections: Personal Info, Password & Security, Active Sessions, Security Activity, and Danger Zone', () => {
    const html = renderToStaticMarkup(<AccountSettingsPage />);

    expect(html).toContain('Account &amp; Security');
    expect(html).toContain('Personal Information');
    expect(html).toContain('Password &amp; Security');
    expect(html).toContain('Current Password');
    expect(html).toContain('New Password');
    expect(html).toContain('Active Sessions');
    expect(html).toContain('Security Activity');
    expect(html).toContain('Danger Zone');
    expect(html).toContain('Delete Account');
  });
});
