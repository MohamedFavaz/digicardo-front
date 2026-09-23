"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import { blocksApi } from "@/lib/api/blocks";
import { getAllTemplates, getTemplate } from "@/templates/registry";
import { ThemeTokensSchema } from "@/lib/validation/theme";
import { ApiClientError, ApiConflictError, ApiNotFoundError } from "@/lib/api/errors";
import type {
  Profile,
  ThemeTokens,
  FontFamily,
  ButtonRadius,
} from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import { useEntitlements } from "@/lib/hooks/use-entitlements";
import { UpgradeDialog } from "@/components/billing/UpgradeDialog";
import { TemplatePicker } from "@/components/appearance/TemplatePicker";
import { AppearanceSkeleton } from "@/components/appearance/AppearanceSkeleton";
import { AppearanceHeader } from "@/components/appearance/AppearanceHeader";
import { ThemePicker } from "@/components/appearance/ThemePicker";
import { TypographyPicker } from "@/components/appearance/TypographyPicker";
import { ButtonStylePicker } from "@/components/appearance/ButtonStylePicker";
import { AppearancePreview } from "@/components/appearance/AppearancePreview";
import type { SaveState } from "@/components/editor/SaveStatus";
import {
  Palette,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppearanceEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramTemplateId = searchParams.get("template");

  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { can } = useEntitlements();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [blocks, setBlocks] = React.useState<ProfileBlock[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Pro Upgrade dialog
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [gatedFeature, setGatedFeature] = React.useState<string>("advanced_templates");

  // Mobile View Tab: 'edit' or 'preview'
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Template & Theme state
  const templates = React.useMemo(() => getAllTemplates(), []);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("vcard");
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

  // Track initial tokens to detect unsaved changes
  const [initialState, setInitialState] = React.useState<{
    templateId: string;
    tokens: ThemeTokens;
  } | null>(null);

  const hasUnsavedChanges = React.useMemo(() => {
    if (!initialState) return false;
    if (initialState.templateId !== selectedTemplateId) return true;
    return JSON.stringify(initialState.tokens) !== JSON.stringify(themeTokens);
  }, [initialState, selectedTemplateId, themeTokens]);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [p, b] = await Promise.all([
        profileApi.getProfile().catch((err) => {
          if (err instanceof ApiNotFoundError) {
            router.push("/dashboard");
            return null;
          }
          throw err;
        }),
        blocksApi.getBlocks().catch(() => []),
      ]);

      if (!p) return;

      setProfile(p);
      setBlocks(b);

      const activeTplId = paramTemplateId || p.template_id || "vcard";
      setSelectedTemplateId(activeTplId);

      const tDef = getTemplate(activeTplId);
      const isMatchingTemplate = p.template_id === activeTplId;

      const activeTokens: ThemeTokens = {
        ...tDef.default_theme,
        ...(isMatchingTemplate && p.theme_tokens ? p.theme_tokens : {}),
        custom_options: {
          ...(tDef.default_theme.custom_options || {}),
          ...(isMatchingTemplate && p.theme_tokens?.custom_options ? p.theme_tokens.custom_options : {}),
        },
      };

      setThemeTokens(activeTokens);
      setInitialState({
        templateId: activeTplId,
        tokens: activeTokens,
      });
      setSaveState("saved");

      // Smooth scroll if anchor or template param is present
      if (typeof window !== "undefined" && (window.location.hash === "#templates" || paramTemplateId)) {
        setTimeout(() => {
          const el = document.getElementById("templates");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 250);
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
        setSaveState("error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [paramTemplateId, router]);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard/appearance");
    } else if (isAuthenticated) {
      loadData();
    }
  }, [isAuthLoading, isAuthenticated, router, loadData]);

  // Update saveState when changes are made
  React.useEffect(() => {
    if (!isLoading && hasUnsavedChanges) {
      setSaveState("unsaved");
    }
  }, [hasUnsavedChanges, isLoading]);

  // Discard unsaved changes and revert preview to last saved section
  const handleDiscardChanges = () => {
    if (!initialState) return;
    setSelectedTemplateId(initialState.templateId);
    setThemeTokens(initialState.tokens);
    setSaveState("saved");
  };

  // Reset to template defaults
  const handleResetToDefault = () => {
    const tDef = getTemplate(selectedTemplateId);
    setThemeTokens(tDef.default_theme);
  };

  const handleUpdateProfile = React.useCallback((updated: Partial<Profile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updated } : prev));
  }, []);

  // Handle in-studio template selection
  const handleSelectTemplate = (newId: string) => {
    if (newId === selectedTemplateId) return;
    setSelectedTemplateId(newId);
    const tDef = getTemplate(newId);
    const isMatching = profile?.template_id === newId;
    const newTokens: ThemeTokens = {
      ...tDef.default_theme,
      ...(isMatching && profile?.theme_tokens ? profile.theme_tokens : {}),
      custom_options: {
        ...(tDef.default_theme.custom_options || {}),
        ...(isMatching && profile?.theme_tokens?.custom_options
          ? profile.theme_tokens.custom_options
          : (themeTokens.custom_options || {})),
      },
    };
    setThemeTokens(newTokens);
    router.replace(`/dashboard/appearance?template=${newId}`, { scroll: false });
  };

  // Save / Publish Appearance
  const handleSaveAppearance = async () => {
    if (!profile) return;
    setErrorMessage(null);
    setSuccessToast(null);

    const parseResult = ThemeTokensSchema.safeParse(themeTokens);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      setErrorMessage(`Invalid theme configuration: ${issue?.message || "Please check inputs"}`);
      setSaveState("error");
      return;
    }

    setIsSaving(true);
    setSaveState("saving");

    const performSave = async (versionToUse: number): Promise<Profile> => {
      return await profileApi.updateAppearance({
        template_id: selectedTemplateId,
        theme_tokens: parseResult.data,
        version: versionToUse,
      });
    };

    const applySuccessfulSave = (updated: Profile) => {
      const tDef = getTemplate(selectedTemplateId);
      const serverTokens = updated.theme_tokens ?? parseResult.data;
      const submittedCustom = (parseResult.data.custom_options as Record<string, any>) || {};
      const serverCustom = (serverTokens.custom_options as Record<string, any>) || {};

      const savedTokens: ThemeTokens = {
        ...tDef.default_theme,
        ...serverTokens,
        custom_options: {
          ...(tDef.default_theme.custom_options || {}),
          ...submittedCustom,
          ...serverCustom,
        },
      };

      const finalProfile: Profile = {
        ...updated,
        avatar_url:
          updated.avatar_url ||
          submittedCustom.profile_image_url ||
          submittedCustom.custom_avatar_url ||
          profile.avatar_url,
      };

      setProfile(finalProfile);
      setThemeTokens(savedTokens);
      setInitialState({
        templateId: selectedTemplateId,
        tokens: savedTokens,
      });
      setSaveState("saved");
      setSuccessToast("Customization saved and published live! 🎉");
      setTimeout(() => setSuccessToast(null), 4000);
    };

    try {
      try {
        const updated = await performSave(profile.version || 1);
        applySuccessfulSave(updated);
      } catch (saveErr: unknown) {
        if (saveErr instanceof ApiConflictError) {
          // If conflict occurred, resolve current version and auto-retry once
          let targetVersion = saveErr.currentVersion;
          if (!targetVersion) {
            const fresh = await profileApi.getProfile();
            targetVersion = fresh.version;
          }

          if (targetVersion) {
            try {
              const updated = await performSave(targetVersion);
              applySuccessfulSave(updated);
              return;
            } catch (retryErr) {
              console.error("Appearance save retry failed:", retryErr);
            }
          }
        }
        throw saveErr;
      }
    } catch (err: unknown) {
      if (err instanceof ApiConflictError) {
        setErrorMessage("Appearance was modified concurrently. Please review your changes and try again.");
      } else if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to publish appearance.");
      }
      setSaveState("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return <AppearanceSkeleton />;
  }

  const activeTemplate = getTemplate(selectedTemplateId);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 pb-32">
      {/* ── Studio Top Bar ── */}
      <AppearanceHeader
        profile={profile}
        templateName={activeTemplate?.name}
        saveState={saveState}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onDiscard={handleDiscardChanges}
        onResetToDefault={handleResetToDefault}
        onSave={handleSaveAppearance}
      />

      {/* ── Global Success Toast Banner ── */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── Mobile View Toggle Segmented Control (Hidden on lg) ── */}
      <div className="flex lg:hidden p-1.5 rounded-2xl bg-muted/60 border border-border/80 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMobileView("edit")}
          className={cn(
            "flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all select-none",
            mobileView === "edit"
              ? "bg-card text-brand-700 shadow-xs border border-brand-200"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Customize Styles</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all select-none",
            mobileView === "preview"
              ? "bg-card text-brand-700 shadow-xs border border-brand-200"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Phone Preview</span>
        </button>
      </div>

      {/* ── Main Studio Grid: Controls (Left) + Sticky Live Phone Preview (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls (7 cols) */}
        <div
          className={cn(
            "lg:col-span-7 space-y-6",
            mobileView === "preview" && "hidden lg:block"
          )}
        >


          {/* ── 0. Active Layout Template ── */}
          <div id="templates" className="scroll-mt-24">
            <TemplatePicker
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              canUseAdvancedTemplates={can("advanced_templates")}
              onSelectTemplate={handleSelectTemplate}
              onOpenUpgradeModal={() => {
                setGatedFeature("advanced_templates");
                setShowUpgradeModal(true);
              }}
            />
          </div>

          {/* ── Dynamic Template Settings Engine ── */}
          {activeTemplate?.SettingsComponent ? (
            <activeTemplate.SettingsComponent
              profile={profile}
              themeTokens={themeTokens}
              onChangeTheme={(updated) =>
                setThemeTokens((prev) => ({ ...prev, ...updated }))
              }
              onSave={handleSaveAppearance}
              isSaving={isSaving}
              onUpdateProfile={handleUpdateProfile}
            />
          ) : (
            <div className="space-y-6">
              <ThemePicker
                themeTokens={themeTokens}
                stepNumber={1}
                onChangeTheme={(updated) =>
                  setThemeTokens((prev) => ({ ...prev, ...updated }))
                }
              />
              <TypographyPicker
                selectedFont={themeTokens.font_family}
                stepNumber={2}
                onSelectFont={(font: FontFamily) =>
                  setThemeTokens((prev) => ({ ...prev, font_family: font }))
                }
              />
              <ButtonStylePicker
                selectedRadius={themeTokens.button_radius}
                stepNumber={3}
                onChangeRadius={(radius: ButtonRadius) =>
                  setThemeTokens((prev) => ({ ...prev, button_radius: radius }))
                }
              />
            </div>
          )}
        </div>

        {/* Right Column: Sticky Live Preview (5 cols) */}
        <div
          className={cn(
            "lg:col-span-5 lg:sticky lg:top-20 self-start",
            mobileView === "edit" && "hidden lg:block"
          )}
        >
          {/* View Live Page link */}
          {profile?.username && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 flex items-center justify-end gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Page</span>
            </a>
          )}
          <AppearancePreview
            profile={profile}
            blocks={blocks}
            selectedTemplateId={selectedTemplateId}
            themeTokens={themeTokens}
          />
        </div>
      </div>

      {/* Pro Upgrade Dialog */}
      <UpgradeDialog
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        highlightFeature={gatedFeature}
      />

      {/* ── Floating Sticky Save Bar (appears when changes are unsaved) ── */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-auto sm:w-full sm:max-w-lg mx-auto z-50 flex justify-center pointer-events-none">
          <div className="pointer-events-auto w-full">
            <div className="flex items-center justify-between gap-3 sm:gap-4 bg-slate-900/95 backdrop-blur-md text-white px-4 sm:px-5 py-3 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold truncate">Unsaved changes</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveAppearance}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-extrabold shadow-cta transition-all active:scale-95 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Save &amp; Publish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
