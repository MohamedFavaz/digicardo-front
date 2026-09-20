"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import { blocksApi } from "@/lib/api/blocks";
import type { Profile } from "@/types/profile";
import type {
  ProfileBlock,
  BlockConfig,
} from "@/types/blocks";
import { ApiClientError, ApiNotFoundError } from "@/lib/api/errors";
import { getAllTemplates, getTemplate } from "@/templates/registry";
import { useEntitlements } from "@/lib/hooks/use-entitlements";
import { UpgradeDialog } from "@/components/billing/UpgradeDialog";
import { TemplatePicker } from "@/components/appearance/TemplatePicker";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { BlockList } from "@/components/editor/BlockList";
import { EditorPreview } from "@/components/editor/EditorPreview";
import { BlockDeleteDialog } from "@/components/editor/BlockDeleteDialog";
import { EditorSkeleton } from "@/components/editor/EditorSkeleton";
import type { SaveState } from "@/components/editor/SaveStatus";
import { Layers, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyPageStudioPage() {
  const router = useRouter();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { can } = useEntitlements();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [blocks, setBlocks] = React.useState<ProfileBlock[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Template State & Upgrade Dialog
  const templates = React.useMemo(() => getAllTemplates(), []);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("vcard");
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [gatedFeature, setGatedFeature] = React.useState<string>("advanced_templates");

  // Mobile View Tab: 'content' or 'preview'
  const [mobileView, setMobileView] = React.useState<"content" | "preview">("content");

  // Delete Dialog State
  const [deletingBlock, setDeletingBlock] = React.useState<ProfileBlock | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Saving state for inline editor
  const [isSavingBlock, setIsSavingBlock] = React.useState(false);

  // Load Data
  const loadEditorData = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [p, b] = await Promise.all([
        profileApi.getProfile().catch((err) => {
          if (err instanceof ApiNotFoundError) return null;
          throw err;
        }),
        blocksApi.getBlocks().catch(() => []),
      ]);
      setProfile(p);
      if (p?.template_id) {
        setSelectedTemplateId(p.template_id);
      }
      setBlocks(b);
      setSaveState("saved");
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
        setSaveState("error");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard/page");
    } else if (isAuthenticated) {
      loadEditorData();
    }
  }, [isAuthLoading, isAuthenticated, router, loadEditorData]);

  // Handle Template Click / Selection: directly go to that template appearance section!
  const handleSelectTemplate = async (templateId: string) => {
    if (templateId !== selectedTemplateId && profile) {
      setSelectedTemplateId(templateId);
      const tDef = getTemplate(templateId);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              template_id: templateId,
              theme_tokens: prev.theme_tokens
                ? { ...tDef.default_theme, ...prev.theme_tokens }
                : tDef.default_theme,
            }
          : null
      );
      try {
        await profileApi.updateAppearance({
          template_id: templateId,
          version: profile.version,
          theme_tokens: profile.theme_tokens || tDef.default_theme,
        });
      } catch {
        // continue
      }
    }

    // Directly navigate to that template's appearance section!
    router.push(`/dashboard/appearance?template=${templateId}#templates`);
  };

  // Handle Save Block Config
  const handleSaveBlockConfig = async (blockId: string, updatedConfig: BlockConfig) => {
    const targetBlock = blocks.find((b) => b.id === blockId);
    if (!targetBlock) return;

    setIsSavingBlock(true);
    setSaveState("saving");
    try {
      const updated = await blocksApi.updateBlock(blockId, {
        config: updatedConfig,
        version: targetBlock.version,
      });

      setBlocks((prev) => prev.map((b) => (b.id === blockId ? updated : b)));
      setSaveState("saved");
    } catch (err: unknown) {
      setSaveState("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to save changes.");
      throw err;
    } finally {
      setIsSavingBlock(false);
    }
  };

  // Handle Toggle Visibility
  const handleToggleVisibility = async (block: ProfileBlock) => {
    const nextVisible = !block.is_visible;
    // Optimistic update
    setBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, is_visible: nextVisible } : b))
    );
    setSaveState("saving");

    try {
      const updated = await blocksApi.updateBlock(block.id, {
        is_visible: nextVisible,
        version: block.version,
      });
      setBlocks((prev) => prev.map((b) => (b.id === block.id ? updated : b)));
      setSaveState("saved");
    } catch {
      // Revert on failure
      setBlocks((prev) =>
        prev.map((b) => (b.id === block.id ? { ...b, is_visible: block.is_visible } : b))
      );
      setSaveState("error");
    }
  };

  // Handle Duplicate Block
  const handleDuplicateBlock = async (block: ProfileBlock) => {
    const configCopy = { ...(block.config as Record<string, unknown>) };
    if ("title" in configCopy && typeof configCopy.title === "string") {
      configCopy.title = `${configCopy.title} (Copy)`;
    } else if ("label" in configCopy && typeof configCopy.label === "string") {
      configCopy.label = `${configCopy.label} (Copy)`;
    }

    setSaveState("saving");
    try {
      await blocksApi.createBlock({
        type: block.type,
        config: configCopy as unknown as BlockConfig,
        is_visible: block.is_visible,
      });
      const updatedList = await blocksApi.getBlocks();
      setBlocks(updatedList);
      setSaveState("saved");
    } catch (err: unknown) {
      setSaveState("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to duplicate block.");
    }
  };

  // Handle Reorder Blocks
  const handleReorderBlocks = async (newBlocks: ProfileBlock[]) => {
    setBlocks(newBlocks);
    setSaveState("saving");

    try {
      const orderedIds = newBlocks.map((b) => b.id);
      const currentVersion = profile?.version || 1;
      await blocksApi.reorderBlocks({
        ordered_ids: orderedIds,
        version: currentVersion,
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setErrorMessage("Could not sync block order with server.");
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingBlock) return;
    setIsDeleting(true);

    try {
      await blocksApi.deleteBlock(deletingBlock.id);
      setBlocks((prev) => prev.filter((b) => b.id !== deletingBlock.id));
      setDeletingBlock(null);
      setSaveState("saved");
    } catch (err: unknown) {
      setSaveState("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete block.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return <EditorSkeleton />;
  }

  return (
    <div className="space-y-8 pb-24">
      
      {/* ── Studio Header ── */}
      <EditorHeader
        profile={profile}
        saveState={saveState}
        errorMessage={errorMessage}
        onRetrySave={loadEditorData}
      />

      {/* ── Mobile View Toggle Segmented Control (Hidden on lg) ── */}
      <div className="flex lg:hidden p-1.5 rounded-2xl bg-muted/60 border border-border/80 text-xs font-bold shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileView("content")}
          className={cn(
            "flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all select-none",
            mobileView === "content"
              ? "bg-card text-brand-600 shadow-xs border border-brand-200 dark:border-brand-800"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Page Content &amp; Blocks ({blocks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all select-none",
            mobileView === "preview"
              ? "bg-card text-brand-600 shadow-xs border border-brand-200 dark:border-brand-800"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Phone Preview</span>
        </button>
      </div>

      {/* ── Main Studio Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Template Selection & Content Studio (7 cols) */}
        <div className={cn("lg:col-span-7 space-y-8", mobileView === "preview" && "hidden lg:block")}>
          
          {/* ── Template Preview ── */}
          <div className="space-y-3">
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

          {/* ── Page Blocks & Content ── */}
          <div className="space-y-3 pt-2">
            <div>
              <h2 className="text-sm font-black text-foreground">My Page Content</h2>
              <p className="text-xs text-muted-foreground">
                {blocks.length === 0
                  ? "No extra blocks on your page"
                  : `${blocks.length} block${blocks.length !== 1 ? "s" : ""} · ${blocks.filter((b) => b.is_visible).length} visible`}
              </p>
            </div>

            <BlockList
              blocks={blocks}
              onSaveBlock={handleSaveBlockConfig}
              onToggleVisibility={handleToggleVisibility}
              onDuplicateBlock={handleDuplicateBlock}
              onReorderBlocks={handleReorderBlocks}
              onDeleteBlock={(block) => setDeletingBlock(block)}
              isSaving={isSavingBlock}
            />
          </div>

        </div>

        {/* Right Column: Live Synced Mobile Phone Preview (5 cols) */}
        <div className={cn("lg:col-span-5 lg:sticky lg:top-20 self-start", mobileView === "content" && "hidden lg:block")}>
          <EditorPreview
            profile={profile}
            blocks={blocks}
            selectedTemplateId={selectedTemplateId}
          />
        </div>

      </div>

      {/* ── Delete Confirmation Dialog ── */}
      <BlockDeleteDialog
        block={deletingBlock}
        isOpen={Boolean(deletingBlock)}
        isDeleting={isDeleting}
        onClose={() => setDeletingBlock(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* ── Pro Upgrade Dialog ── */}
      <UpgradeDialog
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        highlightFeature={gatedFeature}
      />
    </div>
  );
}

