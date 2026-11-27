"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Banknote, BarChart3, CalendarClock, CreditCard, HandCoins, Home, Inbox, KeyRound, LayoutTemplate, PlusCircle, Users, Wallet } from "lucide-react";
import { AdminViewingBanner } from "@/components/console/AdminViewingBanner";
import { ExpiryAlert } from "@/components/partner/CardExpiry";
import { ConsoleLoading, ConsoleShell, type ConsoleNavGroup } from "@/components/console/ConsoleShell";
import { FranchiseProvider, type FranchiseSession } from "@/components/franchise/FranchiseContext";
import { cn } from "@/lib/utils";

function buildNav(isOwner: boolean, renewals: number, handovers: number): ConsoleNavGroup[] {
  return [
    {
      items: [
        { title: "Home", href: "/franchise/dashboard", icon: Home, exact: true, mobile: true },
        { title: "Analytics", href: "/franchise/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Cards",
      items: [
        {
          title: isOwner ? "All cards" : "My cards",
          mobileTitle: "Cards",
          href: "/franchise/cards",
          icon: CreditCard,
          exclude: ["/franchise/cards/create"],
          mobile: true,
        },
        // Badge: expired cards + cards expiring within a week.
        { title: "Renewals", href: "/franchise/renewals", icon: CalendarClock, badge: renewals },
      ],
    },
    isOwner
      ? {
          label: "Team",
          items: [
            { title: "Staff", href: "/franchise/staff", icon: Users, mobile: true },
            { title: "Cash handovers", href: "/franchise/cash", icon: Banknote, badge: handovers },
            { title: "Payouts", href: "/franchise/payouts", icon: HandCoins },
          ],
        }
      : {
          label: "Money",
          items: [
            { title: "Hand over cash", mobileTitle: "Cash", href: "/franchise/cash", icon: Banknote, mobile: true },
            { title: "My commission", mobileTitle: "Commission", href: "/franchise/payouts", icon: Wallet },
          ],
        },
    ...(isOwner
      ? [
          {
            label: "Website",
            items: [
              { title: "Landing page", href: "/franchise/site", icon: LayoutTemplate },
              { title: "Leads", href: "/franchise/leads", icon: Inbox },
            ],
          },
        ]
      : []),
  ];
}

function CreditsMeter({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return (
    <Link href="/franchise/dashboard" prefetch={false} className="block rounded-xl border border-border bg-background p-3 transition-colors hover:border-[#D4D4D8]">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Card credits</span>
        <span className="text-muted-foreground">
          {used} / {limit}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-[#F59E0B]" : "bg-primary")} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{limit === 0 ? "No credits yet" : `${Math.max(0, limit - used)} left for the whole franchise`}</p>
    </Link>
  );
}

export default function FranchiseLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<FranchiseSession | null>(null);
  const [renewals, setRenewals] = useState(0);
  const [handovers, setHandovers] = useState(0);

  // Owner: handovers waiting to be confirmed (badge). Refreshed when the Cash page changes something.
  useEffect(() => {
    if (!session?.is_owner) return;
    const load = () =>
      fetch("/api/bff/v1/franchise/handovers?status=pending", { credentials: "include", headers: { Accept: "application/json" } })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => typeof j?.meta?.pending === "number" && setHandovers(j.meta.pending))
        .catch(() => {});
    load();
    window.addEventListener("franchise-cash-changed", load);
    return () => window.removeEventListener("franchise-cash-changed", load);
  }, [session]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/bff/v1/franchise/cards/expiring", { credentials: "include", headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.data && setRenewals((j.data.expired ?? 0) + (j.data.expiring ?? 0)))
      .catch(() => {});
  }, [session]);

  useEffect(() => {
    let alive = true;
    fetch("/api/bff/v1/franchise/auth/me", { credentials: "include", headers: { Accept: "application/json" } })
      .then(async (r) => {
        if (!alive) return;
        if (r.status === 401 || r.status === 403) {
          router.replace("/franchise-login");
          return;
        }
        const json = await r.json().catch(() => null);
        if (json?.success && json.data?.user) setSession(json.data as FranchiseSession);
        else router.replace("/franchise-login");
      })
      .catch(() => alive && router.replace("/franchise-login"));
    return () => {
      alive = false;
    };
  }, [router]);

  if (!session) return <ConsoleLoading />;

  return (
    <FranchiseProvider value={session}>
      <ConsoleShell
        role={session.is_owner ? "Franchise" : "Staff"}
        homeHref="/franchise/dashboard"
        nav={buildNav(session.is_owner, renewals, handovers)}
        footerNav={[{ title: "Account", href: "/franchise/account", icon: KeyRound }]}
        primaryAction={{ label: "New card", href: "/franchise/cards/create", icon: PlusCircle }}
        sidebarExtra={<CreditsMeter used={session.quota.cards_used} limit={session.quota.card_limit} />}
        user={{ name: session.user.name, email: session.user.email, avatarUrl: session.user.avatar_url }}
        accountLinks={[{ label: "Account & password", href: "/franchise/account", icon: KeyRound }]}
        onSignOut={async () => {
          await fetch("/api/bff/v1/franchise/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
          router.push("/franchise-login");
        }}
      >
        <AdminViewingBanner />
        <ExpiryAlert panel="franchise" />
        {children}
      </ConsoleShell>
    </FranchiseProvider>
  );
}
