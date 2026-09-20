"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { seoApi } from "@/lib/api/seo";
import { mediaApi } from "@/lib/api/media";
import { profileApi } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";
import type { MediaItem } from "@/types/media";
import { SEOHeader } from "@/components/seo/SEOHeader";
import { SEOForm } from "@/components/seo/SEOForm";
import { SEOPreviewCard } from "@/components/seo/SEOPreviewCard";
import { SEOChecklistCard } from "@/components/seo/SEOChecklistCard";
import { SEOSkeleton } from "@/components/seo/SEOSkeleton";
import type { SaveState } from "@/components/editor/SaveStatus";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SeoDashboardPage() {
  const router = useRouter();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Form State
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [ogTitle, setOgTitle] = React.useState("");
  const [ogDescription, setOgDescription] = React.useState("");
  const [ogImageMediaId, setOgImageMediaId] = React.useState<string | null>(null);
  const [ogImageUrl, setOgImageUrl] = React.useState<string | null>(null);
  const [indexable, setIndexable] = React.useState(true);

  // Initial State for dirty tracking
  const [initialFormState, setInitialFormState] = React.useState<{
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImageMediaId: string | null;
    indexable: boolean;
  } | null>(null);

  const hasUnsavedChanges = React.useMemo(() => {
    if (!initialFormState) return false;
    return (
      initialFormState.seoTitle !== seoTitle ||
      initialFormState.seoDescription !== seoDescription ||
      JSON.stringify(initialFormState.keywords) !== JSON.stringify(keywords) ||
      initialFormState.ogTitle !== ogTitle ||
      initialFormState.ogDescription !== ogDescription ||
      initialFormState.ogImageMediaId !== ogImageMediaId ||
      initialFormState.indexable !== indexable
    );
  }, [
    initialFormState,
    seoTitle,
    seoDescription,
    keywords,
    ogTitle,
    ogDescription,
    ogImageMediaId,
    indexable,
  ]);

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const [seoData, profileData, mediaData] = await Promise.all([
        seoApi.get(),
        profileApi.getProfile(),
        mediaApi.getMedia().catch(() => []),
      ]);

      setProfile(profileData);
      setMediaList(mediaData || []);

      const title = seoData.seo_title || "";
      const desc = seoData.seo_description || "";
      const keys = seoData.seo_keywords || [];
      const oTitle = seoData.og_title || "";
      const oDesc = seoData.og_description || "";
      const oMediaId = seoData.og_image_media_id || null;
      const oUrl = seoData.og_image_url || null;
      const isIdx = seoData.indexable ?? true;

      setSeoTitle(title);
      setSeoDescription(desc);
      setKeywords(keys);
      setOgTitle(oTitle);
      setOgDescription(oDesc);
      setOgImageMediaId(oMediaId);
      setOgImageUrl(oUrl);
      setIndexable(isIdx);

      setInitialFormState({
        seoTitle: title,
        seoDescription: desc,
        keywords: keys,
        ogTitle: oTitle,
        ogDescription: oDesc,
        ogImageMediaId: oMediaId,
        indexable: isIdx,
      });

      setSaveState("saved");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load SEO settings.");
      setSaveState("error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard/seo");
      return;
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthLoading, isAuthenticated, router, loadData]);

  // Update saveState when user types
  React.useEffect(() => {
    if (!isLoading && hasUnsavedChanges) {
      setSaveState("unsaved");
    }
  }, [hasUnsavedChanges, isLoading]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveState("saving");
      setErrorMessage(null);
      setSuccessToast(null);

      const updated = await seoApi.update({
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        seo_keywords: keywords,
        og_title: ogTitle.trim() || null,
        og_description: ogDescription.trim() || null,
        og_image_media_id: ogImageMediaId,
        indexable,
      });

      setInitialFormState({
        seoTitle: updated.seo_title || "",
        seoDescription: updated.seo_description || "",
        keywords: updated.seo_keywords || [],
        ogTitle: updated.og_title || "",
        ogDescription: updated.og_description || "",
        ogImageMediaId: updated.og_image_media_id || null,
        indexable: updated.indexable ?? true,
      });

      setSaveState("saved");
      setSuccessToast("SEO & Social Sharing configuration saved! 🎉");
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save SEO settings.");
      setSaveState("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return <SEOSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* ── Studio Header ── */}
      <SEOHeader
        profile={profile}
        saveState={saveState}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onSave={handleSave}
      />

      {/* ── Success Toast Banner ── */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Main 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7">
          <SEOForm
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            keywords={keywords}
            ogTitle={ogTitle}
            ogDescription={ogDescription}
            ogImageMediaId={ogImageMediaId}
            ogImageUrl={ogImageUrl}
            indexable={indexable}
            mediaList={mediaList}
            onTitleChange={setSeoTitle}
            onDescriptionChange={setSeoDescription}
            onKeywordsChange={setKeywords}
            onOgTitleChange={setOgTitle}
            onOgDescriptionChange={setOgDescription}
            onSelectOgMedia={(media: MediaItem) => {
              setOgImageMediaId(media.id);
              setOgImageUrl(media.url);
            }}
            onClearOgMedia={() => {
              setOgImageMediaId(null);
              setOgImageUrl(null);
            }}
            onIndexableChange={setIndexable}
          />
        </div>

        {/* Right Column: Previews & Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <SEOPreviewCard
            profile={profile}
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            ogTitle={ogTitle}
            ogDescription={ogDescription}
            ogImageUrl={ogImageUrl}
          />

          <SEOChecklistCard
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            ogImageUrl={ogImageUrl}
            indexable={indexable}
          />
        </div>

      </div>

    </div>
  );
}
