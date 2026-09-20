"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, User, Image as ImageIcon, Link2, Palette, Sparkles, Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";

export interface ProfileCompletionCardProps {
  profile: Profile | null;
  blocks: ProfileBlock[];
}

export function ProfileCompletionCard({ profile, blocks }: ProfileCompletionCardProps) {
  const [dismissed, setDismissed] = React.useState(false);

  const isTemplateChosen = Boolean(profile?.template_id);

  const steps = [
    {
      id: "identity",
      title: "Username & Name",
      completed: Boolean(profile?.username && profile?.display_name),
      href: "/dashboard/settings",
      icon: User,
    },
    {
      id: "bio_avatar",
      title: "Bio & Identity",
      completed: Boolean(profile?.bio || profile?.avatar_url),
      href: "/dashboard/page",
      icon: ImageIcon,
    },
    {
      id: "links",
      title: isTemplateChosen ? "Template Choosed" : "Links & Content",
      completed: isTemplateChosen || blocks.length > 0,
      href: "/dashboard/page",
      icon: isTemplateChosen ? Layers : Link2,
    },
    {
      id: "theme",
      title: "Theme & Design",
      completed: Boolean(profile?.template_id),
      href: "/dashboard/appearance",
      icon: Palette,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  if (dismissed) return null;

  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-7 shadow-card space-y-5 select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-2xs flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">
              Profile Setup Checklist
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {percentage === 100
                ? "Your Digicardo profile is fully configured and live!"
                : `Complete ${steps.length - completedCount} more step${steps.length - completedCount === 1 ? "" : "s"} to unlock full profile conversion potential.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-black text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800">
            {percentage}% DONE
          </span>
          {percentage < 100 ? (
            <Link href={steps.find((s) => !s.completed)?.href || "/dashboard"}>
              <Button
                size="sm"
                className="h-8 px-3.5 rounded-xl text-xs font-extrabold bg-brand-600 text-white hover:bg-brand-700 gap-1 shadow-cta active:scale-95"
              >
                Continue
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          ) : (
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              title="Dismiss checklist"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-500 transition-all duration-500 shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Link
              key={step.id}
              href={step.href}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all group",
                step.completed
                  ? "border-border/60 bg-muted/25 text-muted-foreground"
                  : "border-dashed border-border/80 hover:border-brand-500/50 hover:bg-brand-50/20 text-foreground shadow-2xs hover:-translate-y-0.5"
              )}
            >
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 group-hover:text-brand-500" />
              )}
              <span className="truncate">{step.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
