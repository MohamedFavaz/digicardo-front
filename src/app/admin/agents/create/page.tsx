"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  DollarSign,
  Save,
  Loader2,
  AlertCircle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { createAgentSchema } from "@/lib/zod/agent";

export default function CreateAgentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<{
    id: string;
    name: string;
    email: string;
    password: string;
    card_limit: number;
    card_price: number;
    agent_commission: number;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    card_limit: "50",
    card_price: "500",
    agent_commission: "200",
    restore_on_delete: true,
  });

  const cardPriceNum = parseFloat(form.card_price) || 0;
  const agentCommissionNum = parseFloat(form.agent_commission) || 0;
  const adminProfit = Math.max(0, cardPriceNum - agentCommissionNum);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setError("");
  }

  async function copyCredentials() {
    if (!createdAgent) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const text = `Agent Account Credentials:\nPortal: ${origin}/agent-login\nEmail: ${createdAgent.email}\nPassword: ${createdAgent.password}\nCard Limit: ${createdAgent.card_limit} cards`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const cleanedEmail = form.email.trim().toLowerCase();
    const cleanedMobile = form.mobile.trim();
    const cardLimitNum = parseInt(form.card_limit) || 0;
    const priceNum = parseFloat(form.card_price) || 0;
    const commNum = parseFloat(form.agent_commission) || 0;

    if (commNum > priceNum) {
      setFieldErrors({ agent_commission: "Agent commission cannot exceed the card price." });
      setError("Agent commission cannot exceed the card price.");
      return;
    }

    const payloadToValidate: Record<string, unknown> = {
      ...form,
      email: cleanedEmail,
      card_limit: cardLimitNum,
      card_price: priceNum,
      agent_commission: commNum,
    };

    if (!cleanedMobile) {
      delete payloadToValidate.mobile;
    } else {
      payloadToValidate.mobile = cleanedMobile;
    }

    const parsed = createAgentSchema.safeParse(payloadToValidate);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() || "form";
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      const firstIssue = parsed.error.issues[0]?.message;
      if (firstIssue) setError(firstIssue);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bff/v1/admin/agents", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (json.success) {
        setCreatedAgent({
          id: json.data?.id,
          name: form.name,
          email: cleanedEmail,
          password: form.password,
          card_limit: cardLimitNum,
          card_price: priceNum,
          agent_commission: commNum,
        });
      } else {
        const errorDetails = json.error?.details || json.details || json.errors;
        if (errorDetails && typeof errorDetails === "object") {
          const be: Record<string, string> = {};
          let firstMsg = "";
          for (const [k, v] of Object.entries(errorDetails)) {
            const msg = Array.isArray(v) ? (v as string[])[0] : String(v);
            be[k] = msg;
            if (!firstMsg) firstMsg = msg;
          }
          setFieldErrors(be);
          setError(firstMsg || json.error?.message || json.message || "Please correct the errors below.");
        } else {
          setError(json.error?.message || json.message || "Failed to create agent");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function FieldError({ field }: { field: string }) {
    if (!fieldErrors[field]) return null;
    return <p className="text-xs text-red-600 font-medium mt-1">{fieldErrors[field]}</p>;
  }

  // ── Success View ──
  if (createdAgent) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="bg-card rounded-2xl border border-border shadow-xs p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Agent Created Successfully</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              The reseller agent account has been provisioned and is ready to sign in immediately via the Agent Portal.
            </p>
          </div>

          {/* Credentials Card */}
          <div className="bg-muted/50 rounded-xl border border-border p-5 text-left space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-semibold text-[#52525B] capitalize flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
                Sign-In Credentials
              </span>
              <button
                type="button"
                onClick={copyCredentials}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[#52525B] bg-card border border-border hover:bg-zinc-100 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Credentials"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Agent Name</p>
                <p className="font-semibold text-foreground mt-0.5">{createdAgent.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Login Email</p>
                <p className="font-semibold text-foreground font-mono text-xs mt-0.5">{createdAgent.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Initial Password</p>
                <p className="font-semibold text-foreground font-mono text-xs mt-0.5">{createdAgent.password}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Card Limit</p>
                <p className="font-semibold text-foreground mt-0.5">{createdAgent.card_limit} Digital Cards</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Agent Login URL:</span>
              <Link href="/agent-login" target="_blank" className="font-medium text-foreground hover:underline inline-flex items-center gap-1">
                <span>/agent-login</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setCreatedAgent(null);
                setForm({
                  name: "",
                  email: "",
                  mobile: "",
                  password: "",
                  card_limit: "50",
                  card_price: "500",
                  agent_commission: "200",
                  restore_on_delete: true,
                });
              }}
              className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold text-[#52525B] bg-card hover:bg-muted/50 transition-all"
            >
              Create Another Agent
            </button>
            <Link
              href="/admin/agents"
              className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-xs"
            >
              View All Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form View ──
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div>
        <Link href="/admin/agents" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#52525B] border border-border bg-card hover:text-black hover:bg-muted/50 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Agents
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Add an agent</h1>
        </div>
        <p className="text-muted-foreground font-medium text-xs mt-1 leading-relaxed">
          Set up a new reseller agent with card creation limits and commission structure.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agent Information */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold text-foreground mb-1">Agent Information</h2>
          <p className="text-xs text-muted-foreground font-medium mb-5">Basic details and login credentials</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Agent name"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400" />
              <FieldError field="name" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email *</label>
              <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="agent@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400" />
              <FieldError field="email" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> Mobile</label>
              <input type="tel" value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} placeholder="+91 9876543210 (Optional)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400" />
              <FieldError field="mobile" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1.5"><Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password *</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#52525B]">
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <FieldError field="password" />
            </div>
          </div>
        </div>

        {/* Card Limits */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold text-foreground mb-1">Card Creation Limit</h2>
          <p className="text-xs text-muted-foreground font-medium mb-5">Maximum number of digital cards this agent can create</p>
          <div className="max-w-xs">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1.5"><CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> Card Limit *</label>
            <input type="number" value={form.card_limit} onChange={(e) => updateField("card_limit", e.target.value)} placeholder="50" min="1" max="100000"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400" />
            <FieldError field="card_limit" />
            <p className="text-xs text-muted-foreground mt-1.5">Agent cannot create cards beyond this limit. You can change it later.</p>
          </div>
          <div className="mt-4 flex items-start gap-2">
            <input type="checkbox" id="restore_on_delete" checked={form.restore_on_delete} onChange={(e) => updateField("restore_on_delete", e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-foreground focus:ring-primary/20" />
            <label htmlFor="restore_on_delete" className="text-xs text-[#52525B]">
              <span className="font-semibold">Restore quota on card delete</span>
              <span className="block text-xs text-muted-foreground mt-0.5">When enabled, deleting a card returns the credit back to the agent&apos;s quota</span>
            </label>
          </div>
        </div>

        {/* Pricing & Commission */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold text-foreground mb-1">Pricing & Commission</h2>
          <p className="text-xs text-muted-foreground font-medium mb-5">Configure the revenue split for each card sold</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1.5"><DollarSign className="w-3.5 h-3.5 text-muted-foreground" /> Card Price (₹)</label>
              <input type="number" value={form.card_price} onChange={(e) => updateField("card_price", e.target.value)} placeholder="500" min="0" step="1"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400" />
              <FieldError field="card_price" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 mb-1.5"><DollarSign className="w-3.5 h-3.5 text-amber-500" /> Agent Commission (₹)</label>
              <input type="number" value={form.agent_commission} onChange={(e) => updateField("agent_commission", e.target.value)} placeholder="200" min="0" step="1"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400" />
              <FieldError field="agent_commission" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Admin Profit (₹)</label>
              <div className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700">₹{adminProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Auto-calculated</p>
            </div>
          </div>
          <div className="mt-5 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-3"><Info className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs font-semibold text-[#52525B]">Revenue Split Preview</span></div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 text-center p-2 rounded-lg bg-card border border-border">
                <p className="font-semibold text-foreground">₹{cardPriceNum}</p>
                <p className="text-xs text-muted-foreground font-semibold">Card Price</p>
              </div>
              <span className="text-muted-foreground font-semibold">=</span>
              <div className="flex-1 text-center p-2 rounded-lg bg-amber-50 border border-amber-200/60">
                <p className="font-semibold text-amber-700">₹{agentCommissionNum}</p>
                <p className="text-xs text-amber-600 font-semibold">Agent Gets</p>
              </div>
              <span className="text-muted-foreground font-semibold">+</span>
              <div className="flex-1 text-center p-2 rounded-lg bg-emerald-50 border border-emerald-200/60">
                <p className="font-semibold text-emerald-700">₹{adminProfit}</p>
                <p className="text-xs text-emerald-600 font-semibold">Admin Gets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/agents" className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold text-[#52525B] hover:bg-muted/50 transition-all">Cancel</Link>
          <button type="submit" disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 shadow-xs transition-all disabled:opacity-50">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Create Agent
          </button>
        </div>
      </form>
    </div>
  );
}
