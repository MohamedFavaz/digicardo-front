/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Radio,
  Share2,
  Lock,
} from "lucide-react";
import { generateQrSvg } from "@/lib/qr/qr-code";
import type { Profile } from "@/types/profile";
import type { QRCardTemplate } from "./QRCustomizer";
import { cn } from "@/lib/utils";

export interface QRPreviewProps {
  profile: Profile | null;
  cardTemplate?: QRCardTemplate;
  fgColor: string;
  bgColor: string;
  dotStyle: "square" | "rounded" | "dots";
  centerLogo: "badge" | "none";
}

export function QRPreview({
  profile,
  cardTemplate = "standee",
  fgColor,
  bgColor,
  dotStyle,
  centerLogo,
}: QRPreviewProps) {
  const [copied, setCopied] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const username = profile?.username || "alexrivers";
  const displayName = profile?.display_name || profile?.username || "ALEX RIVERS";
  const formattedName = displayName.toUpperCase();

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://digicardo.app/${username}`;

  // Deterministic Credential ID
  const credentialId = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = (hash << 5) - hash + username.charCodeAt(i);
      hash |= 0;
    }
    const id = Math.abs(hash % 9000 + 1000);
    return `DC-PASS #${id}`;
  }, [username]);

  // Generate SVG string (No avatar image passed to ensure crisp vector precision)
  const svgString = React.useMemo(() => {
    return generateQrSvg({
      text: publicUrl,
      size: 260,
      fgColor,
      bgColor,
      dotStyle,
      centerLogo: centerLogo === "avatar" ? "badge" : centerLogo,
      avatarUrl: null,
    });
  }, [publicUrl, fgColor, bgColor, dotStyle, centerLogo]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Download SVG
  const handleDownloadSvg = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `digicardo-qr-${username}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download high-resolution PNG (4x crisp print quality)
  const handleDownloadPng = () => {
    setIsDownloading(true);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 4; // 1040x1040 ultra high-res
      canvas.width = 260 * scale;
      canvas.height = 260 * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `digicardo-qr-${username}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    };

    img.onerror = () => {
      setIsDownloading(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="rounded-[28px] sm:rounded-[36px] border border-border/80 bg-card p-4 sm:p-7 shadow-card space-y-5 sm:space-y-6 flex flex-col items-center text-center select-none sticky top-6">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-border/60 pb-3.5">
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-brand-600">
              PHYSICAL &amp; PRINT TEMPLATE
            </span>
          </div>
          <h3 className="text-base font-black text-foreground">
            Scannable QR Card
          </h3>
        </div>

        <span className="text-[10px] font-mono uppercase font-extrabold px-2.5 py-1 rounded-full bg-muted border border-border/80 text-muted-foreground">
          {cardTemplate.replace("-", " ")}
        </span>
      </div>

      {/* ── CARD TEMPLATE RENDERING (100% Picture-Free Luxury) ── */}
      <div className="w-full max-w-[340px] flex flex-col items-center">
        
        {/* ── TEMPLATE 1: STANDEE (Tabletop & Counter Acrylic Plaque) ── */}
        {cardTemplate === "standee" && (
          <div className="w-full flex flex-col items-center group">
            {/* Acrylic Plaque Body */}
            <div className="w-full rounded-[28px] border border-white/50 dark:border-white/15 bg-gradient-to-b from-white/95 via-white/85 to-slate-50/90 dark:from-slate-900/95 dark:via-slate-900/85 dark:to-slate-950/95 backdrop-blur-xl p-5 shadow-[0_20px_45px_rgba(0,0,0,0.18)] space-y-3.5 relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
              
              {/* Acrylic top specular sheen */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
              
              {/* Standee Brand Header with Geometric Monogram */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-[10px] font-black uppercase tracking-widest shadow-2xs">
                  <Sparkles className="w-3 h-3 text-brand-500" />
                  <span>TABLE &amp; COUNTER DISPLAY</span>
                </div>

                <div className="pt-0.5">
                  <h4 className="text-base font-mono font-black tracking-wider text-foreground truncate uppercase">
                    {formattedName}
                  </h4>
                  <p className="text-[10px] font-mono text-muted-foreground font-semibold">
                    Digital Profile &amp; Instant Catalog
                  </p>
                </div>
              </div>

              {/* Centered QR Code with Brass Corner Alignment Pins */}
              <div className="relative p-2.5 rounded-2xl bg-card border border-border/80 shadow-inner group-hover:scale-[1.01] transition-transform duration-300">
                {/* Decorative Brass Pins */}
                <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-2xs" />
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-2xs" />
                <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-2xs" />
                <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-2xs" />

                <div
                  className="w-full aspect-square rounded-xl p-2 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: bgColor }}
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>

              {/* Bottom Instructions */}
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-foreground">
                  <Smartphone className="w-3.5 h-3.5 text-brand-600" />
                  <span>Point camera to connect</span>
                </div>
                <span className="inline-block font-mono text-[10px] font-bold text-muted-foreground truncate max-w-[240px]">
                  digicardo.app/{username}
                </span>
              </div>
            </div>

            {/* Heavy Weighted Brushed Metallic / Walnut Standee Base */}
            <div className="w-[90%] h-4 bg-gradient-to-r from-amber-700 via-amber-200 to-amber-700 dark:from-amber-950 dark:via-amber-800 dark:to-amber-950 rounded-b-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] -mt-1 border-t border-amber-300/40" />
            <div className="w-[65%] h-2 bg-black/20 blur-sm rounded-full -mt-0.5" />
          </div>
        )}

        {/* ── TEMPLATE 2: BUSINESS CARD (Executive Horizontal Pocket Card) ── */}
        {cardTemplate === "business-card" && (
          <div className="w-full rounded-[24px] border border-slate-700/80 bg-gradient-to-br from-[#0b0e14] via-[#141b27] to-[#080a0f] text-white p-5 shadow-[0_22px_45px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-rotate-0.5 group">
            {/* Fine 24K Gold Foil Hairline Border */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/0 via-amber-400/5 to-white/10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-brand-400 to-amber-500" />

            <div className="flex items-center justify-between gap-3 relative z-10">
              {/* Left Column: Typographic Elegance (No Avatar Picture) */}
              <div className="text-left space-y-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-white/20 p-0.5 flex items-center justify-center shadow-md">
                    <Image src="/logo.png" alt="Digicardo" width={22} height={22} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-mono font-black tracking-[0.25em] text-white/90">
                    DIGICARDO
                  </span>
                </div>

                <div className="space-y-0.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-mono font-black tracking-wider text-white truncate">
                      {formattedName}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80 block">
                    FOUNDER &amp; CREATIVE
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-1.5 text-[9px] font-mono text-slate-300 font-bold uppercase tracking-wider">
                  <Radio className="w-3 h-3 text-amber-400" />
                  <span>TAP OR SCAN TO SAVE</span>
                </div>
              </div>

              {/* Right Column: High-Contrast Precision Scannable QR */}
              <div
                className="w-26 h-26 rounded-xl p-1.5 flex-shrink-0 shadow-lg border border-white/20 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: bgColor }}
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            </div>

            {/* Bottom Card Bar */}
            <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>{credentialId}</span>
              <span className="truncate max-w-[140px] text-slate-300 font-semibold">
                digicardo.app/{username}
              </span>
            </div>
          </div>
        )}

        {/* ── TEMPLATE 3: VIP EVENT BADGE (Lanyard Pass) ── */}
        {cardTemplate === "badge" && (
          <div className="w-full flex flex-col items-center group">
            {/* Chrome Lanyard Punch Slot */}
            <div className="w-14 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border border-border flex items-center justify-center shadow-xs -mb-2 z-20">
              <div className="w-6 h-1.5 rounded-full bg-slate-600 dark:bg-slate-900" />
            </div>

            {/* Vertical Badge Body */}
            <div className="w-full rounded-[28px] border border-border/80 bg-gradient-to-b from-card via-card to-muted/40 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.2)] space-y-3.5 relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
              {/* Top VIP Ribbon Banner */}
              <div className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-brand-600 to-indigo-600 text-white flex items-center justify-between text-[10px] font-black uppercase tracking-widest shadow-xs">
                <span>ALL-ACCESS</span>
                <span>VIP CREATOR</span>
              </div>

              {/* Attendee Typographic Credential (No Avatar Picture) */}
              <div className="flex flex-col items-center space-y-1 pt-1">
                <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-base font-mono font-black tracking-wider text-foreground uppercase">
                  {formattedName}
                </h4>
                <p className="text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase">
                  KEYNOTE SPEAKER · INNOVATOR
                </p>
              </div>

              {/* High-Contrast Credential QR */}
              <div
                className="w-44 h-44 mx-auto rounded-2xl p-2 flex items-center justify-center shadow-xs border border-border/60 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ backgroundColor: bgColor }}
                dangerouslySetInnerHTML={{ __html: svgString }}
              />

              {/* Verification & ID Caption */}
              <div className="flex items-center justify-between text-[9px] font-mono uppercase font-bold text-muted-foreground pt-1 border-t border-border/60">
                <span>{credentialId}</span>
                <span className="text-emerald-600 dark:text-emerald-400">VERIFIED PASS</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TEMPLATE 4: MINIMAL (Modern Architectural Gallery Plaque) ── */}
        {cardTemplate === "minimal" && (
          <div className="w-full rounded-[30px] border border-border/90 bg-card p-6 shadow-[0_20px_45px_rgba(0,0,0,0.15)] space-y-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group">
            {/* Decorative Architectural Crosshairs */}
            <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-brand-500 rounded-tl-sm opacity-60" />
            <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-brand-500 rounded-tr-sm opacity-60" />
            <div className="absolute bottom-3.5 left-3.5 w-3 h-3 border-b-2 border-l-2 border-brand-500 rounded-bl-sm opacity-60" />
            <div className="absolute bottom-3.5 right-3.5 w-3 h-3 border-b-2 border-r-2 border-brand-500 rounded-br-sm opacity-60" />

            {/* Typographic Label */}
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.25em] text-brand-600 block">
                AUTHENTICATED TOUCHPOINT
              </span>
              <h4 className="text-base font-mono font-black tracking-wider text-foreground uppercase truncate">
                {formattedName}
              </h4>
            </div>

            {/* Clean QR code frame */}
            <div
              className="w-full aspect-square rounded-2xl p-2.5 flex items-center justify-center shadow-xs border border-border/60 transition-transform duration-300 group-hover:scale-[1.02]"
              style={{ backgroundColor: bgColor }}
              dangerouslySetInnerHTML={{ __html: svgString }}
            />

            {/* Scan URL Pill */}
            <div className="text-center pt-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-muted-foreground bg-muted/60 px-3.5 py-1 rounded-full border border-border/60">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>digicardo.app/{username}</span>
              </span>
            </div>
          </div>
        )}

      </div>

      {/* ── Action Buttons ── */}
      <div className="w-full space-y-2.5 max-w-[340px] pt-1">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="pill"
            size="sm"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="h-10 text-xs font-extrabold bg-brand-600 hover:bg-brand-700 text-white gap-1.5 shadow-cta"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? "Generating..." : "Download PNG"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadSvg}
            className="h-10 rounded-full text-xs font-extrabold bg-card hover:bg-muted gap-1.5 border-border/80 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export SVG</span>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="w-full h-10 rounded-full text-xs font-extrabold bg-card hover:bg-muted gap-1.5 border-border/80 shadow-2xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-extrabold">Profile Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Copy Public Link</span>
            </>
          )}
        </Button>
      </div>

    </div>
  );
}
