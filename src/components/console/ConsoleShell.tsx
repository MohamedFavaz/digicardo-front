"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut, MoreHorizontal, X, type LucideIcon } from "lucide-react";
import { TapGlyph } from "@/components/ui/DigicardoLogo";
import { BrandLoader } from "@/components/ui/BrandLoader";
import { nestlyThemeClass } from "@/lib/fonts/nestly";
import { NestlyConsoleSidebar } from "./NestlyConsoleSidebar";
import {
  UserAvatar,
  isSidebarItemActive,
  type SidebarNavGroup,
  type SidebarNavItem,
} from "@/components/shell/AppSidebar";
import { cn } from "@/lib/utils";
// Tracks API calls so "Open as customer" / "Customize card" can switch accounts without a stale cookie.
import "@/lib/auth/switch-account";

/**
 * Shell for the admin console and the agent portal: the shared AppSidebar on desktop,
 * a bottom tab bar plus a "More" sheet on phones.
 */

export type ConsoleNavItem = SidebarNavItem;
export type ConsoleNavGroup = SidebarNavGroup;
export const isConsoleItemActive = isSidebarItemActive;

export interface ConsoleShellProps {
  children: React.ReactNode;
  /** Shown next to the logo, e.g. "Admin" or "Partner". */
  role: string;
  homeHref: string;
  nav: ConsoleNavGroup[];
  /** Pinned at the bottom of the sidebar (e.g. Settings). */
  footerNav?: ConsoleNavItem[];
  /** Main call to action (e.g. "New card"). */
  primaryAction?: { label: string; href: string; icon: LucideIcon };
  /** Extra content under the logo (e.g. the agent's card credits). */
  sidebarExtra?: React.ReactNode;
  user: { name: string; email?: string; avatarUrl?: string | null };
  accountLinks?: { label: string; href: string; icon: LucideIcon }[];
  onSignOut: () => Promise<void> | void;
}

function MobileNavList({ nav, footerNav, pathname, onNavigate }: { nav: ConsoleNavGroup[]; footerNav: ConsoleNavItem[]; pathname: string | null; onNavigate: () => void }) {
  const row = (item: ConsoleNavItem) => {
    const Icon = item.icon;
    const active = isSidebarItemActive(pathname, item);
    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={false}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-11 items-center gap-3 rounded-lg px-3 text-[15px]",
          active ? "bg-[#EFECFD] font-semibold text-[#3D2AAD]" : "font-medium text-[#52525B] hover:bg-muted",
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-[#71717A]")} aria-hidden="true" />
        <span className="flex-1">{item.title}</span>
        {!!item.badge && item.badge > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">{item.badge}</span>}
      </Link>
    );
  };
  return (
    <>
      {nav.map((group, i) => (
        <div key={group.label ?? i} className={cn(i > 0 && "mt-4")}>
          {group.label && <p className="mb-1 px-3 text-xs font-medium text-[#A1A1AA]">{group.label}</p>}
          <div className="space-y-0.5">{group.items.map(row)}</div>
        </div>
      ))}
      {footerNav.length > 0 && (
        <>
          <div className="mx-3 my-3 h-px bg-border" />
          <div className="space-y-0.5">{footerNav.map(row)}</div>
        </>
      )}
    </>
  );
}

export function ConsoleShell({
  children,
  role,
  homeHref,
  nav,
  footerNav = [],
  primaryAction,
  sidebarExtra,
  user,
  accountLinks = [],
  onSignOut,
}: ConsoleShellProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => setMoreOpen(false), [pathname]);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setSigningOut(false);
    }
  };

  const allItems = [...nav.flatMap((g) => g.items), ...footerNav];
  const mobileItems = allItems.filter((i) => i.mobile).slice(0, 4);
  const moreActive = !mobileItems.some((i) => isSidebarItemActive(pathname, i));
  const PrimaryIcon = primaryAction?.icon;

  return (
    // Nestly look (shared with the owner dashboard): warm canvas with a sage wash at the top.
    <div
      className={cn(
        nestlyThemeClass,
        "flex min-h-screen flex-col bg-[#F3F2EE] bg-[linear-gradient(180deg,#CBD5B1_0px,#D9E0C6_140px,#EAEBE0_300px,#F3F2EE_460px)] bg-no-repeat text-foreground antialiased md:flex-row"
      )}
    >
      <NestlyConsoleSidebar
        homeHref={homeHref}
        role={role}
        context={sidebarExtra}
        primaryAction={primaryAction}
        nav={nav}
        footerNav={footerNav}
        user={{ name: user.name, subtitle: user.email, avatarUrl: user.avatarUrl }}
        menu={accountLinks}
        onSignOut={onSignOut}
      />

      {/* Phone header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#F3F2EE]/70 px-4 backdrop-blur-md md:hidden">
        <Link href={homeHref} prefetch={false} className="flex items-center gap-2" aria-label="Digicardo home">
          <span className="flex items-center gap-1.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#343C22]"><TapGlyph className="h-4 w-4" color="#FFFFFF" /></span><span className="text-[17px] font-medium tracking-tight text-[#121212]">Digicardo</span></span>
          <span className="rounded-full border border-white bg-white/70 px-2 py-0.5 text-xs font-medium text-[#5E6054]">{role}</span>
        </Link>
        {primaryAction && PrimaryIcon && (
          <Link href={primaryAction.href} prefetch={false} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#343C22] px-3.5 text-sm font-medium text-white">
            <PrimaryIcon className="h-4 w-4" aria-hidden="true" />
            {primaryAction.label}
          </Link>
        )}
      </header>

      <main className="min-w-0 flex-1 pb-28 md:pb-0">{children}</main>

      {/* Phone bottom bar */}
      <nav aria-label="Main" className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-40 flex gap-1 rounded-full bg-[#343C22] p-1.5 shadow-[0_18px_36px_-14px_rgba(52,60,34,0.75)] md:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = isSidebarItemActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={cn("relative flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px]", active ? "bg-white font-semibold text-[#343C22]" : "font-medium text-white/75")}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="max-w-full truncate px-1">{item.mobileTitle ?? item.title}</span>
              {!!item.badge && item.badge > 0 && <span className="absolute right-[26%] top-2 h-2 w-2 rounded-full bg-[#B0C08F]" aria-hidden="true" />}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn("flex h-[54px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px]", moreActive || moreOpen ? "bg-white font-semibold text-[#343C22]" : "font-medium text-white/75")}
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          More
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-float">
            <div className="mb-3 flex items-center gap-3">
              <UserAvatar name={user.name} url={user.avatarUrl} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-foreground">{user.name}</p>
                {user.email && <p className="truncate text-sm text-muted-foreground">{user.email}</p>}
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
            {sidebarExtra && <div className="mb-3">{sidebarExtra}</div>}
            <MobileNavList nav={nav} footerNav={footerNav} pathname={pathname} onNavigate={() => setMoreOpen(false)} />
            <div className="mx-3 my-3 h-px bg-border" />
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[15px] font-medium text-destructive hover:bg-destructive/5"
            >
              {signingOut ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <LogOut className="h-5 w-5" aria-hidden="true" />}
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Full-screen loader while a console checks the session. */
export function ConsoleLoading({ label = "Checking your session…" }: { label?: string }) {
  return <BrandLoader label={label} />;
}
