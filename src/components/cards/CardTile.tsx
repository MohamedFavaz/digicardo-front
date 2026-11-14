"use client";

import * as React from "react";
import Link from "next/link";
import type { CardItem } from "@/types/cards";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Copy,
  Check,
  MoreVertical,
  Edit3,
  Palette,
  CopyPlus,
  Star,
  Globe,
  Trash2,
  Share2,
  Eye,
  Layers,
  ArrowRight,
} from "lucide-react";

export interface CardTileProps {
  card: CardItem;
  onDuplicate?: (card: CardItem) => void;
  onSetPrimary?: (card: CardItem) => void;
  onPublishToggle?: (card: CardItem) => void;
  onDelete?: (card: CardItem) => void;
}

export function CardTile({
  card,
  onDuplicate,
  onSetPrimary,
  onPublishToggle,
  onDelete,
}: CardTileProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const previewImg =
    card.template_id === "botanical"
      ? "/botanical-preview.png"
      : "/vcard-preview.png";

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${card.username}`
      : `https://digicardo.app/${card.username}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const isPublished = card.status?.value === "published";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl border bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-card",
        card.is_primary
          ? "border-slate-900/80 ring-1 ring-slate-900/10"
          : "border-slate-200/90 hover:border-slate-300"
      )}
    >
      {/* ── Top Header: Status Badges & Menu ── */}
      <div className="p-4 pb-2.5 flex items-center justify-between gap-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {/* Status Badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight",
              isPublished
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-slate-100 text-slate-600 border border-slate-200/60"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isPublished ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              )}
            />
            <span>{card.status?.label || (isPublished ? "Published" : "Draft")}</span>
          </span>

          {/* Primary Badge */}
          {card.is_primary && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-2xs">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>Primary</span>
            </span>
          )}

          {/* Category Pill */}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {card.category?.label || "Business"}
          </span>
        </div>

        {/* Action Menu Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Card options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-40 text-xs">
                <Link
                  href={`/dashboard/page`}
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Content & Links</span>
                </Link>

                <Link
                  href={`/dashboard/appearance?template=${card.template_id}`}
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  <span>Customize Appearance</span>
                </Link>

                {onDuplicate && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(card);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-black w-full text-left transition-colors cursor-pointer"
                  >
                    <CopyPlus className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duplicate Card</span>
                  </button>
                )}

                {onPublishToggle && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onPublishToggle(card);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-black w-full text-left transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isPublished ? "Unpublish (to Draft)" : "Publish Live"}</span>
                  </button>
                )}

                {!card.is_primary && onSetPrimary && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onSetPrimary(card);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-black w-full text-left transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Set as Primary Card</span>
                  </button>
                )}

                {onDelete && !card.is_primary && (
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(card);
                      }}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Card</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Visual Preview Area ── */}
      <div className="relative mx-4 my-3 h-52 sm:h-56 rounded-2xl overflow-hidden bg-slate-50/80 border border-slate-200/60 flex items-center justify-center p-2.5 group-hover:bg-slate-100/50 transition-colors">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewImg}
          alt={card.card_title}
          className="w-auto h-full max-h-full max-w-full object-contain rounded-xl drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Live Public Link Overlay Button */}
        {isPublished && (
          <Link
            href={`/${card.username}`}
            target="_blank"
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-black text-white text-[11px] font-bold shadow-md backdrop-blur-xs flex items-center gap-1 transition-all opacity-90 group-hover:opacity-100"
          >
            <span>View Live</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* ── Card Title & Username ── */}
      <div className="px-5 pb-3 space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
          {card.card_title || card.display_name || "Untitled Digital Card"}
        </h4>

        {/* Public URL row with copy button */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <span className="truncate">/{card.username}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer flex-shrink-0"
            title="Copy URL"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Bottom Action Footer ── */}
      <div className="p-3.5 pt-2.5 mt-auto border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs">
        <Link
          href={`/dashboard/page`}
          prefetch={false}
          className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-center transition-colors shadow-2xs flex items-center justify-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit</span>
        </Link>

        <Link
          href={`/dashboard/appearance?template=${card.template_id}`}
          prefetch={false}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-center transition-colors shadow-2xs flex items-center justify-center gap-1.5"
        >
          <Palette className="w-3.5 h-3.5 text-white" />
          <span>Style</span>
        </Link>
      </div>
    </div>
  );
}
