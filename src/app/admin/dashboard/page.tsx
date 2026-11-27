"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  History,
  IdCard,
  Inbox,
  Sparkles,
  TrendingUp,
  UserCog,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink, ConsolePage, EmptyState, PageHeader, Panel, StatCard, StatusPill } from "@/components/console/ui";

interface ExpiringUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  expires_at: string;
  days_remaining: number;
}

interface AuditLog {
  id: string;
  action: string;
  created_at: string;
  actor?: { name: string; email?: string };
}

interface Overview {
  metrics?: {
    users: { total: number; active: number; suspended: number };
    profiles: { total: number };
    reports: { total_pending: number };
  };
}

interface Sales {
  today?: { total: number; count: number };
  month?: { total: number; count: number };
}

const money = (n?: number) => `₹${Math.round(n ?? 0).toLocaleString("en-IN")}`;

function timeAgo(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

const QUICK_ACTIONS: { label: string; text: string; href: string; icon: LucideIcon }[] = [
  { label: "Create a card", text: "Make a digital card for a customer", href: "/admin/cards/create", icon: UserPlus },
  { label: "Add an agent", text: "Give a partner their own portal", href: "/admin/agents/create", icon: UserCog },
  { label: "Edit plans", text: "Validity periods and prices", href: "/admin/plans", icon: Sparkles },
  { label: "See all cards", text: "Every live card and its owner", href: "/admin/my-links", icon: IdCard },
];

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [expiring, setExpiring] = useState<ExpiringUser[]>([]);
  const [expired, setExpired] = useState<ExpiringUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [sales, setSales] = useState<Sales | null>(null);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json()).catch(() => null);
    Promise.all([
      get("/api/bff/v1/admin/overview"),
      get("/api/bff/v1/admin/users/expiring"),
      get("/api/bff/v1/admin/users/expired"),
      get("/api/bff/v1/admin/sales/overview"),
      get("/api/bff/v1/admin/audit-logs?per_page=8"),
      get("/api/bff/v1/admin/access-requests?status=pending&per_page=1"),
    ])
      .then(([ov, exp, expiredD, salesD, audit, requests]) => {
        setOverview(ov?.data ?? null);
        setExpiring(exp?.data?.users || []);
        setExpired(expiredD?.data?.users || []);
        setSales(salesD?.data ?? null);
        setAuditLogs(audit?.data?.items || []);
        setPending(requests?.data?.pagination?.total || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const users = overview?.metrics?.users;
  const totalProfiles = overview?.metrics?.profiles?.total ?? 0;

  const todos = [
    pending > 0 && {
      key: "requests",
      icon: Inbox,
      tone: "primary" as const,
      title: `${pending} access request${pending === 1 ? "" : "s"} waiting`,
      text: "People asking for an account. Approve or decline them.",
      href: "/admin/access-requests",
      cta: "Review",
    },
    expired.length > 0 && {
      key: "expired",
      icon: AlertCircle,
      tone: "danger" as const,
      title: `${expired.length} account${expired.length === 1 ? " has" : "s have"} expired`,
      text: "Their cards are offline until you renew them.",
      href: "/admin/my-links?filter=expired",
      cta: "Renew",
    },
    expiring.length > 0 && {
      key: "expiring",
      icon: Clock,
      tone: "warning" as const,
      title: `${expiring.length} account${expiring.length === 1 ? "" : "s"} expire this week`,
      text: "Renew them before their cards go offline.",
      href: "/admin/my-links?filter=expiring",
      cta: "View",
    },
  ].filter(Boolean) as {
    key: string;
    icon: LucideIcon;
    tone: "primary" | "danger" | "warning";
    title: string;
    text: string;
    href: string;
    cta: string;
  }[];

  const toneIcon = { primary: "bg-primary/10 text-primary", danger: "bg-[#FDECEC] text-destructive", warning: "bg-[#FEF3C7] text-[#92400E]" };

  return (
    <ConsolePage>
      <PageHeader
        title="Overview"
        description="Here's what's happening on Digicardo today."
        actions={
          <>
            <ButtonLink href="/admin/access-requests" variant="secondary" icon={Inbox}>
              Access requests
            </ButtonLink>
            <ButtonLink href="/admin/cards/create" icon={UserPlus}>
              Create card
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Users"
          icon={Users}
          loading={loading}
          value={users?.total ?? 0}
          hint={
            <>
              {users?.active ?? 0} active{users?.suspended ? ` · ${users.suspended} suspended` : ""}
            </>
          }
          href="/admin/my-links"
        />
        <StatCard label="Live cards" icon={IdCard} loading={loading} value={totalProfiles} hint="Public card pages" href="/admin/my-links" />
        <StatCard
          label="Revenue today"
          icon={CreditCard}
          loading={loading}
          value={money(sales?.today?.total)}
          hint={`${sales?.today?.count ?? 0} order${sales?.today?.count === 1 ? "" : "s"}`}
          href="/admin/accounts"
        />
        <StatCard
          label="Revenue this month"
          icon={TrendingUp}
          loading={loading}
          value={money(sales?.month?.total)}
          hint={`${sales?.month?.count ?? 0} order${sales?.month?.count === 1 ? "" : "s"}`}
          href="/admin/accounts"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Panel title="Needs your attention" description="Things to deal with, most urgent first.">
            {loading ? (
              <div className="space-y-3 p-5">
                {[0, 1].map((i) => (
                  <div key={i} className="skeleton h-14 rounded-xl" />
                ))}
              </div>
            ) : todos.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="You're all caught up" text="No pending requests and no accounts expiring this week." />
            ) : (
              <ul className="divide-y divide-border">
                {todos.map((t) => (
                  <li key={t.key} className="flex items-center gap-4 px-5 py-4">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneIcon[t.tone]}`}>
                      <t.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-foreground">{t.title}</p>
                      <p className="text-sm text-muted-foreground">{t.text}</p>
                    </div>
                    <ButtonLink href={t.href} variant="secondary" className="h-9 px-3">
                      {t.cta}
                    </ButtonLink>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Expiring this week"
            action={
              <Link href="/admin/my-links?filter=expiring" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            }
          >
            {loading ? (
              <div className="p-5 text-sm text-muted-foreground">Loading…</div>
            ) : expiring.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="Nothing expiring" text="No accounts expire in the next 7 days." />
            ) : (
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {expiring.map((u) => (
                  <li key={u.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{u.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <StatusPill tone={u.days_remaining <= 2 ? "danger" : "warning"}>
                      {u.days_remaining === 0 ? "Today" : `${u.days_remaining} day${u.days_remaining === 1 ? "" : "s"} left`}
                    </StatusPill>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Panel title="Quick actions">
            <ul className="divide-y divide-border">
              {QUICK_ACTIONS.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} prefetch={false} className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/60">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                      <a.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{a.label}</span>
                      <span className="block truncate text-sm text-muted-foreground">{a.text}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Recent activity" icon={History}>
            {loading ? (
              <div className="p-5 text-sm text-muted-foreground">Loading…</div>
            ) : auditLogs.length === 0 ? (
              <EmptyState title="No activity yet" text="Admin actions such as approvals and plan changes show up here." />
            ) : (
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {auditLogs.map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground first-letter:uppercase">{log.action.replace(/[_.]/g, " ")}</p>
                      <p className="truncate text-sm text-muted-foreground">by {log.actor?.name || "System"}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(log.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </ConsolePage>
  );
}
