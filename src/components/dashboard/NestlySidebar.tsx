"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Copy, ExternalLink, LogOut, Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useShellProfile } from "@/lib/hooks/use-shell-profile";
import { useUnreadCount } from "@/lib/hooks/use-unread-count";
import { TapGlyph } from "@/components/ui/DigicardoLogo";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { DASHBOARD_NAV_GROUPS, DASHBOARD_SETTINGS_NAV, isNavItemActive, type DashboardNavItem } from "./nav-config";

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

function NavPill({ item, active, badge }: { item: DashboardNavItem; active: boolean; badge?: number }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 items-center gap-3 rounded-full px-4 text-[15px] transition-colors",
        active
          ? "bg-[#343C22] font-medium text-white shadow-[0_8px_18px_-10px_rgba(52,60,34,0.9)]"
          : "text-[#5E6054] hover:bg-white/70 hover:text-[#121212]"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
      <span className="flex-1 truncate">{item.title}</span>
      {!!badge && badge > 0 && (
        <span className={cn("min-w-[22px] rounded-full px-1.5 text-center text-xs font-semibold leading-[22px]", active ? "bg-white text-[#343C22]" : "bg-[#4B5634] text-white")}>
          {badge > 99 ? "99+" : badge}
          <span className="sr-only"> unread</span>
        </span>
      )}
    </Link>
  );
}

/** Card link box: live dot, link, copy and open. */
function CardLinkBox() {
  const { publicLinkLabel, publicUrl } = useShellProfile();
  const [copied, setCopied] = React.useState(false);
  if (!publicLinkLabel || !publicUrl) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link stays visible.
    }
  };
  return (
    <div className="rounded-[20px] border border-white/80 bg-white/70 p-3 shadow-[0_10px_30px_-20px_rgba(52,60,34,0.6)] backdrop-blur">
      <p className="flex items-center gap-1.5 text-xs text-[#5E6054]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#6E8A3A]" aria-hidden="true" /> Your card is live
      </p>
      <p className="mt-1 truncate text-sm font-medium text-[#121212]" title={publicLinkLabel}>
        {publicLinkLabel}
      </p>
      <div className="mt-2.5 flex gap-1.5">
        <button type="button" onClick={copy} className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#343C22] text-xs font-medium text-white hover:bg-[#4B5634]">
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
        </button>
        <a href={publicUrl} target="_blank" rel="noopener noreferrer" aria-label="Open my card" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E1E1DA] bg-white text-[#343C22] hover:bg-[#EEF2E4]">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/** Desktop sidebar for card owners (Nestly look): labelled, grouped pills on the sage canvas. */
export function NestlySidebar() {
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
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col px-4 py-6 md:flex">
      <Link href="/dashboard" prefetch={false} className="flex items-center gap-2 px-3" aria-label="Digicardo home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#343C22]">
          <TapGlyph className="h-5 w-5" color="#FFFFFF" />
        </span>
        <span className="text-[22px] font-medium tracking-tight text-[#121212]">
          Digicardo<sup className="ml-0.5 text-[10px] text-[#5E6054]">™</sup>
        </span>
      </Link>

      <div className="mt-6">
        <CardLinkBox />
      </div>

      <nav aria-label="Main" className="mt-6 flex-1 space-y-5 overflow-y-auto">
        {DASHBOARD_NAV_GROUPS.map((group, i) => (
          <div key={group.label ?? i}>
            {group.label && <p className="mb-1.5 px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A9C8F]">{group.label}</p>}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavPill key={item.href} item={item} active={isNavItemActive(pathname, item)} badge={item.unread ? unread : undefined} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-2">
        <NavPill item={DASHBOARD_SETTINGS_NAV} active={isNavItemActive(pathname, DASHBOARD_SETTINGS_NAV)} />
        {user?.role === "admin" && <NavPill item={{ title: "Admin console", href: "/admin/dashboard", icon: ShieldCheck }} active={false} />}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex w-full items-center gap-3 rounded-[20px] border border-white/80 bg-white/70 p-2 pr-3 text-left hover:bg-white"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
              <img src={avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDE5CB] text-sm font-semibold text-[#343C22]">{initials(name)}</span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-[#121212]">{name}</span>
              {user?.email && <span className="block truncate text-xs text-[#9A9C8F]">{user.email}</span>}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#9A9C8F]" aria-hidden="true" />
          </button>
          {menuOpen && (
            <div role="menu" className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-50 overflow-hidden rounded-[20px] border border-[#E1E1DA] bg-white p-1.5 shadow-[0_20px_40px_-16px_rgba(52,60,34,0.35)]">
              {username && (
                <a role="menuitem" href={`/${username}`} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-2.5 rounded-full px-3 text-sm text-[#121212] hover:bg-[#EEF2E4]">
                  <ExternalLink className="h-4 w-4 text-[#5E6054]" aria-hidden="true" /> View my card
                </a>
              )}
              <Link role="menuitem" href="/dashboard/settings" prefetch={false} className="flex h-10 items-center gap-2.5 rounded-full px-3 text-sm text-[#121212] hover:bg-[#EEF2E4]">
                <Settings className="h-4 w-4 text-[#5E6054]" aria-hidden="true" /> Account settings
              </Link>
              <button
                role="menuitem"
                type="button"
                onClick={async () => {
                  await logout().catch(() => {});
                  router.push("/login");
                }}
                className="flex h-10 w-full items-center gap-2.5 rounded-full px-3 text-sm font-medium text-destructive hover:bg-[#FDECEC]"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
