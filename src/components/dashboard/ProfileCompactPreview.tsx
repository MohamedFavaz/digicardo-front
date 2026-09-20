"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Smartphone,
  Copy,
  Check,
  Signal,
  Wifi,
  Battery,
  Sparkles,
} from "lucide-react";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { getTemplate } from "@/templates/registry";
import type { Profile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";

export interface ProfileCompactPreviewProps {
  profile: Profile | null;
  blocks: ProfileBlock[];
}

export function ProfileCompactPreview({
  profile,
  blocks,
}: ProfileCompactPreviewProps) {
  const [copied, setCopied] = React.useState(false);
  if (!profile) return null;
  const username = profile.username || "demo";

  const selectedTemplateId = profile.template_id || "vcard";
  const tDef = getTemplate(selectedTemplateId);
  const themeTokens: ThemeTokens = profile.theme_tokens
    ? { ...tDef.default_theme, ...profile.theme_tokens }
    : tDef.default_theme;

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://Digicardo.app/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-6 shadow-card space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-brand-600" />
            <h3 className="font-black text-sm text-foreground">
              Live Phone Preview
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Real-time appearance ({tDef.name})
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2.5 text-xs font-bold gap-1 rounded-xl border-border/80 shadow-2xs"
            title="Copy profile link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>

          <Link href={`/${username}`} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs font-bold gap-1 rounded-xl border-border/80 shadow-2xs">
              <span>View</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Realistic Phone Frame */}
      <div className="relative mx-auto flex h-[540px] sm:h-[580px] w-full max-w-[295px] sm:max-w-[310px] flex-col overflow-hidden rounded-[38px] sm:rounded-[42px] border-[5px] sm:border-[6px] border-slate-900 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.25)] select-none ring-1 ring-slate-800/80">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-40 h-8 px-6 flex items-center justify-between text-white/90 text-[11px] font-bold pointer-events-none">
          <span className="tracking-tight font-mono">9:41</span>
          <div className="h-4 w-20 rounded-full bg-slate-900 shadow-xs border border-white/5 mx-auto" />
          <div className="flex items-center gap-1.5 text-white/80">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        {/* Live Template Render */}
        <div className="h-full w-full overflow-y-auto pt-7 pb-6 no-scrollbar">
          <ProfileRenderer
            profile={profile}
            blocks={blocks}
            templateId={selectedTemplateId}
            themeTokens={themeTokens}
          />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 h-1 w-28 rounded-full bg-white/40 pointer-events-none" />
      </div>
    </div>
  );
}
