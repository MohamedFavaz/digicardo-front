"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Radio,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Share2,
  Sliders,
  Smartphone,
} from "lucide-react";
import { QRPreview } from "@/components/qr/QRPreview";
import { QRCustomizer, type QRCardTemplate } from "@/components/qr/QRCustomizer";
import { QRSkeleton } from "@/components/qr/QRSkeleton";
import { NFCCardPreview, type NFCFontStyle } from "@/components/nfc/NFCCardPreview";
import { NFCTemplatePicker } from "@/components/nfc/NFCTemplatePicker";
import { NFCSetupGuide } from "@/components/nfc/NFCSetupGuide";
import { NFCTestCard } from "@/components/nfc/NFCTestCard";
import { cn } from "@/lib/utils";

export default function QrAndNfcDashboardPage() {
  const router = useRouter();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Active Tab: 'qr' or 'nfc'
  const [activeTab, setActiveTab] = React.useState<"qr" | "nfc">("qr");

  // Mobile View Tab: 'design' or 'preview'
  const [mobileView, setMobileView] = React.useState<"design" | "preview">("design");

  // QR Customization State
  const [qrCardTemplate, setQrCardTemplate] = React.useState<QRCardTemplate>("standee");
  const [qrFgColor, setQrFgColor] = React.useState("#0f172a");
  const [qrBgColor, setQrBgColor] = React.useState("#ffffff");
  const [qrDotStyle, setQrDotStyle] = React.useState<"square" | "rounded" | "dots">("rounded");
  const [qrCenterLogo, setQrCenterLogo] = React.useState<"badge" | "none">("badge");

  // NFC Customization State (Default to vibrant 'holographic-neon')
  const [nfcThemeId, setNfcThemeId] = React.useState("holographic-neon");
  const [nfcFontStyle, setNfcFontStyle] = React.useState<NFCFontStyle>("modern");

  // Copy status
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard/qr");
      return;
    }

    if (isAuthenticated) {
      profileApi
        .getProfile()
        .then((p) => {
          setProfile(p);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const username = profile?.username || "demo";
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://digicardo.app/${username}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  if (isAuthLoading || isLoading) {
    return <QRSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 max-w-7xl mx-auto">
      
      {/* ── Studio Header ── */}
      <div className="relative rounded-[28px] sm:rounded-[36px] border border-border/80 bg-gradient-to-br from-card via-card to-brand-50/20 dark:to-brand-950/10 p-5 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-2xs">
            <Share2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Instant Physical &amp; Digital Sharing</span>
            <span>·</span>
            <span className="font-mono text-muted-foreground font-semibold">
              digicardo.app/{username}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            QR Code &amp; NFC Smart Card Studio
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
            Turn your online profile into high-converting physical touchpoints. Design luxury contactless NFC smart cards (seamless internal antenna) and high-resolution scannable QR card displays.
          </p>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 z-10">
          {/* Segmented Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-muted/70 border border-border/80 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2 transition-all select-none text-xs font-black",
                activeTab === "qr"
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <QrCode className="w-4 h-4 text-brand-600" />
              <span>QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("nfc")}
              className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2 transition-all select-none text-xs font-black",
                activeTab === "nfc"
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Radio className="w-4 h-4 text-brand-600" />
              <span>NFC Card</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-xl text-xs font-bold gap-1.5 h-10 px-3.5 border-border/80 bg-card hover:bg-muted shadow-2xs"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </Button>

            <Link href={`/${username}`} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-bold gap-1.5 h-10 px-3.5 border-border/80 bg-card hover:bg-muted shadow-2xs"
              >
                <span>Live Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile View Toggle Segmented Control (Hidden on lg) ── */}
      <div className="flex lg:hidden p-1.5 rounded-2xl bg-muted/60 border border-border/80 text-xs font-bold shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileView("design")}
          className={cn(
            "flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all select-none",
            mobileView === "design"
              ? "bg-card text-brand-600 shadow-xs border border-brand-200 dark:border-brand-800"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{activeTab === "qr" ? "Customize QR" : "NFC Themes & Guide"}</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all select-none",
            mobileView === "preview"
              ? "bg-card text-brand-600 shadow-xs border border-brand-200 dark:border-brand-800"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Card Preview</span>
        </button>
      </div>

      {/* ── Main Studio Workspace: QR or NFC ── */}
      {activeTab === "qr" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in-50">
          {/* Left Column: QR Customizer (7 cols) */}
          <div className={cn("lg:col-span-7", mobileView === "preview" && "hidden lg:block")}>
            <QRCustomizer
              cardTemplate={qrCardTemplate}
              fgColor={qrFgColor}
              bgColor={qrBgColor}
              dotStyle={qrDotStyle}
              centerLogo={qrCenterLogo}
              onChangeCardTemplate={setQrCardTemplate}
              onChangeColors={(fg, bg) => {
                setQrFgColor(fg);
                setQrBgColor(bg);
              }}
              onChangeDotStyle={setQrDotStyle}
              onChangeCenterLogo={setQrCenterLogo}
            />
          </div>

          {/* Right Column: QR Preview (5 cols) */}
          <div className={cn("lg:col-span-5", mobileView === "design" && "hidden lg:block")}>
            <QRPreview
              profile={profile}
              cardTemplate={qrCardTemplate}
              fgColor={qrFgColor}
              bgColor={qrBgColor}
              dotStyle={qrDotStyle}
              centerLogo={qrCenterLogo}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in-50">
          {/* Left Column: NFC Config & Guides (7 cols) */}
          <div className={cn("lg:col-span-7 space-y-6", mobileView === "preview" && "hidden lg:block")}>
            <NFCTemplatePicker
              selectedThemeId={nfcThemeId}
              onSelectTheme={setNfcThemeId}
              fontStyle={nfcFontStyle}
              onSelectFontStyle={setNfcFontStyle}
            />

            <NFCSetupGuide username={username} />

            <NFCTestCard username={username} />
          </div>

          {/* Right Column: NFC Card Preview (5 cols) */}
          <div className={cn("lg:col-span-5", mobileView === "design" && "hidden lg:block")}>
            <NFCCardPreview
              profile={profile}
              selectedThemeId={nfcThemeId}
              fontStyle={nfcFontStyle}
            />
          </div>
        </div>
      )}

    </div>
  );
}
