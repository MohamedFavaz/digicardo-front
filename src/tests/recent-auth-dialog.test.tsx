import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecentAuthDialog } from '@/components/security/RecentAuthDialog';

describe('RecentAuthDialog Component', () => {
  it('does not render when isOpen is false', () => {
    const html = renderToStaticMarkup(
      <RecentAuthDialog
        isOpen={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(html).toBe('');
  });

  it('renders correctly when open', () => {
    const html = renderToStaticMarkup(
      <RecentAuthDialog
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(html).toContain('Confirm Password');
    expect(html).toContain('Current Password');
    expect(html).toContain('Confirm &amp; Continue');
    expect(html).toContain('Cancel');
  });

  it('renders with custom title and description', () => {
    const html = renderToStaticMarkup(
      <RecentAuthDialog
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        title="Custom Security Confirmation"
        description="Please confirm before deleting your account."
      />
    );

    expect(html).toContain('Custom Security Confirmation');
    expect(html).toContain('Please confirm before deleting your account.');
  });
});
