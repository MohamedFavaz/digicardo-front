/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Share2,
  Image as ImageIcon,
  X,
  Plus,
} from "lucide-react";
import type { MediaItem } from "@/types/media";
import { cn } from "@/lib/utils";

export interface SEOFormProps {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImageMediaId: string | null;
  ogImageUrl: string | null;
  indexable: boolean;
  mediaList: MediaItem[];
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onKeywordsChange: (tags: string[]) => void;
  onOgTitleChange: (val: string) => void;
  onOgDescriptionChange: (val: string) => void;
  onSelectOgMedia: (media: MediaItem) => void;
  onClearOgMedia: () => void;
  onIndexableChange: (val: boolean) => void;
}

export function SEOForm({
  seoTitle,
  seoDescription,
  keywords,
  ogTitle,
  ogDescription,
  ogImageMediaId,
  ogImageUrl,
  indexable,
  mediaList,
  onTitleChange,
  onDescriptionChange,
  onKeywordsChange,
  onOgTitleChange,
  onOgDescriptionChange,
  onSelectOgMedia,
  onClearOgMedia,
  onIndexableChange,
}: SEOFormProps) {
  const [keywordInput, setKeywordInput] = React.useState("");
  const [showMediaPicker, setShowMediaPicker] = React.useState(false);

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().replace(/^,+|,+$/g, "");
      if (val && !keywords.includes(val) && keywords.length < 10 && val.length <= 50) {
        onKeywordsChange([...keywords, val]);
        setKeywordInput("");
      }
    }
  };

  const handleRemoveKeyword = (index: number) => {
    onKeywordsChange(keywords.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      
      {/* ── Section 1: Google Search Meta ── */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Search className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              Search Engine Meta
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Configure how Google and Bing rank and describe your profile.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Page Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-foreground">
              <label htmlFor="seo-title">Meta Page Title</label>
              <span
                className={cn(
                  "font-mono text-[11px]",
                  seoTitle.length > 60 ? "text-amber-600 font-bold" : "text-muted-foreground"
                )}
              >
                {seoTitle.length}/60 chars
              </span>
            </div>
            <Input
              id="seo-title"
              type="text"
              placeholder="e.g. Alex Rivers — Creative Director & Brand Designer"
              value={seoTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="h-11 rounded-2xl border-input bg-card text-xs font-semibold"
              maxLength={100}
            />
            <p className="text-[11px] text-muted-foreground font-medium">
              Recommended: 50–60 characters for optimal visibility without truncation.
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-foreground">
              <label htmlFor="seo-desc">Meta Description</label>
              <span
                className={cn(
                  "font-mono text-[11px]",
                  seoDescription.length > 160 ? "text-amber-600 font-bold" : "text-muted-foreground"
                )}
              >
                {seoDescription.length}/160 chars
              </span>
            </div>
            <textarea
              id="seo-desc"
              rows={3}
              placeholder="e.g. Explore my curated portfolio, latest photography collections, YouTube channel, and client bookings in one link."
              value={seoDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full rounded-2xl border border-input bg-card p-3 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-600"
              maxLength={250}
            />
            <p className="text-[11px] text-muted-foreground font-medium">
              Recommended: 120–160 characters providing a clear, engaging overview.
            </p>
          </div>

          {/* Keywords Tag Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-foreground">
              <label htmlFor="seo-keywords">Target Keywords</label>
              <span className="font-mono text-[11px] text-muted-foreground">
                {keywords.length}/10 tags
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl border border-input bg-card min-h-[44px]">
              {keywords.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(idx)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {keywords.length < 10 && (
                <input
                  id="seo-keywords"
                  type="text"
                  placeholder={keywords.length === 0 ? "Type keyword & press Enter..." : "Add tag..."}
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  className="flex-1 min-w-[120px] bg-transparent border-none p-1 text-xs font-semibold text-foreground focus:outline-none"
                />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Press Enter or comma to add a keyword tag.
            </p>
          </div>

          {/* Search Engine Indexing Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/20 border border-border">
            <div className="space-y-0.5 max-w-sm">
              <span className="block text-xs font-semibold text-foreground">
                Search Engine Indexing
              </span>
              <p className="text-[11px] text-muted-foreground font-medium">
                Allow Google, Bing, and search crawlers to index and display your Digicardo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onIndexableChange(!indexable)}
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                indexable ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                  indexable ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 2: OpenGraph & Social Sharing ── */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              Social Sharing &amp; OpenGraph
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Customize title, description, and visual banner for social feeds.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* OG Title */}
          <div className="space-y-1.5">
            <label htmlFor="og-title" className="block text-xs font-black text-foreground">
              Social Card Title (Optional Override)
            </label>
            <Input
              id="og-title"
              type="text"
              placeholder="Leave blank to use Meta Page Title"
              value={ogTitle}
              onChange={(e) => onOgTitleChange(e.target.value)}
              className="h-11 rounded-2xl border-input bg-card text-xs font-semibold"
              maxLength={100}
            />
          </div>

          {/* OG Description */}
          <div className="space-y-1.5">
            <label htmlFor="og-desc" className="block text-xs font-black text-foreground">
              Social Card Description (Optional Override)
            </label>
            <textarea
              id="og-desc"
              rows={2}
              placeholder="Leave blank to use Meta Description"
              value={ogDescription}
              onChange={(e) => onOgDescriptionChange(e.target.value)}
              className="w-full rounded-2xl border border-input bg-card p-3 text-xs font-semibold text-foreground focus:outline-none focus:border-brand-600"
              maxLength={200}
            />
          </div>

          {/* OG Image Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-foreground">
              Social Share Image (og:image)
            </label>

            {ogImageUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl border border-border/80 bg-muted/20">
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-card border border-border/60 flex-shrink-0">
                  <img
                    src={ogImageUrl}
                    alt="Social banner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-foreground truncate">
                    Custom Social Banner
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-bold">
                    ✓ Active on social cards
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                    className="rounded-full text-xs font-bold h-8 px-3 bg-card"
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearOgMedia}
                    className="rounded-full text-xs font-bold h-8 px-2.5 text-rose-600 hover:bg-rose-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-foreground">
                      No custom share image selected
                    </span>
                    <span className="block text-[11px] text-muted-foreground font-medium">
                      Defaults to your profile avatar on social cards
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="rounded-full text-xs font-bold h-9 px-4 bg-card shadow-2xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Choose Image</span>
                </Button>
              </div>
            )}

            {/* Media Gallery Picker Drawer */}
            {showMediaPicker && (
              <div className="p-4 rounded-2xl border border-brand-200 bg-card shadow-card space-y-3 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground">
                    Select from Your Uploaded Media:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(false)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {mediaList.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                    {mediaList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectOgMedia(item);
                          setShowMediaPicker(false);
                        }}
                        className={cn(
                          "relative aspect-video rounded-xl overflow-hidden border transition-all hover:scale-105",
                          ogImageMediaId === item.id
                            ? "border-brand-500 ring-2 ring-brand-500/30"
                            : "border-border/80 hover:border-brand-300"
                        )}
                      >
                        <img
                          src={item.url}
                          alt={item.alt_text || "Media item"}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-medium py-2">
                    No images found in your media library. Upload images in the My Page editor to pick them here.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
