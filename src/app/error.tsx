"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors safely with timestamp and digest
    console.error("[Digicardo Global Error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
    });

    // Dispatch to external telemetry provider (e.g. Sentry / Datadog) if available
    if (typeof window !== "undefined" && (window as unknown as { Sentry?: { captureException: (err: unknown) => void } }).Sentry) {
      (window as unknown as { Sentry: { captureException: (err: unknown) => void } }).Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 rounded-2xl border bg-card p-8 shadow-card">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center font-black text-xl">
          !
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-[11px] font-mono text-muted-foreground bg-muted/50 p-2 rounded-lg border border-border">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
