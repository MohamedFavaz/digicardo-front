"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, User, Mail, Phone, CreditCard,
  Calendar, Copy, CheckCircle2, AlertCircle, Loader2,
  Globe, Lock, Eye, Sparkles,
} from "lucide-react";

interface CardDetail {
  id: string;
  card_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  revenue: string;
  agent_commission: string;
  admin_profit: string;
  notes: string | null;
  created_at: string;
  customer_user?: { id: string; name: string; email: string; status: string };
  profile?: { id: string; username: string; display_name: string; bio: string | null; avatar_url: string | null; template_id: string; is_public: boolean };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AgentCardDetailPage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const [card, setCard] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [impersonating, setImpersonating] = useState(false);

  async function handleImpersonate() {
    if (!cardId) return;
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

  useEffect(() => {
    if (!cardId) return;
    fetch(`/api/bff/v1/agent/cards/${cardId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCard(json.data);
        else setError(json.error?.message || "Card not found");
      })
      .catch(() => setError("Failed to load card"))
      .finally(() => setLoading(false));
  }, [cardId]);

  async function copyText(text: string, label: string) {
    try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 2000); } catch { /* */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <Link href="/agent/cards" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cards
        </Link>
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4" /> {error || "Card not found"}
        </div>
      </div>
    );
  }

  const profileUrl = card.profile?.username ? `/${card.profile.username}` : null;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/agent/cards" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cards
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{card.card_name || "Untitled Card"}</h1>
            <p className="text-xs text-slate-500 mt-1">Created {formatDate(card.created_at)}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold uppercase border ${card.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
              {card.status}
            </span>
            <button
              onClick={handleImpersonate}
              disabled={impersonating}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Log in as customer to edit profile, photos, links, and blocks in Studio"
            >
              {impersonating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Customize in Studio</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Customer</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Name</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{card.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{card.customer_email}</p>
              </div>
              <button onClick={() => copyText(card.customer_email, "email")} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                {copied === "email" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
            {card.customer_phone && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{card.customer_phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Card Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> Card Profile</h2>
          <div className="space-y-3">
            {profileUrl && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Profile URL</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">digicardo.app{profileUrl}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => copyText(`https://digicardo.app${profileUrl}`, "url")} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                    {copied === "url" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                  <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Display Name</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{card.profile?.display_name || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Template</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {card.profile?.template_id === "vcard" ? "VCard Business" : "Botanical Corporate"}
              </p>
            </div>
            {card.profile?.bio && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Bio</p>
                <p className="text-xs text-slate-600 mt-0.5">{card.profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> Revenue</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
              <p className="text-lg font-black text-slate-900 mt-1">₹{parseFloat(String(card.revenue || 0)).toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">My Commission</p>
              <p className="text-lg font-black text-emerald-700 mt-1">₹{parseFloat(String(card.agent_commission || 0)).toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Admin Profit</p>
              <p className="text-lg font-black text-blue-700 mt-1">₹{parseFloat(String(card.admin_profit || 0)).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Customer Login Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> Customer Access</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-700 font-medium">
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              Customer can log in at <strong>digicardo.app/login</strong> with their email and password to customize their card (add photo, social links, blocks, theme).
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Login Email</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{card.customer_email}</p>
              </div>
              <button onClick={() => copyText(card.customer_email, "login-email")} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                {copied === "login-email" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleImpersonate}
                disabled={impersonating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {impersonating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Opening Studio as Customer...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Customize Card as Customer (Impersonate)</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                Opens the Studio editor to upload profile avatar, add social links, blocks, and styling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {card.notes && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Internal Notes</h2>
          <p className="text-xs text-slate-600">{card.notes}</p>
        </div>
      )}
    </div>
  );
}

