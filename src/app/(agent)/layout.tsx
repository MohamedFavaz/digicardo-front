"use client";
import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CreditCard, Gauge, Home, Inbox, LayoutTemplate, PlusCircle, Send, User, Wallet } from "lucide-react";
import Link from "next/link";
import { AdminViewingBanner } from "@/components/console/AdminViewingBanner";
import { ExpiryAlert } from "@/components/partner/CardExpiry";
import { ConsoleLoading, ConsoleShell, type ConsoleNavGroup } from "@/components/console/ConsoleShell";
import { cn } from "@/lib/utils";

function buildNav(unread: number, leads: number): ConsoleNavGroup[] {
  // Grouped by job: your cards, your money, your website, talking to people.
  return [
    {
      items: [{ title: "Home", href: "/agent/dashboard", icon: Home, exact: true, mobile: true }],
    },
    {
      label: "Cards",
      items: [
        { title: "My cards", mobileTitle: "Cards", href: "/agent/cards", icon: CreditCard, exclude: ["/agent/cards/create"], mobile: true },
        { title: "Card credits", href: "/agent/limits", icon: Gauge },
      ],
    },
    {
      label: "Money",
      items: [{ title: "Earnings", href: "/agent/earnings", icon: Wallet, mobile: true }],
    },
    {
      label: "Website",
      items: [
        { title: "Landing page", href: "/agent/site", icon: LayoutTemplate },
        { title: "Leads", href: "/agent/leads", icon: Inbox, badge: leads },
      ],
    },
    {
      label: "Messages",
      items: [
        { title: "Inbox", href: "/agent/inbox", icon: Bell, badge: unread },
        { title: "Message customers", href: "/agent/messages", icon: Send },
      ],
    },
  ];
}

/** Card credits meter shown in the sidebar and the phone menu. */
function CreditsMeter({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const left = Math.max(0, limit - used);
  return (
    <Link href="/agent/limits" prefetch={false} className="block rounded-xl border border-border bg-background p-3 transition-colors hover:border-[#D4D4D8]">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Card credits</span>
        <span className="text-muted-foreground">
          {used} / {limit}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-[#F59E0B]" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{limit === 0 ? "Ask your admin for credits" : `${left} left`}</p>
    </Link>
  );
}

export default function AgentLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentAvatar, setAgentAvatar] = useState<string | null>(null);
  const [quota, setQuota] = useState({ used: 0, limit: 0 });
  const [authChecked, setAuthChecked] = useState(false);
  const [unread, setUnread] = useState(0);
  const [leads, setLeads] = useState(0);

  useEffect(() => {
    let mounted = true;

    fetch("/api/bff/v1/agent/auth/me", { credentials: "include" })
      .then(async (r) => {
        if (!mounted) return;

        if (r.status === 401) {
          router.replace("/agent-login");
          return;
        }

        if (r.status === 403) {
          // If 403, verify if impersonating before ejecting
          const isImpersonatingLocal =
            typeof window !== "undefined" &&
            localStorage.getItem("digicardo_impersonating") === "true";
          if (!isImpersonatingLocal) {
            router.replace("/agent-login");
            return;
          }
        }

        if (!r.ok) {
          // Server error (500, 502, etc.) — do NOT treat as unauthenticated
          console.warn("AgentLayout: /agent/auth/me returned non-OK status", r.status);
          setAuthChecked(true);
          return;
        }

        const json = await r.json();
        const data = json?.data;
        const user = data?.user || data;
        const isAgent = user?.role === "agent" || data?.user?.role === "agent";
        const isAdmin = user?.role === "admin" || data?.is_admin === true;
        const isImpersonating = data?.is_impersonating === true;

        if (!user || (!isAgent && !isAdmin && !isImpersonating)) {
          router.replace("/agent-login");
        } else {
          setAgentName(user?.name || "Agent");
          setAgentEmail(user?.email || "");
          setAgentAvatar(user?.avatar_url || null);
          const agentQuota = data?.quota || user?.agent_quota;
          if (agentQuota) {
            setQuota({
              used: agentQuota.cards_used || 0,
              limit: agentQuota.card_limit || 0,
            });
          }
          setAuthChecked(true);
        }
      })
      .catch((err) => {
        // Do not eject user on transient network glitches or dev reloads
        console.warn("AgentLayout: session verification transient error:", err);
        if (mounted) {
          setAuthChecked(true);
        }
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleProfileUpdated(event: CustomEvent<{ user?: { name?: string; email?: string; avatar_url?: string | null } }>) {
      if (event.detail?.user) {
        if (event.detail.user.name) setAgentName(event.detail.user.name);
        if (event.detail.user.email) setAgentEmail(event.detail.user.email);
        if ("avatar_url" in event.detail.user) setAgentAvatar(event.detail.user.avatar_url || null);
      }
    }
    window.addEventListener("agent-profile-updated", handleProfileUpdated as EventListener);
    return () => {
      window.removeEventListener("agent-profile-updated", handleProfileUpdated as EventListener);
    };
  }, []);

  // Unread inbox badge: polled, and updated straight away by the inbox page.
  useEffect(() => {
    if (!authChecked) return;
    const load = () =>
      fetch("/api/bff/v1/notifications/unread-count", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => typeof json?.data?.count === "number" && setUnread(json.data.count))
        .catch(() => {});
    load();
    const timer = setInterval(load, 60_000);
    const onChange = (e: Event) => setUnread((e as CustomEvent<{ unread: number }>).detail?.unread ?? 0);
    window.addEventListener("agent-inbox-changed", onChange);
    // New landing-page leads badge.
    const loadLeads = () =>
      fetch("/api/bff/v1/agent/leads?per_page=1", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => typeof json?.data?.unread === "number" && setLeads(json.data.unread))
        .catch(() => {});
    loadLeads();
    const leadsTimer = setInterval(loadLeads, 60_000);
    const onLeads = (e: Event) => setLeads((e as CustomEvent<{ unread: number }>).detail?.unread ?? 0);
    window.addEventListener("agent-leads-changed", onLeads);
    return () => {
      clearInterval(timer);
      clearInterval(leadsTimer);
      window.removeEventListener("agent-inbox-changed", onChange);
      window.removeEventListener("agent-leads-changed", onLeads);
    };
  }, [authChecked]);

  if (!authChecked) return <ConsoleLoading />;

  return (
    <ConsoleShell
      role="Partner"
      homeHref="/agent/dashboard"
      nav={buildNav(unread, leads)}
      footerNav={[{ title: "Profile", href: "/agent/profile", icon: User }]}
      primaryAction={{ label: "New card", href: "/agent/cards/create", icon: PlusCircle }}
      sidebarExtra={<CreditsMeter used={quota.used} limit={quota.limit} />}
      user={{ name: agentName, email: agentEmail, avatarUrl: agentAvatar }}
      accountLinks={[{ label: "My profile", href: "/agent/profile", icon: User }]}
      onSignOut={async () => {
        await fetch("/api/bff/v1/agent/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
        router.push("/agent-login");
      }}
    >
      <AdminViewingBanner />
        <ExpiryAlert panel="agent" />
      {children}
    </ConsoleShell>
  );
}
