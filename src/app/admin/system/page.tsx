"use client";

import * as React from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock, Database, HardDrive, Loader2, RefreshCw, RotateCcw, Server, Trash2, Zap } from "lucide-react";
import { ConsolePage, EmptyState, PageHeader, Panel, StatCard, StatusPill } from "@/components/console/ui";
import { adminCall, formatDate, timeAgo, type Paged } from "@/lib/api/admin-console";

interface Check {
  status: string;
  details?: string;
  latency_ms?: number;
}
interface Health {
  status: string;
  timestamp: string;
  php_version: string;
  laravel_version: string;
  environment: string;
  checks: Record<string, Check>;
}
interface Metrics {
  users: { total: number; verified: number; new_last_24h: number; new_last_7d: number };
  profiles: { total: number; published: number };
  domains: { total: number; active: number; pending: number };
  subscriptions: { active: number };
  queues: { pending_jobs: number; failed_jobs: number };
  computed_at: string;
}
interface Task {
  name: string;
  frequency: string;
  last_run_at: string | null;
  status: string;
  next_due_at: string | null;
}
interface FailedJob {
  id: string;
  uuid: string | null;
  queue: string;
  name: string;
  exception_preview: string;
  failed_at: string;
}

const ICONS: Record<string, typeof Server> = { application: Server, database: Database, cache: Zap, queue: Activity, storage: HardDrive };

function tone(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "healthy" || status === "ok" || status === "success") return "success";
  if (status === "degraded" || status === "warning" || status === "pending" || status === "late") return "warning";
  if (status === "unhealthy" || status === "failed" || status === "error") return "danger";
  return "neutral";
}

/** Admin: is everything running? Health checks, numbers, background tasks and failed jobs. */
export default function AdminSystemPage() {
  const [health, setHealth] = React.useState<Health | null>(null);
  const [metrics, setMetrics] = React.useState<Metrics | null>(null);
  const [tasks, setTasks] = React.useState<Task[] | null>(null);
  const [failed, setFailed] = React.useState<Paged<FailedJob> | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setError(null);
    adminCall<Health>("/operations/health").then(setHealth).catch((e: Error) => setError(e.message));
    adminCall<Metrics>("/operations/metrics").then(setMetrics).catch(() => {});
    adminCall<{ tasks: Task[] }>("/operations/scheduler").then((d) => setTasks(d.tasks)).catch(() => setTasks([]));
    adminCall<Paged<FailedJob>>("/operations/failed-jobs?per_page=20").then(setFailed).catch(() => {});
  }, []);

  React.useEffect(() => load(), [load]);

  const act = async (key: string, path: string, method: "POST" | "DELETE", confirmText?: string) => {
    if (confirmText && !confirm(confirmText)) return;
    setBusy(key);
    try {
      await adminCall(path, { method });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  };

  const healthy = health?.status === "healthy";

  return (
    <ConsolePage>
      <PageHeader
        title="System health"
        description="Checks that the website, database, emails and background jobs are working."
        meta={health ? <StatusPill tone={tone(health.status)}>{healthy ? "All systems normal" : `Status: ${health.status}`}</StatusPill> : undefined}
        actions={
          <button
            type="button"
            onClick={async () => {
              setBusy("refresh");
              await adminCall("/operations/metrics/refresh", { method: "POST" }).catch(() => {});
              load();
              setBusy(null);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm font-medium hover:bg-white"
          >
            <RefreshCw className={`h-4 w-4 ${busy === "refresh" ? "animate-spin" : ""}`} aria-hidden="true" /> Refresh
          </button>
        }
      />
      {error && (
        <p className="flex items-center gap-2 rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" /> {error}
        </p>
      )}

      {/* Checks */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {health
          ? Object.entries(health.checks).map(([key, c]) => {
              const Icon = ICONS[key] ?? Server;
              return (
                <div key={key} className="rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8] p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2E4] text-[#343C22]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {tone(c.status) === "success" ? <CheckCircle2 className="h-5 w-5 text-[#1E7B43]" aria-label="Healthy" /> : <AlertTriangle className="h-5 w-5 text-[#B45309]" aria-label={c.status} />}
                  </div>
                  <p className="mt-3 text-[15px] font-medium capitalize text-foreground">{key}</p>
                  <p className="text-xs text-muted-foreground">{c.details ?? c.status}</p>
                  {typeof c.latency_ms === "number" && <p className="mt-1 text-xs text-muted-foreground">{c.latency_ms} ms</p>}
                </div>
              );
            })
          : Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-[22px]" />)}
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Users" value={metrics?.users.total ?? "—"} hint={metrics ? `${metrics.users.new_last_7d} new this week` : undefined} loading={!metrics} />
        <StatCard label="Cards" value={metrics?.profiles.total ?? "—"} hint={metrics ? `${metrics.profiles.published} public` : undefined} loading={!metrics} />
        <StatCard label="Custom domains" value={metrics?.domains.total ?? "—"} hint={metrics ? `${metrics.domains.active} live · ${metrics.domains.pending} pending` : undefined} loading={!metrics} />
        <StatCard label="Background jobs" value={metrics?.queues.pending_jobs ?? "—"} hint={metrics ? `${metrics.queues.failed_jobs} failed` : undefined} tone={metrics && metrics.queues.failed_jobs > 0 ? "danger" : "neutral"} loading={!metrics} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Scheduled tasks" icon={Clock} description="Run automatically by the server's scheduler (cron).">
          {!tasks ? (
            <div className="skeleton m-5 h-32 rounded-xl" />
          ) : tasks.length === 0 ? (
            <EmptyState icon={Clock} title="No scheduled tasks reported" />
          ) : (
            <ul className="divide-y divide-border">
              {tasks.map((t) => (
                <li key={t.name} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.frequency} · last run {t.last_run_at ? timeAgo(t.last_run_at) : "never"}
                    </p>
                  </div>
                  <StatusPill tone={tone(t.status)}>{t.status === "pending" && !t.last_run_at ? "Not run yet" : t.status}</StatusPill>
                </li>
              ))}
            </ul>
          )}
          {tasks && tasks.length > 0 && tasks.every((t) => !t.last_run_at) && (
            <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
              None of these has run yet. On the server, add the cron entry <span className="font-mono">* * * * * php artisan schedule:run</span>.
            </p>
          )}
        </Panel>

        <Panel
          title="Failed jobs"
          icon={AlertTriangle}
          description="Emails or tasks that didn't finish."
          action={
            failed && failed.items.length > 0 ? (
              <div className="flex gap-2">
                <button type="button" disabled={!!busy} onClick={() => void act("retry-all", "/operations/failed-jobs/retry-all", "POST")} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#343C22] px-3 text-xs font-medium text-white disabled:opacity-50">
                  {busy === "retry-all" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Retry all
                </button>
                <button type="button" disabled={!!busy} onClick={() => void act("flush", "/operations/failed-jobs/flush", "POST", "Delete all failed jobs? They won't be retried.")} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-destructive hover:bg-[#FDECEC] disabled:opacity-50">
                  Clear all
                </button>
              </div>
            ) : undefined
          }
        >
          {!failed ? (
            <div className="skeleton m-5 h-32 rounded-xl" />
          ) : failed.items.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="No failed jobs" text="Everything that was queued finished." />
          ) : (
            <ul className="divide-y divide-border">
              {failed.items.map((j) => (
                <li key={String(j.id)} className="flex items-start gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{j.name || "Job"}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{j.exception_preview?.split("\n")[0]}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(j.failed_at, true)}</p>
                  </div>
                  <button type="button" disabled={!!busy} onClick={() => void act(`r${j.id}`, `/operations/failed-jobs/${j.id}/retry`, "POST")} aria-label="Retry" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted disabled:opacity-50">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" disabled={!!busy} onClick={() => void act(`d${j.id}`, `/operations/failed-jobs/${j.id}`, "DELETE")} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-[#FDECEC] disabled:opacity-50">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {health && (
        <p className="text-xs text-muted-foreground">
          {health.environment} · PHP {health.php_version} · Laravel {health.laravel_version} · checked {timeAgo(health.timestamp)}
        </p>
      )}
    </ConsolePage>
  );
}
