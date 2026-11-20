"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, User, Mail, Phone, CreditCard,
  Calendar, Copy, CheckCircle2, AlertCircle, Loader2,
  Globe, Lock, Eye, Sparkles,
} from "lucide-react";
import { agentImpersonate } from "@/lib/agent/impersonate";

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
      await agentImpersonate(cardId);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't open the card. Please try again.");
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
        <Link href="/agent/cards" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4">
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
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div>
        <Link href="/agent/cards" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cards
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{card.card_name || "Untitled Card"}</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">Created {formatDate(card.created_at)}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${card.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted/50 text-[#52525B] border-border"}`}>
              {card.status}
            </span>
            <button
              onClick={handleImpersonate}
              disabled={impersonating}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> Customer</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Name</p>
                <p className="text-xs font-semibold text-[#52525B] mt-0.5">{card.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Email</p>
                <p className="text-xs font-semibold text-[#52525B] mt-0.5">{card.customer_email}</p>
              </div>
              <button onClick={() => copyText(card.customer_email, "email")} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
                {copied === "email" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>
            {card.customer_phone && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Phone</p>
                <p className="text-xs font-semibold text-[#52525B] mt-0.5">{card.customer_phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Card Profile */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" /> Card Profile</h2>
          <div className="space-y-3">
            {profileUrl && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground capitalize">Profile URL</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">digicardo.app{profileUrl}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => copyText(`https://digicardo.app${profileUrl}`, "url")} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
                    {copied === "url" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                  <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-muted-foreground capitalize">Display Name</p>
              <p className="text-xs font-semibold text-[#52525B] mt-0.5">{card.profile?.display_name || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground capitalize">Template</p>
              <p className="text-xs font-semibold text-[#52525B] mt-0.5">
                {card.profile?.template_id === "vcard" ? "Classic" : "Botanical"}
              </p>
            </div>
            {card.profile?.bio && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Bio</p>
                <p className="text-xs text-[#52525B] mt-0.5">{card.profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" /> Revenue</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs font-semibold text-muted-foreground capitalize">Revenue</p>
              <p className="text-lg font-semibold text-foreground mt-1">₹{parseFloat(String(card.revenue || 0)).toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-600 capitalize">My Commission</p>
              <p className="text-lg font-semibold text-emerald-700 mt-1">₹{parseFloat(String(card.agent_commission || 0)).toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 capitalize">Admin Profit</p>
              <p className="text-lg font-semibold text-blue-700 mt-1">₹{parseFloat(String(card.admin_profit || 0)).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Customer Login Info */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-muted-foreground" /> Customer Access</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 font-medium">
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              Customer can log in at <strong>digicardo.app/login</strong> with their email and password to customize their card (add photo, social links, blocks, theme).
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground capitalize">Login Email</p>
                <p className="text-xs font-semibold text-[#52525B] mt-0.5">{card.customer_email}</p>
              </div>
              <button onClick={() => copyText(card.customer_email, "login-email")} className="p-1.5 rounded-lg hover:bg-zinc-200 transition-colors">
                {copied === "login-email" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleImpersonate}
                disabled={impersonating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
              <p className="text-xs text-muted-foreground text-center mt-1.5">
                Opens the Studio editor to upload profile avatar, add social links, blocks, and styling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {card.notes && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-sm font-semibold text-foreground mb-2">Internal Notes</h2>
          <p className="text-xs text-[#52525B]">{card.notes}</p>
        </div>
      )}
    </div>
  );
}

