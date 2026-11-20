"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, Loader2, LogOut, Plus, type LucideIcon } from "lucide-react";
import { TapGlyph } from "@/components/ui/DigicardoLogo";
import { isSidebarItemActive, type SidebarNavGroup, type SidebarNavItem } from "@/components/shell/AppSidebar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

function Pill({ item, active }: { item: SidebarNavItem; active: boolean }) {
  const Icon = item.icon;
  const badge = item.badge && item.badge > 0 ? item.badge : 0;
  return (
    <Link
      href={item.href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-[34px] items-center gap-3 rounded-full px-4 text-[14px] transition-colors",
        active ? "bg-[#343C22] font-medium text-white shadow-[0_8px_18px_-10px_rgba(52,60,34,0.9)]" : "text-[#5E6054] hover:bg-white/70 hover:text-[#121212]"
      )}
    >
      <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
      <span className="flex-1 truncate">{item.title}</span>
      {badge > 0 && (
        <span className={cn("min-w-[20px] rounded-full px-1.5 text-center text-[11px] font-semibold leading-[20px]", active ? "bg-white text-[#343C22]" : "bg-[#4B5634] text-white")}>
          {badge > 99 ? "99+" : badge}
          <span className="sr-only"> new</span>
        </span>
      )}
    </Link>
  );
}

/** Admin / agent console sidebar in the Nestly look: labelled pills on the sage canvas. */
export function NestlyConsoleSidebar({
  homeHref,
  role,
  context,
  primaryAction,
  nav,
  footerNav = [],
  user,
  menu = [],
  onSignOut,
}: {
  homeHref: string;
  role?: string;
  context?: React.ReactNode;
  primaryAction?: { label: string; href: string; icon: LucideIcon };
  nav: SidebarNavGroup[];
  footerNav?: SidebarNavItem[];
  user: { name: string; subtitle?: string | null; avatarUrl?: string | null };
  menu?: { label: string; href?: string; icon: LucideIcon; external?: boolean }[];
  onSignOut: () => Promise<void> | void;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const navRef = React.useRef<HTMLElement>(null);

  // Keep the current page's item in view when the menu is longer than the screen.
  React.useEffect(() => {
    navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  React.useEffect(() => setMenuOpen(false), [pathname]);
  React.useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => menuRef.current && !menuRef.current.contains(e.target as Node) && setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const PrimaryIcon = primaryAction?.icon ?? Plus;

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col px-4 py-4 md:flex">
      <Link href={homeHref} prefetch={false} className="flex items-center gap-2 px-3" aria-label="Digicardo home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#343C22]">
          <TapGlyph className="h-5 w-5" color="#FFFFFF" />
        </span>
        <span className="text-[22px] font-medium tracking-tight text-[#121212]">Digicardo</span>
        {role && <span className="ml-1 rounded-full border border-white bg-white/70 px-2 py-0.5 text-[11px] font-medium text-[#5E6054]">{role}</span>}
      </Link>

      {primaryAction && (
        <Link
          href={primaryAction.href}
          prefetch={false}
          className="mt-4 flex h-11 items-center gap-3 rounded-full bg-[#343C22] pl-5 pr-1.5 text-[15px] font-medium text-white shadow-[0_12px_24px_-12px_rgba(52,60,34,0.9)] hover:bg-[#4B5634]"
        >
          <span className="flex-1 truncate">{primaryAction.label}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#343C22]">
            <PrimaryIcon className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      )}

      {context && <div className="mt-4 [&>a]:rounded-[20px] [&>a]:border-white/80 [&>a]:bg-white/70">{context}</div>}

      <nav
        ref={navRef}
        aria-label="Main"
        // A soft fade at the bottom hints that the list scrolls when it is longer than the screen.
        className="mt-3 min-h-0 flex-1 space-y-2.5 overflow-y-auto pb-6 pr-1 [mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)] [scrollbar-width:thin]"
      >
        {nav.map((group, i) => (
          <div key={group.label ?? i}>
            {group.label && <p className="mb-0.5 px-4 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#9A9C8F]">{group.label}</p>}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Pill key={item.href} item={item} active={isSidebarItemActive(pathname, item)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("space-y-1.5", footerNav.length > 0 ? "pt-2" : "pt-1")}>
        {footerNav.map((item) => (
          <Pill key={item.href} item={item} active={isSidebarItemActive(pathname, item)} />
        ))}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex w-full items-center gap-3 rounded-[20px] border border-white/80 bg-white/70 p-2 pr-3 text-left hover:bg-white"
          >
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- user avatar
              <img src={user.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDE5CB] text-sm font-semibold text-[#343C22]">{initials(user.name)}</span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-[#121212]">{user.name}</span>
              {user.subtitle && <span className="block truncate text-xs text-[#9A9C8F]">{user.subtitle}</span>}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#9A9C8F]" aria-hidden="true" />
          </button>
          {menuOpen && (
            <div role="menu" className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-50 overflow-hidden rounded-[20px] border border-[#E1E1DA] bg-white p-1.5 shadow-[0_20px_40px_-16px_rgba(52,60,34,0.35)]">
              {menu.map((m) => {
                const Icon = m.icon;
                const cls = "flex h-10 items-center gap-2.5 rounded-full px-3 text-sm text-[#121212] hover:bg-[#EEF2E4]";
                return m.external ? (
                  <a key={m.label} role="menuitem" href={m.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    <Icon className="h-4 w-4 text-[#5E6054]" aria-hidden="true" /> {m.label}
                  </a>
                ) : (
                  <Link key={m.label} role="menuitem" href={m.href ?? "#"} prefetch={false} className={cls}>
                    <Icon className="h-4 w-4 text-[#5E6054]" aria-hidden="true" /> {m.label}
                  </Link>
                );
              })}
              <button
                role="menuitem"
                type="button"
                disabled={signingOut}
                onClick={async () => {
                  setSigningOut(true);
                  try {
                    await onSignOut();
                  } finally {
                    setSigningOut(false);
                  }
                }}
                className="flex h-10 w-full items-center gap-2.5 rounded-full px-3 text-sm font-medium text-destructive hover:bg-[#FDECEC] disabled:opacity-60"
              >
                {signingOut ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
