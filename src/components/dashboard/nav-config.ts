import {
  Home,
  PencilLine,
  Share2,
  Nfc,
  BarChart3,
  Inbox,
  Settings,
  type LucideIcon,
} from "lucide-react";

/**
 * Owner dashboard navigation (docs/editor-redesign-plan.md §3.4).
 * One list drives the desktop sidebar and the phone bottom bar so they never drift apart.
 */
export interface DashboardNavItem {
  title: string;
  /** Shorter label for the phone bottom bar. */
  mobileTitle?: string;
  href: string;
  icon: LucideIcon;
  /** Extra route prefixes that should mark this item active. */
  match?: string[];
  /** Only active on an exact path match. */
  exact?: boolean;
  /** Shows the unread count. */
  unread?: boolean;
}

export const NAV_HOME: DashboardNavItem = { title: "Home", href: "/dashboard", icon: Home, exact: true };
export const NAV_EDIT: DashboardNavItem = {
  title: "Edit card",
  mobileTitle: "Edit",
  href: "/dashboard/editor",
  icon: PencilLine,
  // Content and Design are two tabs of one "Edit card" page.
  match: ["/dashboard/page", "/dashboard/appearance"],
};
export const NAV_SHARE: DashboardNavItem = { title: "Share & QR", mobileTitle: "Share", href: "/dashboard/qr", icon: Share2 };
export const NAV_NFC: DashboardNavItem = { title: "NFC card", href: "/dashboard/nfc-card", icon: Nfc };
export const NAV_ANALYTICS: DashboardNavItem = { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 };
export const NAV_INBOX: DashboardNavItem = { title: "Inbox", href: "/dashboard/notifications", icon: Inbox, unread: true };

/** Sidebar groups. */
export const DASHBOARD_NAV_GROUPS: { label?: string; items: DashboardNavItem[] }[] = [
  { items: [NAV_HOME] },
  { label: "Your card", items: [NAV_EDIT, NAV_SHARE, NAV_NFC] },
  { label: "Activity", items: [NAV_INBOX, NAV_ANALYTICS] },
];

/** Flat list (kept for callers that just need every page). */
export const DASHBOARD_NAV: DashboardNavItem[] = DASHBOARD_NAV_GROUPS.flatMap((g) => g.items);

/** Phone bottom bar: four tabs; the rest sit under "More". */
export const MOBILE_TABS: DashboardNavItem[] = [NAV_HOME, NAV_EDIT, NAV_SHARE, NAV_INBOX];

export const DASHBOARD_SETTINGS_NAV: DashboardNavItem = {
  title: "Settings",
  href: "/dashboard/settings",
  icon: Settings,
  match: ["/dashboard/billing", "/dashboard/seo", "/dashboard/domains"],
};

export const MOBILE_MORE: DashboardNavItem[] = [NAV_ANALYTICS, NAV_NFC, DASHBOARD_SETTINGS_NAV];

export function isNavItemActive(pathname: string | null, item: DashboardNavItem): boolean {
  if (!pathname) return false;
  if (item.exact) return pathname === item.href;
  const prefixes = [item.href, ...(item.match ?? [])];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Titles shown in the top bar. */
export const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard/editor": { title: "Edit card", subtitle: "Change anything — it saves by itself." },
  "/dashboard/qr": { title: "Share & QR", subtitle: "Your link, QR code and ways to send your card." },
  "/dashboard/nfc-card": { title: "NFC card", subtitle: "Design a tap-to-share card and download print files." },
  "/dashboard/analytics": { title: "Analytics", subtitle: "How many people saw your card and what they tapped." },
  "/dashboard/notifications": { title: "Inbox", subtitle: "Messages from visitors and updates for you." },
  "/dashboard/settings": { title: "Settings", subtitle: "Your account, security and preferences." },
  "/dashboard/settings/account": { title: "Settings", subtitle: "Your account, password and signed-in devices." },
  "/dashboard/settings/notifications": { title: "Settings", subtitle: "Choose what we notify you about." },
  "/dashboard/billing": { title: "Settings", subtitle: "Your plan and payments." },
  "/dashboard/seo": { title: "Settings", subtitle: "How your card looks on Google and in chats." },
  "/dashboard/domains": { title: "Settings", subtitle: "Use your own web address." },
};
