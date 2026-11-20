"use client";

import * as React from "react";
import { X } from "lucide-react";

/**
 * Bottom sheet used by card templates (share, QR, bank details, photos).
 *
 * On the live card it covers the viewport. In dashboard previews (`contained`) the card sits
 * inside a scrolling phone frame, so the sheet sticks to the bottom of that frame instead of
 * covering the whole dashboard.
 */
export function Sheet({
  open,
  title,
  onClose,
  contained = false,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  contained?: boolean;
  children: React.ReactNode;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="relative w-full max-w-[440px] rounded-t-[22px] bg-[var(--c-surface)] px-5 pb-6 pt-3 text-[var(--c-ink)] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] outline-none"
    >
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--c-border-strong)]" aria-hidden="true" />
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-[17px] font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--c-ink2)] transition-colors hover:bg-[var(--c-soft)]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto">{children}</div>
    </div>
  );

  if (contained) {
    return (
      <div className="sticky bottom-0 z-30 h-0">
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-x-0 bottom-0 h-[2400px] cursor-default bg-black/40"
          />
          {panel}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
      />
      {panel}
    </div>
  );
}
