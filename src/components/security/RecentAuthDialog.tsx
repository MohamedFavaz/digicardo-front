'use client';

import * as React from 'react';
import { ShieldCheck, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { confirmRecentAuth } from '@/lib/api/account';

interface RecentAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function RecentAuthDialog({
  isOpen,
  onClose,
  onSuccess,
  title = 'Confirm Password',
  description = 'For your security, please confirm your password to perform this sensitive action.',
}: RecentAuthDialogProps) {
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await confirmRecentAuth(password);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Incorrect password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recent-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/60 ring-1 ring-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 id="recent-auth-title" className="text-base font-bold text-slate-100">
              {title}
            </h2>
            <p className="text-xs text-slate-400 leading-snug">{description}</p>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-800/50 bg-red-950/30 px-3.5 py-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recent-auth-password" className="mb-1.5 block text-xs font-medium text-slate-300">
              Current Password
            </label>
            <div className="relative">
              <input
                id="recent-auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                autoFocus
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Confirm & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
