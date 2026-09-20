"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Globe,
  MessageCircle,
  Instagram,
  Linkedin,
  Palette,
  Layers,
  Eye,
} from "lucide-react";
import { profileApi } from "@/lib/api/profile";
import { blocksApi } from "@/lib/api/blocks";
import { getAllTemplates } from "@/templates/registry";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import type { Profile } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import { cn } from "@/lib/utils";

export interface OnboardingWizardProps {
  onComplete: (profile: Profile) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Step 1: Identity
  const [username, setUsername] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Step 2: First Links
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [whatsappPhone, setWhatsappPhone] = React.useState("");
  const [instagramUser, setInstagramUser] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");

  // Step 3: Template Style
  const allTemplates = React.useMemo(() => getAllTemplates(), []);
  const curatedTemplates = allTemplates; // Only vcard template is available
  const [selectedTemplateId, setSelectedTemplateId] =
    React.useState("vcard");

  // Flow State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdProfile, setCreatedProfile] = React.useState<Profile | null>(
    null
  );
  const [createdBlocks, setCreatedBlocks] = React.useState<ProfileBlock[]>([]);

  // ── Step 1 Submit: Create Profile ──
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim()) {
      setErrorMsg("Please enter both a username handle and display name.");
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const created = await profileApi.createProfile({
        username: username.trim().toLowerCase(),
        display_name: displayName.trim(),
        bio: bio.trim() || undefined,
      });
      setCreatedProfile(created);
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to create profile handle. Please try another.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2 Submit: Create Initial Blocks ──
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const blocksToAdd = [];
    if (websiteUrl.trim()) {
      blocksToAdd.push({
        type: "link" as const,
        config: {
          title: "My Official Website",
          url: websiteUrl.startsWith("http")
            ? websiteUrl
            : `https://${websiteUrl}`,
        },
      });
    }
    if (whatsappPhone.trim()) {
      blocksToAdd.push({
        type: "whatsapp" as const,
        config: {
          label: "Chat on WhatsApp",
          phone: whatsappPhone.replace(/[^0-9+]/g, ""),
        },
      });
    }
    if (instagramUser.trim()) {
      const handle = instagramUser.replace("@", "");
      blocksToAdd.push({
        type: "social" as const,
        config: {
          platform: "instagram" as const,
          url: `https://instagram.com/${handle}`,
        },
      });
    }
    if (linkedinUrl.trim()) {
      blocksToAdd.push({
        type: "social" as const,
        config: {
          platform: "linkedin" as const,
          url: linkedinUrl.startsWith("http")
            ? linkedinUrl
            : `https://${linkedinUrl}`,
        },
      });
    }

    try {
      for (const block of blocksToAdd) {
        await blocksApi.createBlock(block);
      }
      const fetched = await blocksApi.getBlocks();
      setCreatedBlocks(fetched);
      setStep(3);
    } catch {
      // Non-blocking, continue to step 3
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 3 Submit: Apply Selected Template ──
  const handleStep3Submit = async () => {
    if (!createdProfile) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const tDef = allTemplates.find((t) => t.id === selectedTemplateId);
    const themeTokens = tDef ? tDef.default_theme : undefined;

    try {
      const updated = await profileApi.updateAppearance({
        template_id: selectedTemplateId,
        theme_tokens: themeTokens,
        version: createdProfile.version,
      });
      setCreatedProfile(updated);
      setStep(4);
    } catch {
      // Non-blocking, continue to step 4
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTemplateDef = React.useMemo(() => {
    return (
      allTemplates.find((t) => t.id === selectedTemplateId) || allTemplates[0]
    );
  }, [allTemplates, selectedTemplateId]);

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in-50 duration-300">
      {/* ── Top Step Progress Indicator ── */}
      <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-brand-600">
              STEP {step} OF 4
            </span>
          </div>
          <span className="text-xs font-extrabold text-muted-foreground">
            {step === 1 && "Identity & Profile"}
            {step === 2 && "Add First Links"}
            {step === 3 && "Choose Your Style"}
            {step === 4 && "Ready to Launch! 🚀"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 via-pink-500 to-amber-400 transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* ── STEP 1: Tell Us About Yourself ── */}
      {step === 1 && (
        <div className="rounded-[36px] bg-card border border-border/80 p-8 sm:p-12 shadow-float space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-border shadow-md flex items-center justify-center mx-auto">
              <Image src="/logo.png" alt="Digicardo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Welcome to Digicardo 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto">
              Let&apos;s set up your digital business card and profile in under 2 minutes. First, claim
              your unique link handle.
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-2xl border border-coral/30 bg-coral-50/20 p-3 text-xs text-coral font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground">
                Your Digicardo Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground select-none">
                  digicardo.app/
                </span>
                <Input
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  className="pl-32 font-mono h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground">
                Display Name or Business Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Mohamed Favaz or CSC Janaseva"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground">
                Bio or Headline (Optional)
              </label>
              <Input
                type="text"
                placeholder="e.g. Digital Creator · Tech Trainer · Community Hub"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="pill"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold h-12 shadow-cta gap-2"
              >
                <span>{isSubmitting ? "Setting up..." : "Continue to Links"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 2: Add First Links ── */}
      {step === 2 && (
        <div className="rounded-[36px] bg-card border border-border/80 p-8 sm:p-12 shadow-float space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-mint-600 to-sky-500 text-white flex items-center justify-center mx-auto shadow-cta">
              <Layers className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Add your first links &amp; contacts 🔗
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto">
              Fill in the channels you want visitors to reach you on. You can always add more blocks later.
            </p>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Primary Website or Store (Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Number (Optional)</span>
              </label>
              <Input
                type="tel"
                placeholder="+91 9876543210"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram Username (Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="@yourhandle"
                value={instagramUser}
                onChange={(e) => setInstagramUser(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-sky-600" />
                <span>LinkedIn URL (Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="pt-3 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(3)}
                className="rounded-full text-xs font-bold px-5 h-12"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                variant="pill"
                size="lg"
                disabled={isSubmitting}
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold h-12 shadow-cta gap-2 flex-1"
              >
                <span>{isSubmitting ? "Saving..." : "Continue to Style"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 3: Choose Your Style ── */}
      {step === 3 && (
        <div className="rounded-[36px] bg-card border border-border/80 p-8 sm:p-12 shadow-float space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-cta">
              <Palette className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Choose your starter style 🎨
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto">
              Pick a visual theme shell. Your links, bio, and content are kept safely intact.
            </p>
          </div>

          {/* Curated 4 Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {curatedTemplates.map((t) => {
              const isSelected = selectedTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={cn(
                    "p-4 rounded-3xl border transition-all text-left space-y-2.5 select-none shadow-card hover:-translate-y-0.5",
                    isSelected
                      ? "bg-card border-brand-500 ring-2 ring-brand-500/20 shadow-hover"
                      : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-foreground">
                      {t.name}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground font-medium line-clamp-2">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-border/80"
                      style={{ backgroundColor: t.default_theme.color_background }}
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-border/80"
                      style={{ backgroundColor: t.default_theme.color_surface }}
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-border/80"
                      style={{ backgroundColor: t.default_theme.color_accent }}
                    />
                    <span className="text-[10px] font-mono text-muted-foreground capitalize ml-auto">
                      {t.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              className="rounded-full text-xs font-bold px-4 h-12 gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>

            <Button
              type="button"
              variant="pill"
              size="lg"
              onClick={handleStep3Submit}
              disabled={isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold h-12 shadow-cta gap-2 flex-1"
            >
              <span>{isSubmitting ? "Applying..." : "Confirm & Preview"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Ready to Launch ── */}
      {step === 4 && createdProfile && (
        <div className="rounded-[36px] bg-card border border-border/80 p-8 sm:p-12 shadow-float space-y-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-cta">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Your Digicardo is Live! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto">
              Your digital profile is online at{" "}
              <span className="font-mono font-bold text-foreground">
                digicardo.app/{createdProfile.username}
              </span>
            </p>
          </div>

          {/* Mini Real-Time Phone Preview */}
          <div className="max-w-[280px] mx-auto rounded-[36px] border-4 border-slate-900 bg-black p-1 shadow-float overflow-hidden h-[340px]">
            <div className="h-full w-full overflow-y-auto no-scrollbar rounded-[32px] pt-4">
              <ProfileRenderer
                profile={createdProfile}
                blocks={createdBlocks}
                templateId={selectedTemplateId}
                themeTokens={activeTemplateDef.default_theme}
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href={`/${createdProfile.username}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl font-bold text-xs h-12 gap-1.5 bg-card hover:bg-muted"
              >
                <Eye className="w-4 h-4" />
                <span>View My Profile</span>
              </Button>
            </Link>

            <Link href="/dashboard/appearance">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl font-bold text-xs h-12 gap-1.5 bg-card hover:bg-muted text-brand-600 border-brand-200"
              >
                <Palette className="w-4 h-4" />
                <span>Customize More</span>
              </Button>
            </Link>

            <Button
              variant="pill"
              size="lg"
              onClick={() => onComplete(createdProfile)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs h-12 shadow-cta gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Dashboard</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
