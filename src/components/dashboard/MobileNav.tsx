"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useShellProfile } from "@/lib/hooks/use-shell-profile";
import { cn } from "@/lib/utils";
import { TapGlyph } from "@/components/ui/DigicardoLogo";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { MOBILE_MORE, MOBILE_TABS, isNavItemActive } from "./nav-config";
import { useUnreadCount } from "@/lib/hooks/use-unread-count";
import { PublicLinkPill } from "./TopBar";
import { ChevronRight, ExternalLink, LogOut, MoreHorizontal, ShieldCheck, X } from "lucide-react";

/** Phone header: logo, "View" card link and notifications. */
export function MobileTopHeader() {
  const { username, publicUrl } = useShellProfile();

  return (
    <header className="flex h-14 items-center justify-between bg-[#F3F2EE]/70 px-4 backdrop-blur-md md:hidden">
      <Link href="/dashboard" prefetch={false} aria-label="Digicardo home">
        <span className="flex items-center gap-1.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#343C22]"><TapGlyph className="h-4 w-4" color="#FFFFFF" /></span><span className="text-[17px] font-medium tracking-tight text-[#121212]">Digicardo</span></span>
      </Link>
      <div className="flex items-center gap-1.5">
        {username && (
          <Link
            href={publicUrl ?? `/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-sm font-semibold text-foreground"
          >
            View card
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
        <NotificationBell align="right" />
      </div>
    </header>
  );
}

/**
 * Phone bottom bar: the four most used places + "More" (design system v6, 44px+ targets).
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile } = useShellProfile();
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => setMoreOpen(false), [pathname]);

  React.useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  // Four tabs fit the bottom bar; Analytics, NFC card and Settings live under "More".
  const unread = useUnreadCount();
  const primary = MOBILE_TABS;
  const moreItems = MOBILE_MORE;
  const moreActive = moreItems.some((item) => isNavItemActive(pathname, item));
  const displayName = profile?.display_name || user?.name || "Your account";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/login");
    } catch {
      setIsLoggingOut(false);
    }
  };

  const tabClass = (active: boolean) =>
    cn(
      "flex min-h-[54px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] transition-colors",
      active ? "bg-white font-semibold text-[#343C22]" : "font-medium text-white/75"
    );

  return (
    <>
      <nav
        aria-label="Main"
        className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-40 flex gap-1 rounded-full bg-[#343C22] p-1.5 shadow-[0_18px_36px_-14px_rgba(52,60,34,0.75)] md:hidden"
      >
        {primary.map((item) => {
          const Icon = item.icon;
          const active = isNavItemActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={tabClass(active)}
            >
              <span className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.unread && unread > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 min-w-[18px] rounded-full bg-[#B0C08F] px-1 text-center text-[10px] font-bold leading-[18px] text-[#121212] ring-2 ring-[#343C22]">
                    {unread > 9 ? "9+" : unread}
                    <span className="sr-only"> unread</span>
                  </span>
                )}
              </span>
              {item.mobileTitle ?? item.title}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className={tabClass(moreActive || moreOpen)}
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          More
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden" role="dialog" aria-modal="true" aria-label="More">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-float">
            <div className="mb-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
                {user?.email && <p className="truncate text-sm text-muted-foreground">{user.email}</p>}
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#52525B] hover:bg-muted"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <PublicLinkPill className="mb-4 w-full justify-between" />

            <div className="space-y-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "flex min-h-[52px] items-center gap-3 rounded-lg px-3",
                      active ? "bg-[#EFECFD] font-semibold text-[#3D2AAD]" : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="flex-1 text-[15px]">{item.title}</span>
                    <ChevronRight className="h-4 w-4 text-[#A1A1AA]" aria-hidden="true" />
                  </Link>
                );
              })}
              {user?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  prefetch={false}
                  className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-foreground hover:bg-muted"
                >
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  <span className="flex-1 text-[15px]">Admin console</span>
                  <ChevronRight className="h-4 w-4 text-[#A1A1AA]" aria-hidden="true" />
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-input text-[15px] font-semibold text-destructive hover:bg-[#FDECEC] disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function MobileNav() {
  return (
    <>
      <MobileTopHeader />
      <MobileBottomNav />
    </>
  );
}
