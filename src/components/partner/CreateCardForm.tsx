"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, CreditCard, Save, Loader2, AlertCircle, CheckCircle2, AtSign, FileText, Lock, Eye, EyeOff, Copy, ExternalLink, Sparkles, Check } from "lucide-react";
import { createAgentCardSchema } from "@/lib/zod/agent";
import { createFranchiseCardSchema } from "@/lib/zod/franchise";
import { TEMPLATE_MANIFESTS } from "@/templates/manifests";
import { TEMPLATE_PREVIEW } from "@/lib/templates/previews";
import { agentImpersonate } from "@/lib/agent/impersonate";
import { franchiseImpersonate } from "@/lib/franchise/api";

/** Every approved template, Classic first (same order as the editor's Design tab). */
const TEMPLATES = Object.values(TEMPLATE_MANIFESTS);


/**
 * "New card" form shared by the agent portal and the franchise panel. The franchise version also
 * asks how much the customer paid (used for percentage staff commission).
 */
export function CreateCardForm({ panel }: { panel: "agent" | "franchise" }) {
  const isFranchise = panel === "franchise";
  const apiBase = `/api/bff/v1/${panel}`;
  const cardsHref = `/${panel}/cards`;
  const openStudio = isFranchise ? franchiseImpersonate : agentImpersonate;
  const schema = isFranchise ? createFranchiseCardSchema : createAgentCardSchema;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [impersonating, setImpersonating] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [createdCard, setCreatedCard] = useState<{
    id?: string;
    username: string;
    email: string;
    password: string;
    card_name: string;
    public_url: string;
    expires_at?: string | null;
    plan?: string | null;
  } | null>(null);
  const [copied, setCopied] = useState("");
  const [previewing, setPreviewing] = useState<{ name: string; src: string } | null>(null);
  // Franchise owner only: who took this order (the owner or one of their active staff).
  const [takers, setTakers] = useState<{ id: string; name: string }[] | null>(null);
  const [takenBy, setTakenBy] = useState("");
  // The admin's validity plans: the card expires after the chosen plan's months.
  const [plans, setPlans] = useState<{ id: string; name: string; months: number; price: number; currency_symbol: string }[]>([]);
  const [planId, setPlanId] = useState("");

  const [form, setForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    username: "", display_name: "", card_name: "", bio: "",
    template_id: "botanical", password: "", notes: "", sale_amount: "",
  });

  useEffect(() => {
    fetch(`${apiBase}/cards/limits`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setRemaining(json.data?.remaining_credits ?? json.data?.remaining ?? null);
      }).catch(() => { });
  }, [apiBase]);

  useEffect(() => {
    fetch(`${apiBase}/cards/plans`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const list = Array.isArray(json?.data) ? json.data : [];
        setPlans(list);
        // Start on the franchise's default plan (set by the admin), else the 1-year plan.
        const start = list.find((p: { is_default?: boolean }) => p.is_default) ?? list.find((p: { months: number }) => p.months === 12);
        if (start) setPlanId(start.id);
      })
      .catch(() => {});
  }, [apiBase]);

  const chosenPlan = plans.find((p) => p.id === planId);
  const planExpiry = chosenPlan
    ? (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + chosenPlan.months);
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      })()
    : null;

  useEffect(() => {
    if (!isFranchise) return;
    // The staff list answers only for the owner; staff get 403 and no picker (their cards are theirs).
    Promise.all([
      fetch("/api/bff/v1/franchise/auth/me", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/bff/v1/franchise/staff", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([me, staff]) => {
        if (!me?.data?.is_owner || !Array.isArray(staff?.data)) return;
        const active = (staff.data as { id: string; name: string; status: string }[]).filter((x) => x.status === "active");
        setTakers([{ id: me.data.user.id, name: "Me (owner)" }, ...active.map((x) => ({ id: x.id, name: x.name }))]);
        setTakenBy(me.data.user.id);
      })
      .catch(() => {});
  }, [isFranchise]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setError("");
  }

  async function copyToClipboard(text: string, label: string) {
    try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 2000); } catch { /* ignore */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setFieldErrors({});

    if (remaining !== null && remaining <= 0) { setError("You have no remaining card credits. Contact admin to increase your limit."); return; }

    // Strip empty optional strings to undefined so Zod .optional() validators pass
    const cleanedForm: Record<string, unknown> = { ...form };
    const optionalFields = ["customer_phone", "display_name", "card_name", "bio", "password", "notes", "sale_amount"];
    if (!isFranchise) delete cleanedForm.sale_amount;
    if (planId) cleanedForm.validity_plan_id = planId;
    if (isFranchise && takers && takenBy) cleanedForm.taken_by_id = takenBy;
    for (const field of optionalFields) {
      if (typeof cleanedForm[field] === "string" && (cleanedForm[field] as string).trim() === "") {
        delete cleanedForm[field];
      }
    }

    const parsed = schema.safeParse(cleanedForm);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) { const k = issue.path[0]?.toString() || "form"; if (!errors[k]) errors[k] = issue.message; }
      setFieldErrors(errors); return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/cards`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (json.success) {
        // Show success with customer credentials
        setCreatedCard({
          id: json.data?.id,
          // The backend says where the card really opens (agent domain or main site).
          public_url: json.data?.public_url || `${window.location.origin}/${form.username}`,
          username: form.username,
          email: form.customer_email,
          password: form.password || "(auto-generated)",
          card_name: form.card_name || form.customer_name,
          expires_at: json.data?.customer_user?.expires_at ?? null,
          plan: json.data?.customer_user?.validity_label ?? null,
        });
      }
      else {
        setError(json.message || json.error?.message || "Failed to create card");
        if (json.error?.details) {
          const be: Record<string, string> = {};
          for (const [k, v] of Object.entries(json.error.details)) {
            be[k] = Array.isArray(v) ? (v as string[])[0] : String(v);
          }
          setFieldErrors(be);
        }
      }
    } catch { setError("Network error."); } finally { setSubmitting(false); }
  }

  async function handleImpersonate(cardId?: string) {
    if (!cardId) {
      router.push(cardsHref);
      return;
    }
    setImpersonating(true);
    try {
      await openStudio(cardId);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't open the card. Please try again.");
    } finally {
      setImpersonating(false);
    }
  }

  function FieldError({ field }: { field: string }) {
    if (!fieldErrors[field]) return null;
    return <p className="text-xs text-red-600 font-medium mt-1">{fieldErrors[field]}</p>;
  }

  // ── Success Screen ──
  if (createdCard) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#F5F3FE] border border-[#EFECFD] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Card Created Successfully</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Share these login credentials with your customer</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-xs font-semibold capitalize text-[#52525B] mb-3">Customer Login Credentials</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-4 py-3 bg-background/50 rounded-lg border border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Profile URL</p>
                <p className="text-xs font-semibold text-primary mt-0.5 break-all">{createdCard.public_url.replace(/^https?:\/\//, "")}</p>
              </div>
              <button onClick={() => copyToClipboard(createdCard.public_url, "url")}
                className="p-1.5 rounded-md hover:bg-zinc-200/60 transition-colors">
                {copied === "url" ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-background/50 rounded-lg border border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Email</p>
                <p className="text-xs font-semibold text-[#52525B] mt-0.5">{createdCard.email}</p>
              </div>
              <button onClick={() => copyToClipboard(createdCard.email, "email")}
                className="p-1.5 rounded-md hover:bg-zinc-200/60 transition-colors">
                {copied === "email" ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-background/50 rounded-lg border border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Password</p>
                <p className="text-xs font-semibold text-[#52525B] mt-0.5 font-mono">{createdCard.password}</p>
              </div>
              <button onClick={() => copyToClipboard(createdCard.password, "password")}
                className="p-1.5 rounded-md hover:bg-zinc-200/60 transition-colors">
                {copied === "password" ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-background/50 rounded-lg border border-border">
            <div>
              <p className="text-xs font-semibold text-muted-foreground capitalize">Valid until</p>
              <p className="text-xs font-semibold text-[#52525B] mt-0.5">
                {createdCard.expires_at
                  ? `${new Date(createdCard.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}${createdCard.plan ? ` (${createdCard.plan} plan)` : ""}`
                  : "No expiry"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium mt-3">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Share these credentials with your customer so they can sign in at {typeof window !== "undefined" ? window.location.host : ""}/login to edit their card.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
          {createdCard.id && (
            <button
              type="button"
              onClick={() => handleImpersonate(createdCard.id)}
              disabled={impersonating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {impersonating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Opening Studio...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Customize Card in Studio Now</span>
                </>
              )}
            </button>
          )}
          <Link href={cardsHref} className="w-full sm:w-auto text-center px-4 py-2.5 rounded-lg border border-border text-xs font-semibold text-[#52525B] bg-card hover:bg-background transition-all">
            View All Cards
          </Link>
          <a href={createdCard.public_url} target="_blank" rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-background border border-border text-[#52525B] text-xs font-semibold rounded-lg hover:bg-zinc-200/60 transition-all">
            <ExternalLink className="w-3.5 h-3.5" /> View Live Card
          </a>
        </div>
      </div>
    );
  }

  // ── Create Form ──
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div>
        <Link href={cardsHref} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cards
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">New card</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Create a new digital business card for your customer</p>
      </div>

      {remaining !== null && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border ${remaining > 0 ? "bg-[#F5F3FE] border-[#EFECFD] text-primary" : "bg-red-50 border-red-200 text-red-700"}`}>
          <CreditCard className="w-4 h-4 flex-shrink-0" />
          {remaining > 0 ? `You have ${remaining} card credit${remaining !== 1 ? "s" : ""} remaining` : (isFranchise ? "No credits remaining. Ask your franchise owner." : "No credits remaining. Contact admin.")}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info Card */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div>
            <h2 className="text-xs font-semibold capitalize text-[#52525B]">Customer Information</h2>
            <p className="text-xs text-muted-foreground">Details of the customer who will own this card</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] mb-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Customer Name *
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => updateField("customer_name", e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
              <FieldError field="customer_name" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] mb-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email *
              </label>
              <input
                type="email"
                value={form.customer_email}
                onChange={(e) => updateField("customer_email", e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
              <FieldError field="customer_email" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] mb-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone
              </label>
              <input
                type="tel"
                value={form.customer_phone}
                onChange={(e) => updateField("customer_phone", e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
              <FieldError field="customer_phone" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] mb-1.5">
                <AtSign className="w-3.5 h-3.5 text-muted-foreground" /> Username *
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="johndoe"
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
              <FieldError field="username" />
              <p className="text-xs text-muted-foreground mt-1">Profile URL: digicardo.app/{form.username || "username"}</p>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] mb-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Customer Account Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Set initial password for customer login"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#52525B] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <FieldError field="password" />
              <p className="text-xs text-muted-foreground mt-1">Customer uses this password to log in at digicardo.app/login.</p>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div>
            <h2 className="text-xs font-semibold capitalize text-[#52525B]">Card Details</h2>
            <p className="text-xs text-muted-foreground">Configure the digital business card</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] mb-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Display Name
              </label>
              <input
                type="text"
                value={form.display_name}
                onChange={(e) => updateField("display_name", e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] mb-1.5">
                <CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> Card Name
              </label>
              <input
                type="text"
                value={form.card_name}
                onChange={(e) => updateField("card_name", e.target.value)}
                placeholder="Business Card"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="A short bio..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
            </div>

            <div className="sm:col-span-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#52525B] block">Template</span>
                <span className="text-xs font-medium text-muted-foreground">{TEMPLATES.length} designs · the customer can switch later</span>
              </div>

              <div role="radiogroup" aria-label="Template" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {TEMPLATES.map((t) => {
                  const active = form.template_id === t.id;
                  const preview = TEMPLATE_PREVIEW[t.id];
                  return (
                    <div
                      key={t.id}
                      className={`overflow-hidden rounded-xl border-2 bg-card transition-all ${active ? "border-[#5B3FE4] shadow-[0_0_0_3px_rgba(91,63,228,0.12)]" : "border-border hover:border-zinc-300"}`}
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={t.name}
                        onClick={() => updateField("template_id", t.id)}
                        className="block w-full cursor-pointer text-left"
                      >
                        <span className="relative block h-52 overflow-hidden bg-muted">
                          {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element -- small static screenshot from /public
                            <img src={preview} alt={`${t.name} design`} loading="lazy" className="h-full w-full object-cover object-top" />
                          ) : (
                            <span className="flex h-full items-center justify-center text-xs text-muted-foreground">{t.name}</span>
                          )}
                          {active && (
                            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </span>
                        <span className="block px-3 pt-2.5">
                          <span className="block text-xs font-semibold text-foreground">{t.name}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground line-clamp-2">{t.description}</span>
                        </span>
                      </button>
                      {preview && (
                        <button
                          type="button"
                          onClick={() => setPreviewing({ name: t.name, src: preview })}
                          className="mx-3 mb-2.5 mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {previewing && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${previewing.name} design`}
                  onClick={() => setPreviewing(null)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                >
                  <div className="relative max-h-full overflow-y-auto rounded-3xl bg-white p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="mb-2 flex items-center justify-between gap-6 px-1">
                      <span className="text-sm font-semibold text-foreground">{previewing.name}</span>
                      <button type="button" onClick={() => setPreviewing(null)} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                        Close
                      </button>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot from /public */}
                    <img src={previewing.src} alt={`${previewing.name} design`} className="w-[300px] max-w-full rounded-2xl sm:w-[340px]" />
                  </div>
                </div>
              )}

            </div>

            {plans.length > 0 && (
              <div>
                <label htmlFor="card-plan" className="text-xs font-medium text-[#52525B] mb-1.5 block">Plan</label>
                <select
                  id="card-plan"
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
                >
                  <option value="">No expiry</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.currency_symbol}{Number(p.price).toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
                <FieldError field="validity_plan_id" />
                <p className="text-xs text-muted-foreground mt-1">
                  {planExpiry ? `The card will expire on ${planExpiry}.` : "The card will not expire."}
                </p>
              </div>
            )}

            {isFranchise && takers && (
              <div>
                <label htmlFor="taken-by" className="text-xs font-medium text-[#52525B] mb-1.5 block">Order taken by</label>
                <select
                  id="taken-by"
                  value={takenBy}
                  onChange={(e) => setTakenBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
                >
                  {takers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <FieldError field="taken_by_id" />
                <p className="text-xs text-muted-foreground mt-1">The card and its commission go to this person.</p>
              </div>
            )}

            {isFranchise && (
              <div>
                <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Amount collected from customer (₹)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={form.sale_amount}
                  onChange={(e) => updateField("sale_amount", e.target.value)}
                  placeholder="799"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
                />
                <FieldError field="sale_amount" />
                <p className={`text-xs mt-1 ${form.sale_amount ? "text-muted-foreground" : "text-amber-700 font-medium"}`}>
                  {form.sale_amount
                    ? "Counts in your collected money and works out a percentage commission."
                    : "Enter what the customer paid. Leave it empty only if they haven't paid yet; you can add it later on the card."}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-[#52525B] mb-1.5 block">Notes (internal)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Internal notes..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={cardsHref}
            className="px-4 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-[#52525B] hover:bg-background transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || (remaining !== null && remaining <= 0)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Create Card</span>
          </button>
        </div>
      </form>
    </div>
  );
}
