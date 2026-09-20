'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

import { DigicardoLogo } from '@/components/ui/DigicardoLogo';

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <DigicardoLogo size="md" wordmarkClassName="text-white" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/50 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-bold text-slate-100">Account Deleted</h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Your account and all associated profiles, custom domains, and content blocks have been permanently scheduled for deletion.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Thank you for being part of the Digicardo creator community.
          </p>

          <div className="mt-8 pt-4 border-t border-slate-800">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 w-full"
            >
              Return to Homepage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
