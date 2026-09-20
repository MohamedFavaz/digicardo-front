import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Compass, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-[#faf9f5] text-foreground antialiased selection:bg-brand-500/20 selection:text-brand-900 select-none">
      
      {/* ── Outer Card ── */}
      <div className="w-full max-w-md space-y-6 rounded-[36px] border border-border/80 bg-card p-8 sm:p-10 text-center shadow-float animate-in zoom-in-95 duration-300">
        
        {/* Brand Icon Header */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-2xs">
          <SearchX className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black uppercase tracking-wider font-mono">
            Profile Not Found · 404
          </span>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            This Digicardo page doesn&apos;t exist yet.
          </h1>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">
            The handle you are looking for may have been renamed, removed, or has not been claimed yet.
          </p>
        </div>

        {/* Claim Handle Banner */}
        <div className="rounded-2xl border border-brand-200/80 bg-brand-50/50 p-4 text-xs font-bold text-brand-900 space-y-2">
          <div className="flex items-center justify-center gap-1.5 font-black text-brand-700">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Interested in this digital handle?</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-normal">
            Request your personalized Digicardo digital profile and NFC card setup.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="pill"
              className="w-full sm:w-auto gap-2 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-cta h-11 px-6"
            >
              <span>Claim this Digicardo</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-1.5 rounded-full border-border/80 bg-card hover:bg-muted font-bold text-xs shadow-2xs h-11 px-5"
            >
              <Compass className="w-4 h-4 text-muted-foreground" />
              <span>Explore Home</span>
            </Button>
          </Link>
        </div>

      </div>

      {/* Footer Branding */}
      <footer className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-2">
          <div className="w-5 h-5 rounded-md overflow-hidden bg-white flex items-center justify-center border border-border p-0.5">
            <Image src="/logo.png" alt="Digicardo" width={16} height={16} className="w-full h-full object-contain" />
          </div>
          <span>Powered by <strong>Digicardo</strong></span>
        </Link>
      </footer>

    </div>
  );
}
