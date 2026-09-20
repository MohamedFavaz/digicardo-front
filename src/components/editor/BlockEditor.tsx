"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type {
  ProfileBlock,
  BlockConfig,
  FaqItem,
} from "@/types/blocks";
import { cn } from "@/lib/utils";

export interface BlockEditorProps {
  block: ProfileBlock;
  onSave: (updatedConfig: BlockConfig) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function BlockEditor({
  block,
  onSave,
  onCancel,
  isSaving,
}: BlockEditorProps) {
  const [config, setConfig] = React.useState<Record<string, unknown>>({
    ...(block.config as Record<string, unknown>),
  });
  const [error, setError] = React.useState<string | null>(null);

  const updateField = (key: string, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic URL validation if url exists
    if ("url" in config && typeof config.url === "string" && config.url.trim() !== "") {
      const urlStr = config.url.trim();
      if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://") && !urlStr.startsWith("mailto:") && !urlStr.startsWith("tel:")) {
        setError("Please enter a valid URL beginning with https://");
        return;
      }
    }

    try {
      await onSave(config as unknown as BlockConfig);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save block configuration.");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-4 animate-in fade-in-50"
    >
      {error && (
        <div className="rounded-xl border border-coral/30 bg-coral-50/20 p-3 text-xs text-coral font-bold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Type-Specific Input Fields ── */}

      {/* 1. Link */}
      {block.type === "link" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Link Title</label>
            <Input
              type="text"
              placeholder="e.g. My Online Store"
              value={String(config.title || "")}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Destination URL</label>
            <Input
              type="url"
              placeholder="https://..."
              value={String(config.url || "")}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* 2. Heading */}
      {block.type === "heading" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Heading Text</label>
            <Input
              type="text"
              placeholder="Section Title"
              value={String(config.text || "")}
              onChange={(e) => updateField("text", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Level</label>
            <div className="flex items-center gap-2">
              {(["h1", "h2", "h3"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => updateField("level", lvl)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all uppercase",
                    config.level === lvl
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 3. Text Paragraph */}
      {block.type === "text" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Content</label>
            <textarea
              rows={3}
              placeholder="Write a message or announcement..."
              value={String(config.content || "")}
              onChange={(e) => updateField("content", e.target.value)}
              className="w-full rounded-2xl border border-input bg-card p-3 text-xs text-foreground font-medium focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Text Alignment</label>
            <div className="flex items-center gap-2">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateField("align", align)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all capitalize",
                    config.align === align
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 4. Divider */}
      {block.type === "divider" && (
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-foreground">Divider Style</label>
          <div className="flex items-center gap-2">
            {(["line", "dots", "space"] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => updateField("style", style)}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all capitalize",
                  config.style === style
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Social */}
      {block.type === "social" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Platform</label>
            <select
              value={String(config.platform || "instagram")}
              onChange={(e) => updateField("platform", e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-card px-3 text-xs font-bold text-foreground focus:outline-none"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="x">X / Twitter</option>
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
              <option value="website">Personal Website</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Profile URL</label>
            <Input
              type="url"
              placeholder="https://..."
              value={String(config.url || "")}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* 6. Video Embed */}
      {block.type === "video" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Provider</label>
            <div className="flex items-center gap-2">
              {(["youtube", "vimeo"] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => updateField("provider", prov)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all capitalize",
                    config.provider === prov
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Video Title</label>
            <Input
              type="text"
              placeholder="My latest project walkthrough"
              value={String(config.title || "")}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Video URL</label>
            <Input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={String(config.url || "")}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* 7. Music Player */}
      {block.type === "music" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Platform</label>
            <div className="flex items-center gap-2">
              {(["spotify", "apple_music", "soundcloud"] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => updateField("provider", prov)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all capitalize",
                    config.provider === prov
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {prov.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Track / Album URL</label>
            <Input
              type="url"
              placeholder="https://open.spotify.com/track/..."
              value={String(config.url || "")}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* 8. Contact Form */}
      {block.type === "contact" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Form Title</label>
            <Input
              type="text"
              placeholder="Get in touch"
              value={String(config.title || "")}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Description</label>
            <Input
              type="text"
              placeholder="Send me a direct message."
              value={String(config.description || "")}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Submit Button Text</label>
            <Input
              type="text"
              placeholder="Send Message"
              value={String(config.button_label || "")}
              onChange={(e) => updateField("button_label", e.target.value)}
            />
          </div>
        </>
      )}

      {/* 9. Appointment Booking */}
      {block.type === "booking" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Booking Title</label>
            <Input
              type="text"
              placeholder="Book a 1-on-1 Consultation"
              value={String(config.title || "")}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Calendly / Cal.com URL</label>
            <Input
              type="url"
              placeholder="https://calendly.com/yourname"
              value={String(config.url || "")}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* 10. Call to Action (CTA) */}
      {block.type === "cta" && (
        <>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">CTA Headline</label>
            <Input
              type="text"
              placeholder="Join My Inner Circle"
              value={String(config.title || "")}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Description</label>
            <Input
              type="text"
              placeholder="Exclusive weekly insights directly to your inbox."
              value={String(config.description || "")}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Button Label</label>
            <Input
              type="text"
              placeholder="Sign Up Free"
              value={String(config.button_label || "")}
              onChange={(e) => updateField("button_label", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Target URL</label>
            <Input
              type="url"
              placeholder="https://..."
              value={String(config.url || "")}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* 11. FAQ Accordion */}
      {block.type === "faq" && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-foreground">Section Title</label>
            <Input
              type="text"
              placeholder="Frequently Asked Questions"
              value={String(config.title || "")}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-foreground">Questions &amp; Answers</label>
            {Array.isArray(config.items) &&
              (config.items as FaqItem[]).map((item, idx) => (
                <div key={item.id || idx} className="p-3 rounded-xl bg-card border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (config.items as FaqItem[]).filter((_, i) => i !== idx);
                        updateField("items", updated);
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Input
                    type="text"
                    placeholder="Question"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...(config.items as FaqItem[])];
                      updated[idx] = { ...updated[idx], question: e.target.value };
                      updateField("items", updated);
                    }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer"
                    value={item.answer}
                    onChange={(e) => {
                      const updated = [...(config.items as FaqItem[])];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      updateField("items", updated);
                    }}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const current = (config.items as FaqItem[]) || [];
                updateField("items", [
                  ...current,
                  { id: `faq-${Date.now()}`, question: "New Question", answer: "Answer details" },
                ]);
              }}
              className="w-full rounded-xl text-xs font-bold gap-1 border-dashed"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ Question</span>
            </Button>
          </div>
        </div>
      )}

      {/* 12. Fallback Generic Inputs */}
      {["email", "phone", "whatsapp", "countdown", "map"].includes(block.type) && (
        <div className="space-y-2">
          {Object.entries(config).map(([key, val]) => {
            if (typeof val === "boolean" || typeof val === "object") return null;
            return (
              <div key={key} className="space-y-1">
                <label className="block text-xs font-extrabold text-foreground capitalize">
                  {key.replace("_", " ")}
                </label>
                <Input
                  type="text"
                  value={String(val || "")}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-full font-bold text-xs"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="pill"
          size="sm"
          disabled={isSaving}
          className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-5 shadow-cta gap-1.5"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
