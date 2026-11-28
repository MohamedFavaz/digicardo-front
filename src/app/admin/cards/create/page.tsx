"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AtSign, CalendarClock, Check, CheckCircle2, Copy, ExternalLink, Eye, Loader2, LogIn, Mail, Palette, Phone, PlusCircle, User } from "lucide-react";
import { ConsolePage, PageHeader, Panel } from "@/components/console/ui";
import { usernameApi } from "@/lib/api/username";
import { adminImpersonate } from "@/lib/admin/impersonate";
import { FranchiseApiError, franchiseApi } from "@/lib/franchise/api";
import { TEMPLATE_PREVIEW } from "@/lib/templates/previews";
import { TEMPLATE_MANIFESTS } from "@/templates/manifests";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  months: number;
  price: number;
  currency_symbol: string;
  is_active: boolean;
}

interface Created {
  user: { id: string; name: string; email: string; username: string; expires_at?: string | null; validity_label?: string | null };
  credentials: { email: string; username: string; plain_password: string };
}

const TEMPLATES = Object.values(TEMPLATE_MANIFESTS);
const input =
  "h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#343C22] focus:outline-none focus:ring-2 focus:ring-[#343C22]/15";

const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

function Label({ icon: Icon, children, htmlFor, optional }: { icon: typeof User; children: React.ReactNode; htmlFor: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      {children}
      {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
    </label>
  );
}

function Step({ n, title, text, children }: { n: number; title: string; text: string; children: React.ReactNode }) {
  return (
    <Panel
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#343C22] text-xs font-semibold text-white">{n}</span>
          {title}
        </span>
      }
      description={text}
    >
      <div className="p-5">{children}</div>
    </Panel>
  );
}

function CreateCard() {
  const params = useSearchParams();
  const [form, setForm] = useState({ name: params.get("name") ?? "", email: params.get("email") ?? "", mobile: "", username: "", password: "" });
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [templateId, setTemplateId] = useState("vcard");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState("");
  const [check, setCheck] = useState<{ state: "idle" | "checking" | "ok" | "bad"; message?: string }>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const [copied, setCopied] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    franchiseApi<{ plans: Plan[] }>("admin/validity-plans").then((r) => {
      const active = r.data.plans.filter((p) => p.is_active);
      setPlans(active);
      setPlanId(active.find((p) => p.months === 12)?.id ?? "");
    });
  }, []);

  // Suggest the card address from the name until the admin types one.
  useEffect(() => {
    if (!usernameTouched) setForm((f) => ({ ...f, username: slugify(f.name) }));
  }, [form.name, usernameTouched]);

  // Live availability check.
  useEffect(() => {
    const u = form.username;
    if (u.length < 3) {
      setCheck({ state: "idle" });
      return;
    }
    setCheck({ state: "checking" });
    const t = setTimeout(() => {
      usernameApi
        .check(u)
        .then((r) => setCheck(r.available ? { state: "ok" } : { state: "bad", message: r.message ?? "Not available" }))
        .catch(() => setCheck({ state: "idle" }));
    }, 400);
    return () => clearTimeout(t);
  }, [form.username]);

  const plan = plans.find((p) => p.id === planId);
  const expiry = useMemo(() => {
    if (!plan) return null;
    const d = new Date();
    d.setMonth(d.getMonth() + plan.months);
    return fmtDate(d);
  }, [plan]);
  const host = typeof window !== "undefined" ? window.location.host : "digicardo.app";

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "", form: "" }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Enter the customer's name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email.";
    if (!/^[a-z0-9_-]{3,30}$/.test(form.username)) errs.username = "3–30 characters: lowercase letters, numbers, - or _.";
    if (form.password && form.password.length < 8) errs.password = "At least 8 characters, or leave empty to generate one.";
    if (check.state === "bad") errs.username = check.message ?? "This address is taken.";
    if (Object.keys(errs).length) return setErrors(errs);

    setSaving(true);
    try {
      const r = await franchiseApi<Created>("admin/users", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          username: form.username,
          mobile: form.mobile.trim() || null,
          password: form.password || null,
          template_id: templateId,
          validity_plan_id: planId || null,
        },
      });
      setCreated(r.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors(err instanceof FranchiseApiError && Object.keys(err.fields).length ? err.fields : { form: err instanceof Error ? err.message : "Couldn't create the Admin Direct Card." });
    } finally {
      setSaving(false);
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      // ignore
    }
  }

  // ── Done
  if (created) {
    const url = `${window.location.origin}/${created.credentials.username}`;
    const rows = [
      { key: "url", label: "Admin Direct Card link", value: url },
      { key: "email", label: "Login email", value: created.credentials.email },
      { key: "password", label: "Password", value: created.credentials.plain_password },
    ];
    return (
      <ConsolePage width="narrow">
        <div className="text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F6EC] text-[#1E7B43]">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="text-[28px] font-normal tracking-tight text-[#121212]">Admin Direct Card created</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {created.user.name}&apos;s Admin Direct Card is live.{" "}
            {created.user.expires_at ? `Valid until ${fmtDate(new Date(created.user.expires_at))}${created.user.validity_label ? ` (${created.user.validity_label})` : ""}.` : "It doesn't expire."}
          </p>
        </div>
        <Panel title="Share with the customer" description="The password is shown only now. Copy it before leaving this page.">
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.key} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className={cn("truncate text-sm font-medium text-foreground", r.key === "password" && "font-mono")}>{r.value}</p>
                </div>
                <button type="button" onClick={() => void copy(r.value, r.key)} aria-label={`Copy ${r.label}`} className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-muted">
                  {copied === r.key ? <Check className="h-4 w-4 text-[#1E7B43]" /> : <Copy className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            disabled={opening}
            onClick={async () => {
              setOpening(true);
              try {
                await adminImpersonate(created.user.id);
              } catch (e) {
                alert(e instanceof Error ? e.message : "Couldn't open the Admin Direct Card.");
                setOpening(false);
              }
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#343C22] px-5 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60"
          >
            {opening ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Impersonate & design the Admin Direct Card
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-medium hover:bg-muted">
            <ExternalLink className="h-4 w-4" /> Open Admin Direct Card
          </a>
          <button
            type="button"
            onClick={() => {
              setCreated(null);
              setForm({ name: "", email: "", mobile: "", username: "", password: "" });
              setUsernameTouched(false);
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-medium hover:bg-muted"
          >
            <PlusCircle className="h-4 w-4" /> Create another
          </button>
        </div>
        <p className="text-center text-sm">
          <Link href="/admin/my-links" className="font-medium text-[#343C22] hover:underline">
            See all Admin Direct Cards
          </Link>
        </p>
      </ConsolePage>
    );
  }

  // ── Form
  return (
    <ConsolePage>
      <PageHeader title="Create Admin Direct Card" description="Make an Admin Direct Card for a customer: their details, the card address, a design and a plan." back={{ href: "/admin/my-links", label: "Admin Direct Cards" }} />

      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Step n={1} title="Customer" text="Who the Admin Direct Card is for. They sign in with this email.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label icon={User} htmlFor="cc-name">Full name</Label>
                <input id="cc-name" className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Malabar Bakes" autoComplete="off" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label icon={Mail} htmlFor="cc-email">Email</Label>
                <input id="cc-email" type="email" className={input} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="owner@example.com" autoComplete="off" />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label icon={Phone} htmlFor="cc-mobile" optional>Phone</Label>
                <input id="cc-mobile" type="tel" className={input} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="+91 98765 43210" />
                {errors.mobile && <p className="mt-1 text-xs text-destructive">{errors.mobile}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label icon={AtSign} htmlFor="cc-password" optional>Password</Label>
                <input id="cc-password" type="text" className={input} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Leave empty to generate a strong one" autoComplete="new-password" />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
              </div>
            </div>
          </Step>

          <Step n={2} title="Admin Direct Card address" text="The link the customer shares. It can be changed later; the old link keeps working.">
            <Label icon={AtSign} htmlFor="cc-username">Address</Label>
            <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-white focus-within:border-[#343C22] focus-within:ring-2 focus-within:ring-[#343C22]/15">
              <span className="flex items-center bg-muted px-3 font-mono text-sm text-muted-foreground">{host}/</span>
              <input
                id="cc-username"
                className="h-11 min-w-0 flex-1 px-3 font-mono text-sm focus:outline-none"
                value={form.username}
                onChange={(e) => {
                  setUsernameTouched(true);
                  set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
                }}
                placeholder="malabar-bakes"
              />
            </div>
            <p className={cn("mt-1.5 text-xs", check.state === "bad" || errors.username ? "text-destructive" : check.state === "ok" ? "text-[#1E7B43]" : "text-muted-foreground")}>
              {errors.username ||
                (check.state === "checking" ? "Checking…" : check.state === "ok" ? "✓ Available" : check.state === "bad" ? check.message : "Lowercase letters, numbers, - and _.")}
            </p>
          </Step>

          <Step n={3} title="Design" text="The customer can switch designs later in their editor.">
            <div role="radiogroup" aria-label="Design" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {TEMPLATES.map((t) => {
                const on = templateId === t.id;
                const src = TEMPLATE_PREVIEW[t.id];
                return (
                  <div key={t.id} className={cn("overflow-hidden rounded-2xl border-2 bg-white transition", on ? "border-[#343C22] shadow-[0_0_0_3px_rgba(52,60,34,0.12)]" : "border-border hover:border-[#C9CABF]")}>
                    <button type="button" role="radio" aria-checked={on} aria-label={t.name} onClick={() => setTemplateId(t.id)} className="block w-full text-left">
                      <span className="relative block h-44 overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element -- small static screenshot */}
                        {src && <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />}
                        {on && (
                          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#343C22] text-white">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </span>
                      <span className="block px-3 pt-2 text-sm font-medium text-foreground">{t.name}</span>
                    </button>
                    {src && (
                      <button type="button" onClick={() => setPreview(src)} className="mx-3 mb-2 mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-[#343C22] hover:underline">
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Step>

          <Step n={4} title="Plan" text="How long the Admin Direct Card stays live. It switches off when the plan ends and comes back on renewal.">
            <div role="radiogroup" aria-label="Plan" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[{ id: "", name: "No expiry", price: 0, currency_symbol: "", months: 0, is_active: true }, ...plans].map((p) => {
                const on = planId === p.id;
                return (
                  <button
                    key={p.id || "none"}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPlanId(p.id)}
                    className={cn("rounded-2xl border-2 px-3.5 py-3 text-left transition", on ? "border-[#343C22] bg-[#F3F5EC]" : "border-border bg-white hover:border-[#C9CABF]")}
                  >
                    <span className="block text-sm font-medium text-foreground">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{p.id ? `${p.currency_symbol}${Number(p.price).toLocaleString("en-IN")}` : "Free"}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              {expiry ? `The Admin Direct Card will expire on ${expiry}.` : "The Admin Direct Card will not expire."}
            </p>
          </Step>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Panel title="Summary">
            <div className="space-y-4 p-5">
              {TEMPLATE_PREVIEW[templateId] && (
                // eslint-disable-next-line @next/next/no-img-element -- static screenshot
                <img src={TEMPLATE_PREVIEW[templateId]} alt="Chosen design" className="mx-auto h-56 rounded-2xl border border-border object-cover object-top" />
              )}
              <dl className="space-y-2 text-sm">
                {[
                  ["Customer", form.name || "—"],
                  ["Admin Direct Card link", form.username ? `${host}/${form.username}` : "—"],
                  ["Design", TEMPLATES.find((t) => t.id === templateId)?.name ?? "—"],
                  ["Plan", plan ? `${plan.name} · ${plan.currency_symbol}${Number(plan.price).toLocaleString("en-IN")}` : "No expiry"],
                  ["Expires", expiry ?? "Never"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="truncate text-right font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              {errors.form && <p className="rounded-xl bg-[#FDECEC] px-3 py-2 text-sm text-destructive">{errors.form}</p>}
              <button type="submit" disabled={saving} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#343C22] text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Palette className="h-4 w-4" />}
                Create Admin Direct Card
              </button>
            </div>
          </Panel>
        </aside>
      </form>

      {preview && (
        <div role="dialog" aria-modal="true" aria-label="Design preview" onClick={() => setPreview(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-full overflow-y-auto rounded-3xl bg-white p-3" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button type="button" onClick={() => setPreview(null)} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                Close
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot */}
            <img src={preview} alt="Design preview" className="w-[300px] max-w-full rounded-2xl sm:w-[340px]" />
          </div>
        </div>
      )}
    </ConsolePage>
  );
}

export default function AdminCreateCardPage() {
  return (
    <Suspense>
      <CreateCard />
    </Suspense>
  );
}
