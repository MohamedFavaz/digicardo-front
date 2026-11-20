"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useShellProfile } from "@/lib/hooks/use-shell-profile";
import { useUnreadCount } from "@/lib/hooks/use-unread-count";
import { AppSidebar, type SidebarNavItem } from "@/components/shell/AppSidebar";
import { resolveMediaUrl } from "@/lib/utils";
import { DASHBOARD_NAV_GROUPS, DASHBOARD_SETTINGS_NAV } from "./nav-config";

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

/** "Your card" block at the top of the owner sidebar: photo, name, live link, copy and open. */
function CardLinkBlock() {
  const { profile, publicLinkLabel, publicUrl } = useShellProfile();
  const [copied, setCopied] = React.useState(false);
  if (!publicLinkLabel || !publicUrl) return null;

  const name = profile?.display_name || "Your card";
  const avatar = profile?.avatar_url ? resolveMediaUrl(profile.avatar_url) : null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link stays visible to copy by hand.
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4E0FB] bg-[linear-gradient(160deg,#F6F4FE_0%,#FFFFFF_70%)] p-3">
      <div className="flex items-center gap-2.5">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
          <img src={avatar} alt="" className="h-10 w-10 shrink-0 rounded-full border border-white object-cover shadow-xs" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{initials(name)}</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground" title={name}>
            {name}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[#1E7B43]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22A55A] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22A55A]" />
            </span>
            Live
          </p>
        </div>
      </div>
      <p className="mt-2.5 truncate rounded-lg bg-white/80 px-2.5 py-1.5 text-[13px] font-medium text-[#3D2AAD] ring-1 ring-[#E4E0FB]" title={publicLinkLabel}>
        {publicLinkLabel}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
        </button>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-input bg-card text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> View
        </a>
      </div>
    </div>
  );
}

/** Desktop sidebar for card owners. Phones use MobileBottomNav instead. */
export function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, username, publicLinkLabel } = useShellProfile();
  const unread = useUnreadCount();

  const displayName = profile?.display_name || user?.name || "Your account";
  const footerNav: SidebarNavItem[] = [DASHBOARD_SETTINGS_NAV];
  if (user?.role === "admin") footerNav.push({ title: "Admin console", href: "/admin/dashboard", icon: ShieldCheck });

  const nav = DASHBOARD_NAV_GROUPS.map((group) => ({
    label: group.label,
    items: group.items.map((item) => ({ ...item, badge: item.unread ? unread : undefined })),
  }));

  return (
    <AppSidebar
      homeHref="/dashboard"
      context={<CardLinkBlock />}
      nav={nav}
      footerNav={footerNav}
      user={{
        name: user?.name || displayName,
        subtitle: user?.email ?? publicLinkLabel ?? (username ? `/${username}` : null),
        avatarUrl: profile?.avatar_url ?? null,
      }}
      menu={[
        ...(username ? [{ label: "View my card", href: `/${username}`, icon: ExternalLink, external: true }] : []),
        { label: "Account settings", href: "/dashboard/settings", icon: Settings },
      ]}
      onSignOut={async () => {
        await logout().catch(() => {});
        router.push("/login");
      }}
    />
  );
}
