"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useShellProfile } from "@/lib/hooks/use-shell-profile";
import { cn } from "@/lib/utils";
import { PAGE_TITLES } from "./nav-config";
import { Check, Copy, ExternalLink } from "lucide-react";

/** Copyable public link pill — shared by the top bar and the phone menu. */
export function PublicLinkPill({ className }: { className?: string }) {
  const { publicLinkLabel, publicUrl } = useShellProfile();
  const [copied, setCopied] = React.useState(false);

  if (!publicLinkLabel || !publicUrl) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link stays visible to copy by hand.
    }
  };

  return (
    <div className={cn("flex h-10 items-center overflow-hidden rounded-lg border border-border bg-card", className)}>
      <span className="flex min-w-0 items-center gap-2 px-3 text-sm text-foreground">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#16A34A]" aria-hidden="true" />
        <span className="truncate" title="Your card is live">{publicLinkLabel}</span>
      </span>
      <button
        type="button"
        onClick={copy}
        className="flex h-full items-center gap-1.5 border-l border-border bg-[#FAFAFA] px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

/**
 * Desktop top bar (design system v6): page title on the left; the card's public link,
 * "View card" and notifications on the right.
 */
export function TopBar({ className }: { className?: string }) {
  const pathname = usePathname() ?? "";
  const { username, publicUrl } = useShellProfile();

  const isHome = pathname === "/dashboard";
  const page = PAGE_TITLES[pathname];

  return (
    <header
      className={cn(
        "flex min-h-[76px] flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-transparent px-6 py-3 lg:px-8",
        className
      )}
    >
      {/* Home greets in the page itself, so its bar only carries the actions (like the reference). */}
      <div className="flex min-w-0 items-center gap-4">
        {!isHome && (
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-normal leading-tight tracking-tight text-[#121212]">{page?.title ?? "Dashboard"}</h1>
            {page?.subtitle && <p className="truncate text-sm text-muted-foreground">{page.subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {username && (
          <Link
            href={publicUrl ?? `/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white bg-white/80 px-4 text-sm font-medium text-[#121212] shadow-[0_6px_16px_-12px_rgba(52,60,34,0.6)] transition-colors hover:bg-white"
          >
            View card
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
        <NotificationBell align="right" />
      </div>
    </header>
  );
}
