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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-4 sticky top-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-sm text-slate-900">
              Live Preview
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Real-time preview ({tDef.name})
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Copy profile link"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <Link
            href={`/${username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-xs font-semibold text-white transition-all shadow-2xs"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3 text-slate-300" />
          </Link>
        </div>
      </div>

      {/* Realistic Mobile Device Frame (iPhone 15 Pro Aesthetic) - Responsive */}
      <div className="relative mx-auto flex h-[600px] sm:h-[720px] md:h-[740px] w-full max-w-[335px] sm:max-w-[385px] flex-col overflow-hidden rounded-[40px] sm:rounded-[52px] border-[6px] sm:border-[7px] border-slate-900 bg-slate-950 shadow-2xl select-none ring-1 ring-slate-800">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-40 h-8 px-7 flex items-center justify-between text-slate-800 dark:text-white/90 text-[11px] font-bold pointer-events-none">
          <span className="tracking-tight font-semibold">9:41</span>
          <div className="h-4 w-24 rounded-full bg-black shadow-xs border border-white/10 mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-white/80">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        {/* Live Render Area with Unified in-phone-frame Scope */}
        <div className="in-phone-frame h-full w-full overflow-y-auto pt-7 pb-6 no-scrollbar">
          <ProfileRenderer
            profile={profile}
            blocks={blocks}
            templateId={selectedTemplateId}
            themeTokens={themeTokens}
          />
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 h-1 w-28 rounded-full bg-slate-800/40 dark:bg-white/40 pointer-events-none" />
      </div>
    </div>
  );
}
