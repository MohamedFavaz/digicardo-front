'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle2, XCircle, Send, Loader2 } from 'lucide-react';
import { DigicardoLogo } from '@/components/ui/DigicardoLogo';
import { resendVerificationEmail } from '@/lib/api/password-reset';
import { apiClient } from '@/lib/api/client';

type VerifyStatus = 'idle' | 'verifying' | 'success' | 'error' | 'already_verified';
type ResendStatus = 'idle' | 'sending' | 'sent' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [verifyStatus, setVerifyStatus] = React.useState<VerifyStatus>('idle');
  const [resendStatus, setResendStatus] = React.useState<ResendStatus>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Parse URL params from verification link: /verify-email?id=...&hash=...&expires=...&signature=...
  const id = searchParams.get('id');
  const hash = searchParams.get('hash');
  const expires = searchParams.get('expires');
  const signature = searchParams.get('signature');

  const hasVerifyParams = !!(id && hash && expires && signature);

  // Auto-verify on mount if params present
  React.useEffect(() => {
    if (!hasVerifyParams) return;

    setVerifyStatus('verifying');
    const qs = new URLSearchParams({
      expires: expires!,
      signature: signature!,
    });

    apiClient
      .get<{ verified: boolean; email: string }>(`/auth/email/verify/${id}/${hash}?${qs}`)
      .then(() => setVerifyStatus('success'))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Verification failed.';
        setErrorMessage(msg);
        setVerifyStatus('error');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      await resendVerificationEmail();
      setResendStatus('sent');
    } catch {
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <DigicardoLogo size="md" wordmarkClassName="text-white" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/50">
          {/* Verifying state */}
          {verifyStatus === 'verifying' && (
            <div className="text-center py-6">
              <Loader2 className="mx-auto h-10 w-10 text-indigo-400 animate-spin" />
              <h1 className="mt-4 text-lg font-bold text-slate-100">Verifying your email…</h1>
              <p className="mt-1 text-sm text-slate-500">Just a moment, please.</p>
            </div>
          )}

          {/* Success */}
          {verifyStatus === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/50 border border-emerald-800">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold text-slate-100">Email verified!</h1>
              <p className="mt-2 text-sm text-slate-400">Your email address has been successfully verified.</p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Go to Dashboard →
              </Link>
            </div>
          )}

          {/* Error */}
          {verifyStatus === 'error' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-900/50 border border-red-800">
                <XCircle className="h-7 w-7 text-red-400" />
              </div>
              <h1 className="text-xl font-bold text-slate-100">Verification failed</h1>
              <p className="mt-2 text-sm text-slate-400">
                {errorMessage?.includes('expired')
                  ? 'This verification link has expired. Please request a new one.'
                  : 'This verification link is invalid. Please request a new one.'}
              </p>
              <button
                id="resend-verification-button"
                onClick={handleResend}
                disabled={resendStatus === 'sending' || resendStatus === 'sent'}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                {resendStatus === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
                {resendStatus === 'sent' ? '✓ Email sent!' : 'Resend verification email'}
              </button>
            </div>
          )}

          {/* Idle — no params: show instructions */}
          {verifyStatus === 'idle' && !hasVerifyParams && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-900/50 border border-indigo-800">
                <Mail className="h-7 w-7 text-indigo-400" />
              </div>
              <h1 className="text-xl font-bold text-slate-100">Verify your email</h1>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                We sent a verification link to your email address. Click the link in that email to verify your account.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Check your spam folder if you don&apos;t see it in your inbox.
              </p>

              <div className="mt-6">
                {resendStatus === 'sent' ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Verification email sent!
                  </div>
                ) : (
                  <button
                    id="resend-verification-idle-button"
                    onClick={handleResend}
                    disabled={resendStatus === 'sending'}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:opacity-50"
                  >
                    {resendStatus === 'sending' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Resend verification email
                  </button>
                )}
                {resendStatus === 'error' && (
                  <p className="mt-2 text-xs text-red-400">Failed to send email. Please try again.</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
