"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, Loader2, LogOut, PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import { DigicardoLogo, LogoMark } from "@/components/ui/DigicardoLogo";
import { cn } from "@/lib/utils";

/**
 * The one desktop sidebar used by the owner app, the admin console and the agent portal.
 * Expanded (256px) or collapsed to icons (72px); the choice is remembered per browser.
 */

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Only active on an exact match. */
  exact?: boolean;
  /** Extra route prefixes that mark this item active. */
  match?: string[];
  /** Route prefixes that must NOT mark this item active. */
  exclude?: string[];
  badge?: number;
  /** Show in the phone bottom bar. */
  mobile?: boolean;
  /** Shorter label for the phone bottom bar. */
  mobileTitle?: string;
}

export interface SidebarNavGroup {
  label?: string;
  items: SidebarNavItem[];
}

export interface SidebarMenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
}

export interface AppSidebarProps {
  homeHref: string;
  /** Small label next to the logo ("Admin", "Partner"). */
  role?: string;
  /** Block under the logo: the owner's card link, the agent's credits… Hidden when collapsed. */
  context?: React.ReactNode;
  primaryAction?: { label: string; href: string; icon: LucideIcon };
  nav: SidebarNavGroup[];
  footerNav?: SidebarNavItem[];
  user: { name: string; subtitle?: string | null; avatarUrl?: string | null };
  menu?: SidebarMenuItem[];
  onSignOut: () => Promise<void> | void;
}

export function isSidebarItemActive(pathname: string | null, item: SidebarNavItem): boolean {
  if (!pathname) return false;
  if (item.exclude?.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return false;
  if (item.exact) return pathname === item.href;
  return [item.href, ...(item.match ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

const COLLAPSE_KEY = "dg.sidebar.collapsed";

function useCollapsed() {
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // Storage blocked: always start expanded.
    }
  }, []);
  const toggle = React.useCallback(() => {
    setCollapsed((c) => {
      try {
        window.localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {
        // ignore
      }
      return !c;
    });
  }, []);
  return [collapsed, toggle] as const;
}

export function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "•"
  );
}

export function UserAvatar({ name, url, size = 32 }: { name: string; url?: string | null; size?: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-[#EFECFD] font-semibold text-[#3D2AAD]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initialsOf(name)}
    </span>
  );
}

function NavItem({ item, active, collapsed }: { item: SidebarNavItem; active: boolean; collapsed: boolean }) {
  const Icon = item.icon;
  const badge = item.badge && item.badge > 0 ? item.badge : 0;
  return (
    <Link
      href={item.href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.title : undefined}
      className={cn(
        "group relative flex h-9 items-center rounded-lg text-sm transition-colors",
        collapsed ? "justify-center" : "gap-3 px-2.5",
        active ? "bg-[#EFECFD] font-semibold text-[#3D2AAD]" : "font-medium text-[#52525B] hover:bg-[#F4F4F5] hover:text-foreground",
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-primary" : "text-[#71717A] group-hover:text-foreground")} aria-hidden="true" />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
      {badge > 0 &&
        (collapsed ? (
          <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" aria-label={`${badge} new`} />
        ) : (
          <span className="min-w-[20px] rounded-full bg-primary px-1.5 py-0.5 text-center text-xs font-semibold leading-none text-white">{badge}</span>
        ))}
    </Link>
  );
}

export function AppSidebar({ homeHref, role, context, primaryAction, nav, footerNav = [], user, menu = [], onSignOut }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, toggle] = useCollapsed();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMenuOpen(false), [pathname]);
  React.useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setSigningOut(false);
    }
  };

  const PrimaryIcon = primaryAction?.icon;

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 md:flex",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      {/* Brand + collapse */}
      <div className={cn("flex h-16 shrink-0 items-center", collapsed ? "justify-center" : "justify-between pl-4 pr-2")}>
        {collapsed ? (
          <button type="button" onClick={toggle} className="group relative rounded-lg" title="Expand sidebar" aria-label="Expand sidebar">
            <LogoMark size={32} className="transition-opacity group-hover:opacity-0" />
            <PanelLeftOpen className="absolute inset-0 m-auto h-5 w-5 text-[#52525B] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
          </button>
        ) : (
          <>
            <Link href={homeHref} prefetch={false} className="flex min-w-0 items-center gap-2" aria-label="Digicardo home">
              <DigicardoLogo size="sm" />
              {role && <span className="rounded-md bg-[#F4F4F5] px-1.5 py-0.5 text-xs font-medium text-[#52525B]">{role}</span>}
            </Link>
            <button
              type="button"
              onClick={toggle}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] transition-colors hover:bg-[#F4F4F5] hover:text-foreground"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Context + main action */}
      {(context || primaryAction) && (
        <div className="shrink-0 space-y-2 px-3 pb-2">
          {!collapsed && context}
          {primaryAction && PrimaryIcon && (
            <Link
              href={primaryAction.href}
              prefetch={false}
              title={collapsed ? primaryAction.label : undefined}
              className={cn(
                "flex h-9 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90",
                collapsed && "w-full",
              )}
            >
              <PrimaryIcon className="h-4 w-4" aria-hidden="true" />
              {!collapsed && primaryAction.label}
            </Link>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-2">
        {nav.map((group, i) => (
          <div key={group.label ?? i} className={cn(i > 0 && "mt-5")}>
            {group.label &&
              (collapsed ? (
                <div className="mx-2 mb-2 h-px bg-border" aria-hidden="true" />
              ) : (
                <p className="mb-1 px-2.5 text-xs font-medium text-[#A1A1AA]">{group.label}</p>
              ))}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} active={isSidebarItemActive(pathname, item)} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: settings + account */}
      <div ref={menuRef} className="relative shrink-0 space-y-0.5 border-t border-border p-3">
        {footerNav.map((item) => (
          <NavItem key={item.href} item={item} active={isSidebarItemActive(pathname, item)} collapsed={collapsed} />
        ))}

        {menuOpen && (
          <div
            role="menu"
            className={cn(
              "absolute z-50 overflow-hidden rounded-xl border border-border bg-card py-1.5 text-sm shadow-float",
              collapsed ? "bottom-3 left-[calc(100%+8px)] w-60" : "bottom-full left-3 right-3 mb-2",
            )}
          >
            <div className="border-b border-border px-3.5 pb-2.5 pt-1.5">
              <p className="truncate font-semibold text-foreground">{user.name}</p>
              {user.subtitle && <p className="truncate text-xs text-muted-foreground">{user.subtitle}</p>}
            </div>
            {menu.map(({ label, href, icon: Icon, external }) => (
              <Link
                key={label}
                role="menuitem"
                href={href ?? "#"}
                prefetch={false}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2.5 px-3.5 py-2 text-[#52525B] hover:bg-[#F4F4F5] hover:text-foreground"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
            <div className="my-1 h-px bg-border" />
            <button
              role="menuitem"
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-destructive hover:bg-destructive/5 disabled:opacity-60"
            >
              {signingOut ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title={collapsed ? user.name : undefined}
          className={cn(
            "flex w-full items-center rounded-lg text-left transition-colors hover:bg-[#F4F4F5]",
            collapsed ? "justify-center p-1.5" : "gap-2.5 p-1.5",
            footerNav.length > 0 && "mt-1",
          )}
        >
          <UserAvatar name={user.name} url={user.avatarUrl} size={32} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">{user.name}</span>
                {user.subtitle && (
                  <span className="block truncate text-xs text-muted-foreground" suppressHydrationWarning>
                    {user.subtitle}
                  </span>
                )}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#A1A1AA]" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
