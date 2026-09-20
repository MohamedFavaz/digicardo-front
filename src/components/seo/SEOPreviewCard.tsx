/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Image from "next/image";
import { Search, Share2 } from "lucide-react";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface SEOPreviewCardProps {
  profile: Profile | null;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string | null;
}

export function SEOPreviewCard({
  profile,
  seoTitle,
  seoDescription,
  ogTitle,
  ogDescription,
  ogImageUrl,
}: SEOPreviewCardProps) {
  const [tab, setTab] = React.useState<"search" | "social">("search");

  const username = profile?.username || "demo";
  const displayName = profile?.display_name || profile?.username || "Alex Rivers";
  const defaultBio = profile?.bio || "Digital creator & designer. Connect across all my socials.";

  const effectiveTitle = seoTitle.trim() || `${displayName} | Digicardo`;
  const effectiveDescription = seoDescription.trim() || defaultBio;
  const effectiveOgTitle = ogTitle.trim() || effectiveTitle;
  const effectiveOgDesc = ogDescription.trim() || effectiveDescription;

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://digicardo.app/${username}`;

  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-4">
      {/* Header with Segmented Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="font-semibold text-sm text-foreground">
            Live Snippet Preview
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            Simulated rendering across search and social channels.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-1 rounded-lg bg-muted/60 border border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("search")}
            className={cn(
              "px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all select-none",
              tab === "search"
                ? "bg-white text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("social")}
            className={cn(
              "px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all select-none",
              tab === "social"
                ? "bg-white text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Share</span>
          </button>
        </div>
      </div>

      {/* Preview Viewport Container */}
      <div className="pt-1">
        {tab === "search" ? (
          /* Google Search Result Card */
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/80 space-y-2 select-none">
            {/* Favicon & Breadcrumb */}
            <div className="flex items-center gap-2 text-xs">
              <div className="w-5 h-5 rounded-md overflow-hidden bg-white p-0.5 border border-border flex items-center justify-center">
                <Image src="/logo.png" alt="Digicardo" width={16} height={16} className="w-full h-full object-contain" />
              </div>
              <div className="space-y-0.5 leading-tight">
                <span className="block text-[11px] font-bold text-foreground">
                  Digicardo
                </span>
                <span className="block text-[10px] font-mono text-muted-foreground truncate max-w-xs">
                  {publicUrl}
                </span>
              </div>
            </div>

            {/* Google Blue Link Title */}
            <h4 className="text-sm sm:text-base font-bold text-indigo-600 hover:underline cursor-pointer line-clamp-1">
              {effectiveTitle}
            </h4>

            {/* Snippet Description */}
            <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
              {effectiveDescription}
            </p>
          </div>
        ) : (
          /* Social Share Card (Twitter/iMessage/WhatsApp) */
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs select-none space-y-0">
            {/* OG Image banner */}
            <div className="relative w-full h-40 bg-gradient-to-br from-brand-100 via-brand-50 to-muted flex items-center justify-center overflow-hidden border-b border-border/60">
              {ogImageUrl ? (
                <img
                  src={ogImageUrl}
                  alt="Social share preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-brand-600 text-white mx-auto flex items-center justify-center text-lg font-black shadow-xs">
                    {displayName.charAt(0)}
                  </div>
                  <span className="block text-xs font-black text-foreground">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-mono text-muted-foreground">
                    digicardo.app/{username}
                  </span>
                </div>
              )}
            </div>

            {/* Social Card Content */}
            <div className="p-4 space-y-1.5 bg-muted/20">
              <span className="block text-[10px] uppercase font-mono font-bold text-muted-foreground tracking-wider">
                DIGICARDO.APP
              </span>
              <h4 className="text-xs sm:text-sm font-black text-foreground line-clamp-1">
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
