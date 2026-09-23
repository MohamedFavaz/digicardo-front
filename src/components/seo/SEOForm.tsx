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
  Upload,
  Loader2,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";
import type { MediaItem } from "@/types/media";
import { mediaApi } from "@/lib/api/media";
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
  onMediaUploaded?: (media: MediaItem) => void;
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
  onMediaUploaded,
}: SEOFormProps) {
  const [keywordInput, setKeywordInput] = React.useState("");
  const [showMediaPicker, setShowMediaPicker] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image file size must be less than 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const mediaItem = await mediaApi.uploadImage(file, "Social Share Image");
      onSelectOgMedia(mediaItem);
      onMediaUploaded?.(mediaItem);
      setShowMediaPicker(false);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── Section 1: Google Search Meta ── */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Search Engine Meta
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Configure how Google, Bing, and web search engines index and display your profile.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {/* Page Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <label htmlFor="seo-title">Meta Page Title</label>
              <span
                className={cn(
                  "font-mono text-[11px] font-medium",
                  seoTitle.length > 70
                    ? "text-rose-600 font-bold"
                    : seoTitle.length > 60
                    ? "text-amber-600 font-bold"
                    : "text-muted-foreground"
                )}
              >
                {seoTitle.length}/60 chars {seoTitle.length > 60 && "(may truncate in SERP)"}
              </span>
            </div>
            <Input
              id="seo-title"
              type="text"
              placeholder="e.g. Alex Rivers — Creative Director & Brand Designer"
              value={seoTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="h-10 rounded-xl border-input bg-card text-xs font-medium"
              maxLength={100}
            />
            <p className="text-[11px] text-muted-foreground font-medium">
              Recommended: 50–60 characters. Leave blank to automatically use your display name.
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <label htmlFor="seo-desc">Meta Description</label>
              <span
                className={cn(
                  "font-mono text-[11px] font-medium",
                  seoDescription.length > 200
                    ? "text-rose-600 font-bold"
                    : seoDescription.length > 160
                    ? "text-amber-600 font-bold"
                    : "text-muted-foreground"
                )}
              >
                {seoDescription.length}/160 chars {seoDescription.length > 160 && "(may truncate)"}
              </span>
            </div>
            <textarea
              id="seo-desc"
              rows={3}
              placeholder="e.g. Explore my curated portfolio, latest photography collections, YouTube channel, and client bookings in one link."
              value={seoDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full rounded-xl border border-input bg-card p-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              maxLength={300}
            />
            <p className="text-[11px] text-muted-foreground font-medium">
              Recommended: 120–160 characters. A concise overview that entices searchers to click.
            </p>
          </div>

          {/* Keywords Tag Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <label htmlFor="seo-keywords">Target Keywords (Meta Tags)</label>
              <span className="font-mono text-[11px] text-muted-foreground">
                {keywords.length}/10 tags
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-input bg-card min-h-[44px]">
              {keywords.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(idx)}
                    className="hover:text-rose-600 transition-colors p-0.5"
                    aria-label={`Remove keyword ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {keywords.length < 10 && (
                <input
                  id="seo-keywords"
                  type="text"
                  placeholder={keywords.length === 0 ? "Type keyword & press Enter or comma..." : "Add tag..."}
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  className="flex-1 min-w-[130px] bg-transparent border-none p-1 text-xs font-medium text-foreground focus:outline-none placeholder:text-muted-foreground/60"
                />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Press Enter or comma to add up to 10 keyword phrases.
            </p>
          </div>

          {/* Search Engine Indexing Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/80">
            <div className="space-y-0.5 max-w-sm">
              <div className="flex items-center gap-2">
                <span className="block text-xs font-bold text-foreground">
                  Search Engine Indexing
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    indexable
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  )}
                >
                  {indexable ? "Indexable" : "Noindex"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                {indexable
                  ? "Search engines are allowed to crawl, rank, and show your profile in search results."
                  : "Search engines are instructed not to index or display this profile (robots: noindex)."}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={indexable}
              onClick={() => onIndexableChange(!indexable)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20",
                indexable ? "bg-primary" : "bg-muted-foreground/30"
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
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Social Sharing &amp; OpenGraph
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Customize preview cards generated when your link is shared on iMessage, WhatsApp, X, and Facebook.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {/* OG Title */}
          <div className="space-y-1.5">
            <label htmlFor="og-title" className="block text-xs font-semibold text-foreground">
              Social Card Title (Optional Override)
            </label>
            <Input
              id="og-title"
              type="text"
              placeholder="Leave blank to use Meta Page Title"
              value={ogTitle}
              onChange={(e) => onOgTitleChange(e.target.value)}
              className="h-10 rounded-xl border-input bg-card text-xs font-medium"
              maxLength={95}
            />
            <p className="text-[11px] text-muted-foreground font-medium">
              Overrides the title specifically for social media cards.
            </p>
          </div>

          {/* OG Description */}
          <div className="space-y-1.5">
            <label htmlFor="og-desc" className="block text-xs font-semibold text-foreground">
              Social Card Description (Optional Override)
            </label>
            <textarea
              id="og-desc"
              rows={2}
              placeholder="Leave blank to use Meta Description"
              value={ogDescription}
              onChange={(e) => onOgDescriptionChange(e.target.value)}
              className="w-full rounded-xl border border-input bg-card p-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              maxLength={200}
            />
          </div>

          {/* Hidden File Input for Direct Banner Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* OG Image Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <label>Social Share Image (og:image)</label>
              <span className="text-[11px] font-medium text-muted-foreground">
                Optimal: 1200 × 630 px (1.91:1)
              </span>
            </div>

            {uploadError && (
              <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-[11px] font-semibold text-rose-700">
                {uploadError}
              </div>
            )}

            {ogImageUrl ? (
              <div className="flex items-center gap-3.5 p-3 rounded-xl border border-border/80 bg-muted/20">
                <div className="w-20 h-12 rounded-lg overflow-hidden bg-card border border-border/60 flex-shrink-0">
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
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active on social cards</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                    className="rounded-lg text-xs font-semibold h-8 px-3"
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearOgMedia}
                    className="rounded-lg text-xs font-semibold h-8 px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-dashed border-border/90 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-foreground">
                      No custom share banner uploaded
                    </span>
                    <span className="block text-[11px] text-muted-foreground font-medium">
                      Defaults to your profile avatar or brand monogram
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg text-xs font-semibold h-8 px-3.5 gap-1.5 bg-primary text-white"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Banner</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                    className="rounded-lg text-xs font-semibold h-8 px-3 gap-1.5"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Choose from Library</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Media Gallery Picker Drawer */}
            {showMediaPicker && (
              <div className="p-4 rounded-xl border border-border bg-card shadow-md space-y-3 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Select from Your Media Library:
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-medium h-7 px-2 text-primary"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Upload New
                    </Button>
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(false)}
                      className="text-muted-foreground hover:text-foreground text-xs p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
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
                          "relative aspect-[1.91/1] rounded-lg overflow-hidden border transition-all hover:scale-105 group",
                          ogImageMediaId === item.id
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border hover:border-primary/50"
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
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      No images found in your media library.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold h-8"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Upload Image Now
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
