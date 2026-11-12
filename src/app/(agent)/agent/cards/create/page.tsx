"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, CreditCard, Save, Loader2, AlertCircle, CheckCircle2, AtSign, FileText, Lock, Eye, EyeOff, Copy, ExternalLink, Sparkles, Check } from "lucide-react";
import { createAgentCardSchema } from "@/lib/zod/agent";

export default function AgentCreateCardPage() {
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
  } | null>(null);
  const [copied, setCopied] = useState("");

  const [form, setForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    username: "", display_name: "", card_name: "", bio: "",
    template_id: "botanical", password: "", notes: "",
  });

  useEffect(() => {
    fetch("/api/bff/v1/agent/cards/limits", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setRemaining(json.data?.remaining_credits ?? json.data?.remaining ?? null);
      }).catch(() => { });
  }, []);

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
    const optionalFields = ["customer_phone", "display_name", "card_name", "bio", "password", "notes"];
    for (const field of optionalFields) {
      if (typeof cleanedForm[field] === "string" && (cleanedForm[field] as string).trim() === "") {
        delete cleanedForm[field];
      }
    }

    const parsed = createAgentCardSchema.safeParse(cleanedForm);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) { const k = issue.path[0]?.toString() || "form"; if (!errors[k]) errors[k] = issue.message; }
      setFieldErrors(errors); return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bff/v1/agent/cards", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (json.success) {
        // Show success with customer credentials
        setCreatedCard({
          id: json.data?.id,
          username: form.username,
          email: form.customer_email,
          password: form.password || "(auto-generated)",
          card_name: form.card_name || form.customer_name,
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
      router.push("/agent/cards");
      return;
    }
    setImpersonating(true);
    try {
      const res = await fetch(`/api/bff/v1/agent/cards/${cardId}/impersonate`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("digicardo_impersonating", "true");
          localStorage.setItem("digicardo_impersonator_role", "agent");
          document.cookie = "digicardo_impersonating=true; path=/; max-age=86400;";
        }
        window.location.href = json.data?.redirect_url || "/dashboard";
      } else {
        alert(json.error?.message || json.message || "Failed to impersonate customer.");
      }
    } catch {
      alert("Network error while trying to customize card.");
    } finally {
      setImpersonating(false);
    }
  }

  function FieldError({ field }: { field: string }) {
    if (!fieldErrors[field]) return null;
    return <p className="text-[11px] text-red-600 font-medium mt-1">{fieldErrors[field]}</p>;
  }

  // ── Success Screen ──
  if (createdCard) {
    return (
      <div className="p-6 lg:p-8 max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#EDF5F2] border border-[#D5EBE4] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-[#0F766E]" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Card Created Successfully</h1>
          <p className="text-xs text-slate-500 mt-1">Share these login credentials with your customer</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E3DFD9] p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Customer Login Credentials</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-4 py-3 bg-[#F5F2EE]/50 rounded-lg border border-[#E3DFD9]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile URL</p>
                <p className="text-xs font-semibold text-[#0F766E] mt-0.5">digicardo.app/{createdCard.username}</p>
              </div>
              <button onClick={() => copyToClipboard(`https://digicardo.app/${createdCard.username}`, "url")}
                className="p-1.5 rounded-md hover:bg-slate-200/60 transition-colors">
                {copied === "url" ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-[#F5F2EE]/50 rounded-lg border border-[#E3DFD9]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{createdCard.email}</p>
              </div>
              <button onClick={() => copyToClipboard(createdCard.email, "email")}
                className="p-1.5 rounded-md hover:bg-slate-200/60 transition-colors">
                {copied === "email" ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-[#F5F2EE]/50 rounded-lg border border-[#E3DFD9]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 font-mono">{createdCard.password}</p>
              </div>
              <button onClick={() => copyToClipboard(createdCard.password, "password")}
                className="p-1.5 rounded-md hover:bg-slate-200/60 transition-colors">
                {copied === "password" ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-800 font-medium mt-3">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Share these credentials with your customer so they can log in at digicardo.app/login to customize their card.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
          {createdCard.id && (
            <button
              type="button"
              onClick={() => handleImpersonate(createdCard.id)}
              disabled={impersonating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D6B63] text-white text-xs font-semibold rounded-lg transition-all shadow-2xs cursor-pointer disabled:opacity-50"
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
          <Link href="/agent/cards" className="w-full sm:w-auto text-center px-4 py-2.5 rounded-lg border border-[#E3DFD9] text-xs font-semibold text-slate-700 bg-white hover:bg-[#F5F2EE] transition-all">
            View All Cards
          </Link>
          <a href={`/${createdCard.username}`} target="_blank" rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#F5F2EE] border border-[#E3DFD9] text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200/60 transition-all">
            <ExternalLink className="w-3.5 h-3.5" /> View Live Card
          </a>
        </div>
      </div>
    );
  }

  // ── Create Form ──
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/agent/cards" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cards
        </Link>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Digital Card</h1>
        <p className="text-xs text-slate-500 mt-0.5">Create a new digital business card for your customer</p>
      </div>

      {remaining !== null && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border ${remaining > 0 ? "bg-[#EDF5F2] border-[#D5EBE4] text-[#0F766E]" : "bg-red-50 border-red-200 text-red-700"}`}>
          <CreditCard className="w-4 h-4 flex-shrink-0" />
          {remaining > 0 ? `You have ${remaining} card credit${remaining !== 1 ? "s" : ""} remaining` : "No credits remaining. Contact admin."}
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
        <div className="bg-white rounded-xl border border-[#E3DFD9] p-5 space-y-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Customer Information</h2>
            <p className="text-[11px] text-slate-400">Details of the customer who will own this card</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Customer Name *
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => updateField("customer_name", e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
              <FieldError field="customer_name" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email *
              </label>
              <input
                type="email"
                value={form.customer_email}
                onChange={(e) => updateField("customer_email", e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
              <FieldError field="customer_email" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
              </label>
              <input
                type="tel"
                value={form.customer_phone}
                onChange={(e) => updateField("customer_phone", e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
              <FieldError field="customer_phone" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
                <AtSign className="w-3.5 h-3.5 text-slate-400" /> Username *
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="johndoe"
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
              <FieldError field="username" />
              <p className="text-[10px] text-slate-400 mt-1">Profile URL: digicardo.app/{form.username || "username"}</p>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Customer Account Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Set initial password for customer login"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <FieldError field="password" />
              <p className="text-[10px] text-slate-400 mt-1">Customer uses this password to log in at digicardo.app/login.</p>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="bg-white rounded-xl border border-[#E3DFD9] p-5 space-y-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Card Details</h2>
            <p className="text-[11px] text-slate-400">Configure the digital business card</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Display Name
              </label>
              <input
                type="text"
                value={form.display_name}
                onChange={(e) => updateField("display_name", e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Card Name
              </label>
              <input
                type="text"
                value={form.card_name}
                onChange={(e) => updateField("card_name", e.target.value)}
                placeholder="Business Card"
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-700 mb-1.5 block">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="A short bio..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
            </div>

            <div className="sm:col-span-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 block">Template</label>
                <span className="text-[11px] font-medium text-slate-400">2 approved designs available</span>
              </div>

              {/* Two Visual Template Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => updateField("template_id", "botanical")}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${form.template_id === "botanical"
                      ? "border-[#0F766E] bg-[#D5EBE4]/25 shadow-2xs"
                      : "border-[#E3DFD9] bg-white hover:border-slate-300"
                    }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Botanical Corporate</span>
                    {form.template_id === "botanical" && (
                      <span className="w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Executive visiting card featuring organic background layers, 5 corporate color schemes, and PDF/Drive vault.
                  </p>
                </div>

                <div
                  onClick={() => updateField("template_id", "vcard")}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${form.template_id === "vcard"
                      ? "border-[#0F766E] bg-[#D5EBE4]/25 shadow-2xs"
                      : "border-[#E3DFD9] bg-white hover:border-slate-300"
                    }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">VCard Business</span>
                    {form.template_id === "vcard" && (
                      <span className="w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    3-column digital card with action icon grid (Call, Bank, QR, WhatsApp) and contact sharing modals.
                  </p>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div>
                <select
                  value={form.template_id}
                  onChange={(e) => updateField("template_id", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
                >
                  <option value="botanical">Botanical Corporate</option>
                  <option value="vcard">VCard Business</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1.5 block">Notes (internal)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Internal notes..."
                className="w-full px-3 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/agent/cards"
            className="px-4 py-2 rounded-lg border border-[#E3DFD9] bg-white text-xs font-semibold text-slate-700 hover:bg-[#F5F2EE] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || (remaining !== null && remaining <= 0)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#0F766E] hover:bg-[#0D6B63] text-white text-xs font-semibold rounded-lg transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Create Card</span>
          </button>
        </div>
      </form>
    </div>
  );
}
