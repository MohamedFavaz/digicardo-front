"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import { blocksApi } from "@/lib/api/blocks";
import { analyticsApi } from "@/lib/api/analytics";
import { contactApi, type ContactSubmissionItem } from "@/lib/api/contact";
import { ApiClientError, ApiNotFoundError } from "@/lib/api/errors";
import { buildSetupChecklist } from "@/lib/dashboard/setup-checklist";
import { resolveCardData } from "@/lib/content/resolve";
import type { Profile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import type { AnalyticsOverview, AnalyticsTimeseriesPoint } from "@/types/analytics";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { MiniBars, MiniLine, MiniRing, NestlyBars, NestlyGauge, PeakPill } from "@/components/dashboard/NestlyCharts";
import { TapGlyph } from "@/components/ui/DigicardoLogo";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Eye,
  ListChecks,
  Mail,
  MousePointerClick,
  MoreHorizontal,
  Plus,
  Share2,
  Sparkles,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────────

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

function clock(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days < 1) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (days < 7) return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function useNow() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => setNow(new Date()), []);
  return now;
}

const panel = "rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]/95 shadow-[0_14px_34px_-28px_rgba(52,60,34,0.55)]";

/** "↗ +3  vs last week" chip from the reference stat tiles. */
function TrendChip({ value, text }: { value: string; text: string }) {
  return (
    <p className="mt-3 flex items-center gap-2 text-xs text-[#9A9C8F]">
      <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2E4] px-2 py-0.5 font-medium text-[#343C22]">
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        {value}
      </span>
      {text}
    </p>
  );
}

function StatTile({ label, value, unit, visual, chip }: { label: string; value: string; unit: string; visual: React.ReactNode; chip: React.ReactNode }) {
  return (
    <div className={cn(panel, "flex flex-col p-4")}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#5E6054]">{label}</p>
        <MoreHorizontal className="h-4 w-4 text-[#9A9C8F]" aria-hidden="true" />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-1.5">
          <span className="text-[34px] font-light leading-none tracking-tight text-[#121212] tabular-nums">{value}</span>
          <span className="text-sm text-[#9A9C8F]">{unit}</span>
        </p>
        <div className="shrink-0">{visual}</div>
      </div>
      {chip}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────

/**
 * Home (Nestly look): greeting, the card as a featured photo card, the visitor journey,
 * stat tiles with small charts, a views chart, setup progress as a gauge and newest messages.
 * Real data only.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const now = useNow();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [blocks, setBlocks] = React.useState<ProfileBlock[]>([]);
  const [overview, setOverview] = React.useState<AnalyticsOverview | null>(null);
  const [series, setSeries] = React.useState<AnalyticsTimeseriesPoint[]>([]);
  const [messages, setMessages] = React.useState<ContactSubmissionItem[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dashboardError, setDashboardError] = React.useState<string | null>(null);

  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setDashboardError(null);
    try {
      const [p, b, o, ts, m] = await Promise.allSettled([
        profileApi.getProfile(),
        blocksApi.getBlocks(),
        analyticsApi.getOverview({ period: "7d" }),
        analyticsApi.getTimeseries({ period: "30d" }),
        contactApi.getSubmissions(),
      ]);
      if (p.status === "fulfilled") {
        setProfile(p.value);
      } else {
        if (p.reason instanceof ApiNotFoundError) {
          setProfile(null);
          return;
        }
        if (p.reason instanceof ApiClientError) setDashboardError(p.reason.message);
      }
      setBlocks(b.status === "fulfilled" ? b.value : []);
      setOverview(o.status === "fulfilled" ? o.value : null);
      setSeries(ts.status === "fulfilled" ? [...ts.value].sort((x, y) => x.date.localeCompare(y.date)) : []);
      setMessages(m.status === "fulfilled" ? m.value : null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.push("/login?returnUrl=/dashboard");
    else if (isAuthenticated) loadDashboardData();
  }, [isAuthLoading, isAuthenticated, router, loadDashboardData]);

  if (isAuthLoading || isLoading) return <DashboardSkeleton />;

  if (!profile) {
    return (
      <OnboardingWizard
        onComplete={(created) => {
          setProfile(created);
          loadDashboardData();
        }}
      />
    );
  }

  // ── Derived ──
  const { content } = resolveCardData(profile, (profile.theme_tokens ?? {}) as ThemeTokens, blocks);
  const cover = content.identity.cover_images[0] || profile.avatar_url || "";
  const coverUrl = cover ? resolveMediaUrl(cover) : null;
  const steps = buildSetupChecklist(profile, blocks, overview?.total_views ?? 0);
  const todo = steps.filter((s) => !s.done);
  const percent = Math.round(((steps.length - todo.length) / steps.length) * 100);
  const name = profile.display_name || user?.name || "";
  const firstName = name.split(/\s+/)[0];
  const role = [content.identity.role, content.identity.company].filter(Boolean).join(" · ") || `/${profile.username}`;

  const week = series.slice(-7);
  const prevWeek = series.slice(-14, -7);
  const last14 = series.slice(-14);
  const sum = (list: AnalyticsTimeseriesPoint[], k: "views" | "clicks") => list.reduce((s, p) => s + (p[k] ?? 0), 0);
  const views = overview?.total_views ?? sum(week, "views");
  const people = overview?.unique_views ?? 0;
  const taps = overview?.total_clicks ?? sum(week, "clicks");
  const msgs = overview?.total_contact_submissions ?? 0;
  const prevViews = sum(prevWeek, "views");
  const viewChange = prevViews > 0 ? `${views >= prevViews ? "+" : ""}${Math.round(((views - prevViews) / prevViews) * 100)}%` : "New";
  const tapRate = views > 0 ? Math.round((taps / views) * 100) : 0;
  const peopleShare = views > 0 ? Math.round((people / views) * 100) : 0;

  const peakIndex = last14.reduce((best, p, i) => (p.views > (last14[best]?.views ?? 0) ? i : best), 0);
  const peak = last14[peakIndex];
  const dayLabel = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric" });

  const journey = [
    { label: "Card views", value: views },
    { label: "People", value: people },
    { label: "Button taps", value: taps },
    { label: "Messages", value: msgs },
  ];
  const journeyMax = Math.max(1, ...journey.map((j) => j.value));

  return (
    <div className="space-y-6">
      {/* ── Greeting ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-[#9A9C8F]" suppressHydrationWarning>
            {now ? now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) : " "}
          </p>
          <h1 className="mt-1 text-[30px] font-normal leading-tight tracking-tight text-[#121212] sm:text-[36px]" suppressHydrationWarning>
            {now ? (now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening") : "Welcome back"},{" "}
            <span className="text-[#8E9183]">{firstName || "there"}</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-11 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm text-[#121212] shadow-[0_6px_16px_-12px_rgba(52,60,34,0.6)]">
            <CalendarDays className="h-4 w-4 text-[#5E6054]" aria-hidden="true" /> This week
          </span>
          <Link href="/dashboard/qr" prefetch={false} className="inline-flex h-11 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm text-[#121212] shadow-[0_6px_16px_-12px_rgba(52,60,34,0.6)] hover:bg-white">
            <Share2 className="h-4 w-4 text-[#5E6054]" aria-hidden="true" /> Share
          </Link>
          <Link href="/dashboard/editor" prefetch={false} className="inline-flex h-11 items-center gap-3 rounded-full bg-[#343C22] pl-5 pr-1.5 text-sm font-medium text-white shadow-[0_12px_24px_-12px_rgba(52,60,34,0.9)] hover:bg-[#4B5634]">
            Edit card
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#343C22]">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

      {dashboardError && (
        <div role="alert" className="flex items-start gap-3 rounded-[18px] border border-[#F5C2C2] bg-[#FDECEC] p-4 text-sm text-[#991B1B]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">{dashboardError}</span>
          <button type="button" onClick={loadDashboardData} className="font-semibold underline underline-offset-2">
            Try again
          </button>
        </div>
      )}

      {!profile.content && todo.length >= 3 && (
        <Link href="/setup" className={cn(panel, "flex items-center gap-4 p-4 hover:bg-white")}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2E4] text-[#343C22]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-[#121212]">Set up your card in 3 quick steps</span>
            <span className="block text-sm text-[#5E6054]">Pick a template, add your name and number, and share it.</span>
          </span>
          <ArrowRight className="h-5 w-5 text-[#343C22]" aria-hidden="true" />
        </Link>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)_330px]">
        {/* ════════ Left: featured card + journey ════════ */}
        <div className="space-y-5">
          <div className="relative h-[320px] overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#C9D4AE_0%,#8F9A72_55%,#4B5634_100%)] shadow-[0_24px_40px_-28px_rgba(52,60,34,0.9)]">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
              <img src={coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <TapGlyph className="absolute left-1/2 top-[38%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 opacity-80" color="#FFFFFF" />
            )}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/75 px-2.5 py-1 text-xs text-[#121212] backdrop-blur">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#343C22]">
                  <TapGlyph className="h-2.5 w-2.5" color="#FFFFFF" />
                </span>
                Your card · Live
              </span>
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open my card"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/75 text-[#121212] backdrop-blur hover:bg-white"
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="absolute inset-x-3 bottom-3 rounded-[18px] border border-white/30 bg-[#1E2412]/35 p-3 text-white backdrop-blur-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[17px] font-medium">{name || "Your card"}</p>
                  <p className="truncate text-xs text-white/80">{role}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] uppercase tracking-wider text-white/70">This week</p>
                  <p className="text-[17px] font-medium tabular-nums">{views.toLocaleString()} views</p>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[
                  { icon: Eye, text: `${people} people` },
                  { icon: MousePointerClick, text: `${taps} taps` },
                  { icon: Mail, text: `${msgs} messages` },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="inline-flex items-center gap-1 rounded-full border border-white/35 bg-white/15 px-2 py-0.5 text-[11px]">
                    <Icon className="h-3 w-3" aria-hidden="true" /> {text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className={cn(panel, "p-5")} aria-labelledby="journey-title">
            <h2 id="journey-title" className="text-[17px] font-normal text-[#121212]">
              From visit to message
            </h2>
            <p className="text-xs text-[#9A9C8F]">This week, all visitors</p>
            <ul className="mt-4 space-y-4">
              {journey.map((j) => (
                <li key={j.label}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#5E6054]">{j.label}</span>
                    <span className="font-medium tabular-nums text-[#121212]">{j.value.toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E7ECDC]">
                    <div className="nestly-hatch h-full rounded-full" style={{ width: `${Math.max(j.value > 0 ? 6 : 0, (j.value / journeyMax) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ════════ Middle: stat tiles + views chart ════════ */}
        <div className="min-w-0 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatTile label="Card views" value={views.toLocaleString()} unit="views" visual={<MiniBars values={week.map((p) => p.views)} className="h-9 w-14" />} chip={<TrendChip value={viewChange} text="vs last week" />} />
            <StatTile label="People" value={people.toLocaleString()} unit="visitors" visual={<MiniRing value={peopleShare} className="h-10 w-10" />} chip={<TrendChip value={`${peopleShare}%`} text="of views are new people" />} />
            <StatTile label="Button taps" value={taps.toLocaleString()} unit="taps" visual={<MiniLine values={week.map((p) => p.clicks)} className="h-9 w-[74px]" />} chip={<TrendChip value={`${tapRate}%`} text="of views led to a tap" />} />
            <StatTile
              label="Messages"
              value={msgs.toLocaleString()}
              unit="messages"
              visual={
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2E4] text-[#343C22]">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
              }
              chip={<TrendChip value={`${messages?.length ?? 0}`} text="in your inbox" />}
            />
          </div>

          <section className={cn(panel, "p-5")} aria-labelledby="views-title">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="views-title" className="text-[17px] font-normal text-[#121212]">
                  Card views
                </h2>
                <p className="text-xs text-[#9A9C8F]">Per day, last 14 days · dashed line shows button taps</p>
              </div>
              <Link href="/dashboard/analytics" prefetch={false} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E1E1DA] bg-white px-3.5 text-[13px] text-[#121212] hover:bg-[#EEF2E4]">
                <CalendarDays className="h-3.5 w-3.5 text-[#5E6054]" aria-hidden="true" /> Analytics
              </Link>
            </div>
            {last14.length > 0 ? (
              <>
                <div className="mt-3 h-7">
                  {peak && peak.views > 0 && (
                    <PeakPill value={peak.views} unit="views" label={new Date(`${peak.date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} />
                  )}
                </div>
                <NestlyBars className="mt-2" labels={last14.map((p) => dayLabel(p.date))} values={last14.map((p) => p.views)} overlay={last14.map((p) => p.clicks)} unit="views" />
              </>
            ) : (
              <p className="mt-6 rounded-[16px] bg-[#EEF2E4] p-4 text-sm text-[#5E6054]">No visits yet. Share your card and daily views will appear here.</p>
            )}
          </section>
        </div>

        {/* ════════ Right: setup gauge + messages ════════ */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 2xl:col-span-1 2xl:grid-cols-1 2xl:content-start">
          <section className={cn(panel, "p-5")} aria-labelledby="setup-title">
            <h2 id="setup-title" className="text-[17px] font-normal text-[#121212]">
              Card setup
            </h2>
            <p className="text-xs text-[#9A9C8F]">How complete your card is</p>
            <div className="relative mx-auto mt-3 w-[220px]">
              <NestlyGauge value={percent} inner={Math.min(100, tapRate * 2)} className="w-full" />
              <div className="absolute inset-x-0 bottom-0 text-center">
                <p className="text-[30px] font-light leading-none text-[#121212] tabular-nums">{percent}%</p>
                <p className="text-xs text-[#9A9C8F]">complete</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 text-center">
              {[
                { icon: Check, value: steps.length - todo.length, label: "Done" },
                { icon: ListChecks, value: todo.length, label: "To do" },
                { icon: MousePointerClick, value: `${tapRate}%`, label: "Tap rate" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label}>
                  <Icon className="mx-auto h-4 w-4 text-[#5E6054]" aria-hidden="true" />
                  <p className="mt-1 text-xl font-light text-[#121212] tabular-nums">{value}</p>
                  <p className="text-xs text-[#9A9C8F]">{label}</p>
                </div>
              ))}
            </div>
            {todo[0] ? (
              <Link href={todo[0].href} prefetch={false} className="mt-4 flex items-center gap-3 rounded-full bg-[#343C22] py-1.5 pl-4 pr-1.5 text-sm text-white hover:bg-[#4B5634]">
                <span className="min-w-0 flex-1 truncate">Next: {todo[0].title}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#343C22]">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ) : (
              <p className="mt-4 rounded-full bg-[#EEF2E4] px-4 py-2.5 text-center text-sm text-[#343C22]">All set — keep sharing your card</p>
            )}
          </section>

          <section className={cn(panel, "p-5")} aria-labelledby="messages-title">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 id="messages-title" className="text-[17px] font-normal text-[#121212]">
                  Newest messages
                </h2>
                <p className="text-xs text-[#9A9C8F]">From your card&apos;s contact form</p>
              </div>
              <Link href="/dashboard/notifications" prefetch={false} aria-label="Open inbox" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E1E1DA] bg-white text-[#343C22] hover:bg-[#EEF2E4]">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {messages && messages.length > 0 ? (
              <ul className="mt-3 space-y-1">
                {messages.slice(0, 4).map((m) => {
                  const fresh = Date.now() - new Date(m.created_at).getTime() < 2 * 86400000;
                  return (
                    <li key={m.id}>
                      <Link href="/dashboard/notifications" prefetch={false} className="-mx-2 flex items-center gap-3 rounded-[16px] px-2 py-2 hover:bg-white">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#DDE5CB] text-sm font-medium text-[#343C22]">{initialsOf(m.name)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-[#121212]">{m.name}</span>
                          <span className="block truncate text-xs text-[#9A9C8F]">{m.message}</span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <span className="text-xs font-medium text-[#121212]" suppressHydrationWarning>
                            {clock(m.created_at)}
                          </span>
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]", fresh ? "bg-[#EEF2E4] text-[#343C22]" : "border border-[#E1E1DA] text-[#9A9C8F]")}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", fresh ? "bg-[#6E8A3A]" : "bg-[#C9CABF]")} aria-hidden="true" />
                            {fresh ? "New" : "Earlier"}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-4 rounded-[16px] bg-[#EEF2E4] p-4 text-center">
                <Mail className="mx-auto h-5 w-5 text-[#343C22]" aria-hidden="true" />
                <p className="mt-1.5 text-sm text-[#121212]">{messages === null ? "Couldn't load messages" : "No messages yet"}</p>
                <p className="mt-0.5 text-xs text-[#5E6054]">When visitors write to you from your card, they appear here.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
