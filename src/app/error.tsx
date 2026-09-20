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
    // Log unexpected errors safely
    console.error("[Digicardo Global Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 rounded-xl border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or refresh the page.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
