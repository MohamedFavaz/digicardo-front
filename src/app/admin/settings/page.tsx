"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Activity, AlertCircle, ArrowUpRight, CheckCircle2, Eye, EyeOff, History, Key, Loader2, Megaphone, Sparkles, type LucideIcon } from "lucide-react";
import { ConsolePage, PageHeader, Panel } from "@/components/console/ui";

const SHORTCUTS: { title: string; text: string; href: string; icon: LucideIcon }[] = [
  { title: "Plans & prices", text: "Card plans, prices and currency", href: "/admin/plans", icon: Sparkles },
  { title: "Messages", text: "Notify users and agents", href: "/admin/messages", icon: Megaphone },
  { title: "Activity log", text: "Who did what, and when", href: "/admin/activity", icon: History },
  { title: "System health", text: "Database, jobs, scheduler", href: "/admin/system", icon: Activity },
];

const input =
  "block h-11 w-full rounded-xl border border-input bg-card px-3.5 text-[15px] text-foreground outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/20";

/** Admin: your own sign-in details. (Plan prices live on Plans & prices.) */
export default function AdminSettingsPage() {
  const [form, setForm] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (form.password !== form.password_confirmation) return setMsg({ ok: false, text: "The new passwords don't match." });
    if (form.password.length < 8) return setMsg({ ok: false, text: "Use at least 8 characters." });
    setSaving(true);
    try {
      const res = await fetch("/api/bff/v1/admin/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        setMsg({ ok: true, text: "Password changed." });
        setForm({ current_password: "", password: "", password_confirmation: "" });
      } else {
        const details = json?.error?.details as Record<string, string[]> | undefined;
        setMsg({ ok: false, text: (details && Object.values(details).flat()[0]) || json?.error?.message || "Couldn't change the password." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ConsolePage>
      <PageHeader title="Settings" description="Your admin sign-in details." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Password" icon={Key} description="Use a long password you don't use anywhere else.">
          <form onSubmit={changePassword} className="space-y-4 p-5">
            {msg && (
              <p role={msg.ok ? "status" : "alert"} className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${msg.ok ? "border-[#BFE6CD] bg-[#E7F6EC] text-[#1E7B43]" : "border-[#F5C2C2] bg-[#FDECEC] text-[#991B1B]"}`}>
                {msg.ok ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <AlertCircle className="h-4 w-4" aria-hidden="true" />} {msg.text}
              </p>
            )}
            <div>
              <label htmlFor="cur-pw" className="mb-1.5 block text-sm font-medium">
                Current password
              </label>
              <div className="relative">
                <input id="cur-pw" type={show ? "text" : "password"} autoComplete="current-password" required value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} className={`${input} pr-12`} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide passwords" : "Show passwords"} className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
                  {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="new-pw" className="mb-1.5 block text-sm font-medium">
                  New password
                </label>
                <input id="new-pw" type={show ? "text" : "password"} autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
              </div>
              <div>
                <label htmlFor="new-pw2" className="mb-1.5 block text-sm font-medium">
                  Repeat new password
                </label>
                <input id="new-pw2" type={show ? "text" : "password"} autoComplete="new-password" required value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} className={input} />
              </div>
            </div>
            <div className="flex justify-end border-t border-border pt-4">
              <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#343C22] px-5 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Change password
              </button>
            </div>
          </form>
        </Panel>

        <Panel title="Where to find things" description="Platform settings live in their own pages.">
          <ul className="divide-y divide-border">
            {SHORTCUTS.map(({ title, text, href, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2E4] text-[#343C22]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{title}</span>
                    <span className="block text-xs text-muted-foreground">{text}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </ConsolePage>
  );
}
