"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CategoryPicker } from "@/components/cards/CategoryPicker";
import { TemplateBrowser } from "@/components/cards/TemplateBrowser";
import { cardsApi } from "@/lib/api/cards";
import { profileApi } from "@/lib/api/profile";
import { getAllTemplates, getTemplate } from "@/templates/registry";
import type { CardCategoryType, CardCategoryOption, CardItem } from "@/types/cards";
import type { TemplateDefinition } from "@/templates/types";
import type { Profile, ThemeTokens } from "@/types/profile";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Layers,
  Palette,
  Eye,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Share2,
  QrCode,
  Sparkles,
  MessageCircle,
  Download,
} from "lucide-react";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { step: 1, title: "Category", description: "Choose card type" },
  { step: 2, title: "Template", description: "Pick a layout" },
  { step: 3, title: "Customize", description: "Personalize details" },
  { step: 4, title: "Preview", description: "Live mobile view" },
  { step: 5, title: "Publish", description: "Share your card" },
];

export function CreateCardWizard() {
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = React.useState<WizardStep>(1);

  // Step 1: Category
  const [selectedCategory, setSelectedCategory] = React.useState<CardCategoryType>("business");

  // Step 2: Template
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("vcard");

  // Step 3: Card Details
  const [cardTitle, setCardTitle] = React.useState<string>("My Digital Business Card");
  const [displayName, setDisplayName] = React.useState<string>("");
  const [bio, setBio] = React.useState<string>("Founder & Managing Director");
  const [username, setUsername] = React.useState<string>("");

  // Theme state
  const [themeTokens, setThemeTokens] = React.useState<ThemeTokens>({
    color_background: "#f0f4f8",
    color_surface: "#ffffff",
    color_text_primary: "#1e293b",
    color_text_secondary: "#64748b",
    color_accent: "#f97316",
    font_family: "poppins",
    button_radius: "large",
    button_style: "solid",
    animation: "none",
  });

  // Creation & Publish State
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [createdCard, setCreatedCard] = React.useState<CardItem | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<boolean>(false);

  // On template change, initialize appropriate theme
  const handleTemplateSelect = (template: TemplateDefinition) => {
    setSelectedTemplateId(template.id);
    setThemeTokens(template.default_theme);
    setCurrentStep(3);
  };

  // Step 1 -> Step 2
  const handleCategorySelect = (category: CardCategoryOption) => {
    setSelectedCategory(category.id);
    setSelectedTemplateId(category.recommendedTemplate || "vcard");
    const t = getTemplate(category.recommendedTemplate || "vcard");
    if (t) setThemeTokens(t.default_theme);
    setCurrentStep(2);
  };

  // Mock profile object for live rendering
  const previewProfile = React.useMemo<Profile>(() => {
    return {
      id: "preview-id",
      user_id: "preview-user",
      username: username || "your-handle",
      display_name: displayName || "Your Name",
      bio: bio || "Welcome to my digital card!",
      avatar_url: null,
      cover_url: null,
      template_id: selectedTemplateId,
      theme_tokens: themeTokens,
      is_public: true,
      seo_title: `${displayName || "Digital Card"} - Digicardo`,
      seo_description: bio,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }, [username, displayName, bio, selectedTemplateId, themeTokens]);

  // Handle Save / Publish
  const handlePublish = async () => {
    setIsCreating(true);
    setErrorMessage(null);

    try {
      // 1. Create card
      const card = await cardsApi.createCard({
        category: selectedCategory,
        template_id: selectedTemplateId,
        card_title: cardTitle.trim() || "My Digital Card",
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        username: username.trim() ? username.trim().toLowerCase() : undefined,
        theme_tokens: themeTokens,
      });

      // 2. Publish card
      const published = await cardsApi.publishCard(card.id);
      setCreatedCard(published);
      setCurrentStep(5);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to create card. Please verify details.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const publicUrl = createdCard
    ? typeof window !== "undefined"
      ? `${window.location.origin}/${createdCard.username}`
      : `https://digicardo.app/${createdCard.username}`
    : "";

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none pb-16">
      {/* ── Top Step Progress Bar ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          {STEPS.map((s, index) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <React.Fragment key={s.step}>
                <div
                  onClick={() => {
                    if (s.step < currentStep && currentStep !== 5) {
                      setCurrentStep(s.step as WizardStep);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 cursor-pointer group",
                    s.step < currentStep && currentStep !== 5 ? "cursor-pointer" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-200 shadow-2xs",
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-slate-900 text-white ring-4 ring-slate-900/10"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                  </div>

                  <div className="hidden md:block">
                    <p
                      className={cn(
                        "text-xs font-bold leading-tight",
                        isCurrent
                          ? "text-slate-900"
                          : isCompleted
                          ? "text-slate-700"
                          : "text-slate-400"
                      )}
                    >
                      {s.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{s.description}</p>
                  </div>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 sm:mx-4 rounded-full transition-colors",
                      isCompleted ? "bg-emerald-500" : "bg-slate-200"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Error Notification ── */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* ── STEP 1: CHOOSE A CATEGORY ── */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What kind of card are you creating?
            </h2>
            <p className="text-sm text-slate-500">
              Select a category to customize your card structure and quick actions.
            </p>
          </div>

          <CategoryPicker
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Continue to Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: CHOOSE A TEMPLATE ── */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pick a template
            </h2>
            <p className="text-sm text-slate-500">
              Choose an executive layout for your {selectedCategory} card. You can customize colors and links anytime.
            </p>
          </div>

          <TemplateBrowser
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleTemplateSelect}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Continue with Selected Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: CUSTOMIZE THE CARD ── */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Customize your card details
            </h2>
            <p className="text-sm text-slate-500">
              Enter your name, role, and choose a unique username slug for your public link.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Inputs (Left Column - 7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Card Name (Internal Reference)</label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="e.g. My Executive Business Card"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Mohamed Favaz"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Public URL Slug</label>
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-slate-900">
                    <span className="px-3 text-xs text-slate-400 bg-slate-50 font-mono border-r border-slate-200 py-2.5">
                      /
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="favaz-biz"
                      className="w-full px-3 py-2.5 text-sm focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Professional Bio / Title</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Founder & Managing Director at Nexus Solutions"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              {/* Template Theme Color Selection */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-600" />
                  <span>Accent Color</span>
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {[
                    { name: "Orange", hex: "#f97316" },
                    { name: "Emerald", hex: "#10b981" },
                    { name: "Indigo", hex: "#6366f1" },
                    { name: "Brand Violet", hex: "#5B3FE4" },
                    { name: "Rose", hex: "#f43f5e" },
                    { name: "Slate", hex: "#0f172a" },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() =>
                        setThemeTokens((prev) => ({
                          ...prev,
                          color_accent: color.hex,
                        }))
                      }
                      className={cn(
                        "w-8 h-8 rounded-full border transition-transform flex items-center justify-center cursor-pointer",
                        themeTokens.color_accent === color.hex
                          ? "ring-2 ring-slate-900 scale-110 shadow-xs"
                          : "hover:scale-105 border-slate-200"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {themeTokens.color_accent === color.hex && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Live Preview Sticky (Right Column - 5 cols) */}
            <div className="lg:col-span-5 sticky top-6">
              <div className="bg-slate-900 text-white p-4 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Mockup</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">/{username || "handle"}</span>
                </div>

                {/* Scaled Preview Frame */}
                <div className="w-full h-80 rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800">
                  <div className="w-[375px] origin-top scale-[0.62] transform absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none">
                    <ProfileRenderer profile={previewProfile} blocks={[]} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>See Full Mobile Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: FULL MOBILE PREVIEW ── */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Review your live digital card
            </h2>
            <p className="text-sm text-slate-500">
              This is how your visitors and clients will see your digital card on their mobile devices.
            </p>
          </div>

          {/* Full Interactive Phone Shell */}
          <div className="flex justify-center py-4">
            <div className="w-[380px] rounded-[48px] bg-slate-900 p-3.5 shadow-2xl border-4 border-slate-800 ring-12 ring-slate-100">
              {/* Dynamic Island / Speaker notch */}
              <div className="h-5 w-28 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* Screen Body */}
              <div className="h-[580px] rounded-[36px] overflow-y-auto bg-white border border-slate-800 shadow-inner no-scrollbar">
                <ProfileRenderer profile={previewProfile} blocks={[]} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              disabled={isCreating}
              onClick={handlePublish}
              className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isCreating ? (
                <span>Publishing Digital Card...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish & Get Public Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: PUBLISH & SHARE ── */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-in zoom-in-95 duration-300 text-center max-w-2xl mx-auto">
          {/* Success Banner */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Your digital card is live!
            </h2>
            <p className="text-sm text-slate-500">
              Anyone with this link can view your digital card, save contact info, and reach you directly.
            </p>
          </div>

          {/* Public Link Card with Copy Button */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-left">
              Shareable Card Link
            </span>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
              <span className="font-mono text-sm font-bold text-slate-900 truncate">
                {publicUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* Quick Sharing Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out my digital card: ${publicUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>WhatsApp Share</span>
            </a>

            <Link
              href="/dashboard/qr"
              prefetch={false}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <QrCode className="w-5 h-5 text-slate-700" />
              <span>Download QR Code</span>
            </Link>

            <Link
              href={createdCard ? `/${createdCard.username}` : "/"}
              target="_blank"
              className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-colors col-span-2 sm:col-span-1"
            >
              <ExternalLink className="w-5 h-5 text-indigo-600" />
              <span>Open Live Card</span>
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard/cards"
              prefetch={false}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Go to My Cards</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              prefetch={false}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
            >
              <span>Dashboard Overview</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
