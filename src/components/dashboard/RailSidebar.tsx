"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut, Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useShellProfile } from "@/lib/hooks/use-shell-profile";
import { useUnreadCount } from "@/lib/hooks/use-unread-count";
import { TapGlyph } from "@/components/ui/DigicardoLogo";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { DASHBOARD_NAV, DASHBOARD_SETTINGS_NAV, isNavItemActive, type DashboardNavItem } from "./nav-config";

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

/** One rail icon with a label that slides out on hover / keyboard focus. */
function RailLink({ item, active, badge }: { item: DashboardNavItem; active: boolean; badge?: number }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      prefetch={false}
      aria-label={item.title}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-12 w-12 items-center justify-center rounded-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/80",
        active ? "bg-white text-[#4B3BAA] shadow-[0_8px_18px_-8px_rgba(0,0,0,0.45)]" : "text-white/75 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.9} aria-hidden="true" />
      {!!badge && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-[#38D6E6] px-1 text-center text-[10px] font-bold leading-[18px] text-[#1E1452] ring-2 ring-[#4B3BAA]">
          {badge > 9 ? "9+" : badge}
          <span className="sr-only"> unread</span>
        </span>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 z-50 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#1E1452] px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        {item.title}
      </span>
    </Link>
  );
}

/**
 * Desktop navigation for card owners: a floating, rounded violet icon rail.
 * Labels appear on hover / focus; the account menu sits at the bottom.
 */
export function RailSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, username } = useShellProfile();
  const unread = useUnreadCount();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

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

  const name = user?.name || profile?.display_name || "Your account";
  const avatar = profile?.avatar_url ? resolveMediaUrl(profile.avatar_url) : null;

  return (
    <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-[76px] md:block">
      <div className="flex h-full flex-col items-center rounded-[38px] bg-[linear-gradient(180deg,#5A47C8_0%,#4B3BAA_45%,#3A2C8E_100%)] py-5 shadow-[0_24px_48px_-18px_rgba(58,44,142,0.75)]">
        <Link href="/dashboard" prefetch={false} aria-label="Digicardo home" className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <TapGlyph className="h-6 w-6" color="#FFFFFF" />
        </Link>

        <nav aria-label="Main" className="flex flex-1 flex-col items-center gap-2.5">
          {DASHBOARD_NAV.map((item) => (
            <RailLink key={item.href} item={item} active={isNavItemActive(pathname, item)} badge={item.unread ? unread : undefined} />
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2.5">
          <RailLink item={DASHBOARD_SETTINGS_NAV} active={isNavItemActive(pathname, DASHBOARD_SETTINGS_NAV)} />
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              className="mt-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/40 transition hover:ring-white focus-visible:outline-none focus-visible:ring-white"
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#38D6E6] text-sm font-bold text-[#1E1452]">{initials(name)}</span>
              )}
            </button>
            {menuOpen && (
              <div role="menu" className="absolute bottom-0 left-[calc(100%+16px)] z-50 w-60 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-[0_20px_40px_-16px_rgba(30,20,82,0.35)]">
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                  {user?.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
                </div>
                <div className="my-1 h-px bg-border" />
                {username && (
                  <a role="menuitem" href={`/${username}`} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm text-foreground hover:bg-muted">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> View my card
                  </a>
                )}
                <Link role="menuitem" href="/dashboard/settings" prefetch={false} className="flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm text-foreground hover:bg-muted">
                  <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> Account settings
                </Link>
                {user?.role === "admin" && (
                  <Link role="menuitem" href="/admin/dashboard" prefetch={false} className="flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm text-foreground hover:bg-muted">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> Admin console
                  </Link>
                )}
                <div className="my-1 h-px bg-border" />
                <button
                  role="menuitem"
                  type="button"
                  onClick={async () => {
                    await logout().catch(() => {});
                    router.push("/login");
                  }}
                  className="flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm font-medium text-destructive hover:bg-[#FDECEC]"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
