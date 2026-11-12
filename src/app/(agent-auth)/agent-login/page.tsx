"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, Briefcase } from "lucide-react";
import { agentLoginSchema } from "@/lib/zod/agent";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";

export default function AgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const parsed = agentLoginSchema.safeParse({ email: normalizedEmail, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bff/v1/agent/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password, remember: true }),
      });
      const json = await res.json();
      if (json.success) {
        window.location.href = "/agent/dashboard";
      } else {
        setError(json.message || json.error?.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex antialiased">
      {/* ── Left: Brand & Partner Identity Panel ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] bg-slate-950 text-white border-r border-slate-800 flex-col justify-between p-12 xl:p-16 flex-shrink-0 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-900/60 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="group w-fit relative z-10">
          <DigicardoLogo size="md" wordmarkClassName="text-white" />
        </Link>

        {/* Center Content: Partner Network Focus */}
        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
            <Briefcase className="w-3.5 h-3.5 text-white" />
            <span>Authorized Partner Network</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Agent Partner Portal.<br />Empower your clients.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
              Manage client smart business cards, distribute personalized digital profiles, and track commission earnings from one centralized portal.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3 pt-2">
            {[
              "Bulk digital card provisioning & custom domains",
              "Direct NFC card ordering & delivery tracking",
              "Client card design & instant updates",
              "Automated commission tracking & statements",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Trust Badge */}
        <div className="border-t border-slate-800 pt-6 relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Verified Partner Console</p>
            <p className="text-[10px] text-slate-400">Restricted access for registered agency agents</p>
          </div>
        </div>
      </div>

      {/* ── Right: Login Form Panel ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar with back to home & user login switch */}
        <div className="flex items-center justify-between px-6 sm:px-10 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>

          {/* Mobile logo & User portal link */}
          <div className="flex items-center gap-4">
            <Link href="/" className="lg:hidden flex items-center">
              <DigicardoLogo size="sm" />
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              User Login &rarr;
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-sm space-y-6">

            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <span>Agent Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Partner Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Sign in to access your agent card creation and management dashboard.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 font-bold flex items-start gap-2.5 animate-in fade-in-50">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 tracking-tight">
                  Agent Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="agent@example.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900 tracking-tight">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white/70" />
                      <span>Signing in to portal...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to Agent Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Support & Account Notice */}
            <div className="pt-4 text-center border-t border-slate-100 space-y-2">
              <p className="text-xs text-slate-500 font-medium">
                Not an agent yet?{" "}
                <Link
                  href="/#contact"
                  className="font-bold text-slate-900 hover:underline"
                >
                  Apply to become a Partner
                </Link>
              </p>
              <p className="text-[11px] text-slate-400 font-normal">
                Looking for your standard profile?{" "}
                <Link href="/login" className="text-slate-700 font-semibold hover:underline">
                  Sign in as User
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 sm:px-10 pb-8 text-center">
          <p className="text-[11px] text-slate-400">
            Digicardo Agency Partner Program &copy; 2026. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

