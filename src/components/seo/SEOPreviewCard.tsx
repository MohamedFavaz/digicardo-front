/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Image from "next/image";
import { Search, Share2, Twitter, AlertTriangle } from "lucide-react";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface SEOPreviewCardProps {
  profile: Profile | null;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string | null;
  indexable?: boolean;
}

export function SEOPreviewCard({
  profile,
  seoTitle,
  seoDescription,
  ogTitle,
  ogDescription,
  ogImageUrl,
  indexable = true,
}: SEOPreviewCardProps) {
  const [tab, setTab] = React.useState<"google" | "facebook" | "twitter">("google");

  const username = profile?.username || "demo";
  const displayName = profile?.display_name || profile?.username || "Alex Rivers";
  const defaultBio = profile?.bio || "Digital creator & designer. Connect across all my socials.";

  const effectiveTitle = seoTitle.trim() || `${displayName} (@${username}) — Digicardo`;
  const effectiveDescription = seoDescription.trim() || defaultBio;
  const effectiveOgTitle = ogTitle.trim() || effectiveTitle;
  const effectiveOgDesc = ogDescription.trim() || effectiveDescription;
  const effectiveOgImage = ogImageUrl || profile?.avatar_url || null;

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://digicardo.app/${username}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header with Segmented Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-foreground">
              Live Social &amp; Search Preview
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              Real-time preview across search engines and social feeds.
            </p>
          </div>
        </div>

        {/* 3-Way Tab Switcher */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-muted/60 border border-border/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("google")}
            className={cn(
              "py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all select-none text-[11px]",
              tab === "google"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("facebook")}
            className={cn(
              "py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all select-none text-[11px]",
              tab === "facebook"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Facebook / LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("twitter")}
            className={cn(
              "py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all select-none text-[11px]",
              tab === "twitter"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>X (Twitter)</span>
          </button>
        </div>
      </div>

      {/* Noindex Notice */}
      {!indexable && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[11px] font-semibold text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Indexing disabled: Google &amp; crawlers will ignore this profile (`noindex`).</span>
        </div>
      )}

      {/* Preview Viewport Container */}
      <div className="pt-0.5">
        {tab === "google" && (
          /* Google Search Result Card */
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-2 select-none font-sans">
            {/* Favicon & Breadcrumb */}
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-white p-0.5 border border-border/80 flex items-center justify-center flex-shrink-0">
                <Image src="/logo.png" alt="Digicardo" width={18} height={18} className="w-full h-full object-contain" />
              </div>
              <div className="space-y-0 leading-tight">
                <span className="block text-xs font-semibold text-[#202124] dark:text-zinc-200">
                  Digicardo
                </span>
                <span className="block text-[11px] text-[#4d5156] dark:text-zinc-400 font-mono truncate max-w-[280px]">
                  digicardo.app › {username}
                </span>
              </div>
            </div>

            {/* Google Blue Link Title */}
            <h4 className="text-base font-medium text-[#1a0dab] dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 leading-snug">
              {effectiveTitle}
            </h4>

            {/* Snippet Description */}
            <p className="text-xs text-[#4d5156] dark:text-zinc-400 font-normal line-clamp-2 leading-relaxed">
              {effectiveDescription}
            </p>
          </div>
        )}

        {tab === "facebook" && (
          /* Facebook / LinkedIn OpenGraph Card */
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs select-none space-y-0">
            {/* OG Image banner (1.91:1 aspect ratio) */}
            <div className="relative w-full aspect-[1.91/1] bg-gradient-to-br from-brand-100 via-brand-50 to-muted flex items-center justify-center overflow-hidden border-b border-border/60">
              {effectiveOgImage ? (
                <img
                  src={effectiveOgImage}
                  alt="Social share preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2 p-4">
                  <div className="w-14 h-14 rounded-full bg-brand-600 text-white mx-auto flex items-center justify-center text-xl font-black shadow-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="block text-xs font-bold text-foreground">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-mono text-muted-foreground">
                    digicardo.app/{username}
                  </span>
                </div>
              )}
            </div>

            {/* Social Card Content */}
            <div className="p-3.5 space-y-1 bg-muted/20">
              <span className="block text-[10px] uppercase font-mono font-bold text-muted-foreground tracking-wider">
                DIGICARDO.APP
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                {effectiveOgTitle}
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                {effectiveOgDesc}
              </p>
            </div>
          </div>
        )}

        {tab === "twitter" && (
          /* X / Twitter Summary Card with Large Image */
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs select-none space-y-0">
            {/* Twitter Banner with overlay domain pill */}
            <div className="relative w-full aspect-[1.91/1] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center overflow-hidden">
              {effectiveOgImage ? (
                <img
                  src={effectiveOgImage}
                  alt="Twitter card preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2 p-4">
                  <div className="w-14 h-14 rounded-full bg-white/10 text-white border border-white/20 mx-auto flex items-center justify-center text-xl font-black">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="block text-xs font-bold text-white">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-mono text-white/70">
                    @{username}
                  </span>
                </div>
              )}

              {/* Bottom-left domain badge pill */}
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                digicardo.app
              </div>
            </div>

            {/* Twitter Card Details */}
            <div className="p-3.5 space-y-1 bg-card border-t border-border/60">
              <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                {effectiveOgTitle}
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                {effectiveOgDesc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
