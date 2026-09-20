"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  ExternalLink,
  Wifi,
  Battery,
  Signal,
  Copy,
  Check,
} from "lucide-react";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { getTemplate } from "@/templates/registry";
import type { Profile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";

export interface EditorPreviewProps {
  profile: Profile | null;
  blocks: ProfileBlock[];
  selectedTemplateId?: string;
}

export function EditorPreview({ profile, blocks, selectedTemplateId }: EditorPreviewProps) {
  const [copied, setCopied] = React.useState(false);
  if (!profile) return null;
  const username = profile.username || "demo";

  const activeTemplateId = selectedTemplateId || profile.template_id || "vcard";
  const tDef = getTemplate(activeTemplateId);
  const themeTokens: ThemeTokens = profile.theme_tokens
    ? { ...tDef.default_theme, ...profile.theme_tokens }
    : tDef.default_theme;

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://digicardo.app/${username}`;

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
    <div className="rounded-[28px] sm:rounded-[36px] border border-border/80 bg-card p-4 sm:p-6 shadow-card space-y-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-brand-600" />
            <h3 className="font-black text-base text-foreground">
              Live Phone Preview
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Real-time synchronized rendering ({tDef.name})
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="rounded-full text-xs font-bold gap-1 bg-card hover:bg-muted"
            title="Copy profile link"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>

          <Link href={`/${username}`} target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-bold gap-1 bg-card hover:bg-muted"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="relative mx-auto flex h-[580px] sm:h-[660px] w-full max-w-[305px] sm:max-w-[325px] flex-col overflow-hidden rounded-[40px] sm:rounded-[44px] border-[5px] border-slate-900 bg-black shadow-float select-none ring-1 ring-slate-800">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-40 h-8 px-6 flex items-center justify-between text-white/90 text-[11px] font-bold pointer-events-none">
          <span className="tracking-tight">9:41</span>
          <div className="h-4 w-20 rounded-full bg-slate-900 shadow-xs border border-white/5 mx-auto" />
          <div className="flex items-center gap-1.5 text-white/80">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        {/* Live Render Area using Unified ProfileRenderer */}
        <div className="h-full w-full overflow-y-auto pt-7 pb-6 no-scrollbar">
          <ProfileRenderer
            profile={profile}
            blocks={blocks}
            templateId={selectedTemplateId}
            themeTokens={themeTokens}
          />
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 h-1 w-28 rounded-full bg-white/40 pointer-events-none" />
      </div>
    </div>
  );
}
