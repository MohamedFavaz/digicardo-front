"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, Link2, Instagram, Video, Image as ImageIcon, Mail, Phone, Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProfileBlock } from "@/types/blocks";

export interface TopLinksListProps {
  blocks: ProfileBlock[];
  onToggleVisibility?: (block: ProfileBlock) => void;
}

export function TopLinksList({ blocks, onToggleVisibility }: TopLinksListProps) {
  const getBlockIcon = (type: string) => {
    switch (type) {
      case "link": return Link2;
      case "social": return Instagram;
      case "video": return Video;
      case "image": case "gallery": return ImageIcon;
      case "contact": case "email": return Mail;
      case "phone": case "whatsapp": return Phone;
      default: return Layers;
    }
  };

  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-7 shadow-card space-y-5 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">Active Blocks</h3>
            <p className="text-xs text-muted-foreground font-medium">
              {blocks.length} {blocks.length === 1 ? "block" : "blocks"} configured on your page
            </p>
          </div>
        </div>

        <Link href="/dashboard/page">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 rounded-xl text-xs font-bold gap-1 border-border/80 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block</span>
          </Button>
        </Link>
      </div>

      {blocks.length > 0 ? (
        <div className="space-y-2">
          {blocks.slice(0, 6).map((block) => {
            const Icon = getBlockIcon(block.type);
            const title =
              (block.config as Record<string, unknown>)?.title ||
              (block.config as Record<string, unknown>)?.label ||
              (block.config as Record<string, unknown>)?.text ||
              block.type;
            const subtitle =
              (block.config as Record<string, unknown>)?.url ||
              (block.config as Record<string, unknown>)?.email ||
              block.type.toUpperCase();

            return (
              <div
                key={block.id}
                className={cn(
                  "flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-200",
                  block.is_visible
                    ? "border-border/80 hover:border-brand-500/40 bg-card shadow-2xs"
                    : "border-dashed border-border/60 bg-muted/20 opacity-60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-muted/60 border border-border/70 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Icon className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground truncate leading-tight">
                      {String(title)}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate leading-tight mt-0.5 font-medium">
                      {String(subtitle)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs",
                      block.is_visible
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-muted-foreground bg-muted border-border"
                    )}
                  >
                    {block.is_visible ? "Active" : "Hidden"}
                  </span>

                  {onToggleVisibility && (
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(block)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all active:scale-90"
                      title={block.is_visible ? "Hide block" : "Show block"}
                    >
                      {block.is_visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {blocks.length > 6 && (
            <p className="text-center text-[11px] font-mono font-bold text-muted-foreground pt-1">
              +{blocks.length - 6} more blocks configured
            </p>
          )}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center shadow-2xs">
            <Link2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground">No Blocks Configured Yet</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Add your social media profiles, links, and banners to your page.
            </p>
          </div>
          <Link href="/dashboard/page">
            <Button size="sm" className="h-9 px-4 rounded-xl text-xs font-extrabold bg-brand-600 text-white hover:bg-brand-700 shadow-cta">
              Add Your First Block
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
