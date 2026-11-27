"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  CalendarClock,
  CreditCard,
  Flag,
  History,
  Home,
  IdCard,
  Inbox,
  LayoutGrid,
  Megaphone,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCog,
  Wallet, Building2, PlusCircle } from "lucide-react";
import { ConsoleLoading, ConsoleShell, type ConsoleNavGroup } from "@/components/console/ConsoleShell";
import NotFound from "@/app/not-found";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState({ name: "Admin", email: "" });
  const [pendingRequests, setPendingRequests] = useState(0);
  const [openReports, setOpenReports] = useState(0);
  const [expiring, setExpiring] = useState(0);
  // Don't render the console until we know the visitor is an admin (no flash of the UI).
  const [authChecked, setAuthChecked] = useState(false);
  // Non-admins get the normal 404 page: the console (and its hidden sign-in) isn't advertised.
  const [denied, setDenied] = useState(false);

  // Run once on mount — re-running on every navigation caused redirect races.
  useEffect(() => {
    fetch("/api/bff/v1/auth/me", { credentials: "include" })
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          setDenied(true);
          return;
        }
        const json = await r.json();
        const user = json?.data;
        if (!user || user.role !== "admin") {
          setDenied(true);
          return;
        }
        setAdmin({ name: user.name || "Admin", email: user.email || "" });
        setAuthChecked(true);
      })
      .catch(() => setDenied(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Menu badges (best effort, admins only): pending access requests, open reports, accounts
  // expiring this week. Refreshed on every page change so they follow what you just did.
  useEffect(() => {
    if (!authChecked) return;
    const get = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json()).catch(() => null);
    get("/api/bff/v1/admin/access-requests?status=pending&per_page=1").then((json) => setPendingRequests(json?.data?.pagination?.total || 0));
    get("/api/bff/v1/admin/reports?status=open&per_page=5").then((json) => setOpenReports(json?.data?.pagination?.total || 0));
    get("/api/bff/v1/admin/users/expiring").then((json) => setExpiring(json?.data?.count || 0));
  }, [authChecked, pathname]);

  if (denied) return <NotFound />;
  if (!authChecked) return <ConsoleLoading />;

  // Grouped by job: who your customers are, your partners, money, talking to people,
  // keeping the platform safe, and running it.
  const nav: ConsoleNavGroup[] = [
    {
      items: [{ title: "Overview", href: "/admin/dashboard", icon: Home, exact: true, mobile: true }],
    },
    {
      label: "Customers",
      items: [
        { title: "Cards", href: "/admin/my-links", icon: IdCard, mobile: true },
        { title: "Renewals", href: "/admin/renewals", icon: CalendarClock, badge: expiring },
        { title: "Access requests", mobileTitle: "Requests", href: "/admin/access-requests", icon: Inbox, badge: pendingRequests, mobile: true },
      ],
    },
    {
      label: "Partners",
      items: [
        { title: "Agents", href: "/admin/agents", icon: UserCog },
        { title: "Franchises", href: "/admin/franchises", icon: Building2 },
        { title: "Agent cards", href: "/admin/agent-cards", icon: LayoutGrid },
        { title: "Payouts", href: "/admin/agent-finance", icon: Wallet },
      ],
    },
    {
      label: "Sales",
      items: [
        { title: "Revenue", href: "/admin/accounts", icon: CreditCard },
        { title: "Plans & prices", href: "/admin/plans", icon: Sparkles },
        { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Engage",
      items: [{ title: "Messages", href: "/admin/messages", icon: Megaphone }],
    },
    {
      label: "Trust & safety",
      items: [
        { title: "Reports", href: "/admin/reports", icon: Flag, badge: openReports },
        { title: "Moderation", href: "/admin/moderation", icon: ShieldCheck },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Activity log", href: "/admin/activity", icon: History },
        { title: "System health", href: "/admin/system", icon: Activity },
        { title: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <ConsoleShell
      role="Admin"
      homeHref="/admin/dashboard"
      nav={nav}
      primaryAction={{ label: "Create card", href: "/admin/cards/create", icon: PlusCircle }}
      user={admin}
      accountLinks={[{ label: "Admin settings", href: "/admin/settings", icon: Settings }]}
      onSignOut={async () => {
        await fetch("/api/bff/v1/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
        router.push("/admin-login");
      }}
    >
      {children}
    </ConsoleShell>
  );
}
