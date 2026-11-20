"use client";

import * as React from "react";
import { MousePointerClick } from "lucide-react";
import { useCardEditor } from "@/lib/editor/store";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { cn } from "@/lib/utils";

/**
 * Live phone preview of the draft card. Clicking a part of the card opens the section
 * that edits it (plan §3.3 rule 2); links and buttons inside that part don't fire.
 */
export function PreviewPanel({ className, onEditRequest }: { className?: string; onEditRequest?: () => void }) {
  const profile = useCardEditor((s) => s.profile);
  const content = useCardEditor((s) => s.content);
  const theme = useCardEditor((s) => s.theme);
  const templateId = useCardEditor((s) => s.templateId);
  const blocks = useCardEditor((s) => s.blocks);
  const lifted = useCardEditor((s) => s.liftedBlockIds);
  const contentStored = useCardEditor((s) => s.contentStored);
  const setOpenSection = useCardEditor((s) => s.setOpenSection);

  // Render from the slower-updating copy so typing stays smooth on big cards.
  const deferredContent = React.useDeferredValue(content);
  const deferredTheme = React.useDeferredValue(theme);

  const previewBlocks = React.useMemo(
    () => blocks.filter((b) => b.is_visible && (contentStored || !lifted.includes(b.id))),
    [blocks, contentStored, lifted]
  );

  if (!profile) return null;

  const onClickCapture = (event: React.MouseEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-edit]");
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    const section = target.dataset.edit ?? null;
    setOpenSection(section);
    onEditRequest?.();
    window.requestAnimationFrame(() =>
      document.getElementById(`panel-${section}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        onClickCapture={onClickCapture}
        className={cn(
          "relative h-[min(760px,calc(100vh-190px))] min-h-[520px] w-[340px] overflow-y-auto overscroll-contain rounded-[40px] border-[8px] border-[#18181B] bg-white shadow-[0_24px_60px_rgba(16,24,40,0.18)] [scrollbar-width:none] xl:w-[375px]",
          "[&_[data-edit]]:cursor-pointer [&_[data-edit]:hover]:outline [&_[data-edit]:hover]:outline-2 [&_[data-edit]:hover]:-outline-offset-2 [&_[data-edit]:hover]:outline-[#5B3FE4]/60"
        )}
      >
        <ProfileRenderer
          mode="preview"
          profile={{ ...profile, content: deferredContent, show_branding: !deferredTheme.hide_branding }}
          blocks={previewBlocks}
          templateId={templateId}
          themeTokens={deferredTheme}
        />
      </div>
      <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <MousePointerClick className="h-4 w-4" aria-hidden="true" />
        Click anything in the preview to edit it.
      </p>
    </div>
  );
}
