"use client";

import * as React from "react";
import { LayoutList, Plus } from "lucide-react";
import { blocksApi } from "@/lib/api/blocks";
import { useCardEditor } from "@/lib/editor/store";
import { BLOCK_DEFINITIONS } from "@/lib/blocks/registry";
import type { BlockConfig, BlockType, ProfileBlock } from "@/types/blocks";
import { BlockList } from "@/components/editor/BlockList";
import { AddBlockSheet } from "@/components/editor/AddBlockSheet";
import { BlockDeleteDialog } from "@/components/editor/BlockDeleteDialog";

/** One-click suggestions shown while the card has no extra blocks. */
const QUICK_ADD: BlockType[] = ["text", "video", "faq", "gallery", "contact"];
const QUICK_LABEL: Partial<Record<BlockType, string>> = { text: "Text", video: "Video", faq: "FAQ", gallery: "Gallery", contact: "Contact form" };

/**
 * Extra blocks (text, video, FAQ, contact form, …) shown at the end of every template.
 * Blocks save on their own (each block has its own endpoint and version).
 */
export function BlocksSection() {
  const blocks = useCardEditor((s) => s.blocks);
  const lifted = useCardEditor((s) => s.liftedBlockIds);
  const version = useCardEditor((s) => s.version);
  const setBlocks = useCardEditor((s) => s.setBlocks);
  const [adding, setAdding] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<ProfileBlock | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Contact and social blocks that now live in "Contact buttons" / "Social links" are not listed.
  const shown = blocks.filter((b) => !lifted.includes(b.id));

  const run = async (fn: () => Promise<void>) => {
    setSaving(true);
    setError(null);
    try {
      await fn();
      window.dispatchEvent(new Event("digicardo_profile_updated"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the block.");
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type: BlockType) =>
    run(async () => {
      setAdding(false);
      const def = BLOCK_DEFINITIONS[type];
      // New blocks start hidden so placeholder text never reaches the live card.
      await blocksApi.createBlock({ type, config: def.defaultConfig, is_visible: false });
      setBlocks(await blocksApi.getBlocks());
    });

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-muted-foreground">
        Extra sections shown at the end of your card. New blocks start hidden — fill them in, then switch them on.
      </p>
      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-7 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutList className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-[15px] font-semibold text-foreground">No extra blocks yet</p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">Add a section to the end of your card — pick one below or browse them all.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {QUICK_ADD.map((type) => {
              const def = BLOCK_DEFINITIONS[type];
              const Icon = def.icon;
              return (
                <button
                  key={type}
                  type="button"
                  disabled={saving}
                  onClick={() => void addBlock(type)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {QUICK_LABEL[type] ?? def.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Browse all blocks
          </button>
        </div>
      ) : (
        <>
        <BlockList
          blocks={shown}
          isSaving={saving}
          onSaveBlock={(blockId: string, config: BlockConfig) =>
            run(async () => {
              const target = blocks.find((b) => b.id === blockId);
              const updated = await blocksApi.updateBlock(blockId, { config, version: target?.version ?? 1 });
              setBlocks(blocks.map((b) => (b.id === blockId ? updated : b)));
            })
          }
          onToggleVisibility={(block) =>
            void run(async () => {
              const updated = await blocksApi.updateBlock(block.id, { is_visible: !block.is_visible, version: block.version });
              setBlocks(blocks.map((b) => (b.id === block.id ? updated : b)));
            })
          }
          onDuplicateBlock={(block) =>
            void run(async () => {
              await blocksApi.createBlock({ type: block.type, config: block.config, is_visible: false });
              setBlocks(await blocksApi.getBlocks());
            })
          }
          onReorderBlocks={(next) =>
            void run(async () => {
              const hiddenLifted = blocks.filter((b) => lifted.includes(b.id));
              const ordered = [...next, ...hiddenLifted];
              setBlocks(ordered);
              await blocksApi.reorderBlocks({ ordered_ids: ordered.map((b) => b.id), version });
            })
          }
          onDeleteBlock={(block) => setDeleting(block)}
        />
        <button type="button" onClick={() => setAdding(true)} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-input bg-card px-3.5 text-sm font-semibold hover:bg-muted">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add a block
        </button>
        </>
      )}
      {error && <p role="alert" className="text-[13px] text-destructive">{error}</p>}
      <AddBlockSheet isOpen={adding} onClose={() => setAdding(false)} onSelectType={(type) => void addBlock(type)} />
      <BlockDeleteDialog
        block={deleting}
        isOpen={deleting !== null}
        isDeleting={saving}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          const target = deleting;
          if (!target) return;
          await run(async () => {
            await blocksApi.deleteBlock(target.id);
            setBlocks(blocks.filter((b) => b.id !== target.id));
          });
          setDeleting(null);
        }}
      />
    </div>
  );
}
