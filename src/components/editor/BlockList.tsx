"use client";

import * as React from "react";
import { BlockCard } from "./BlockCard";
import { EditorEmptyState } from "./EditorEmptyState";
import type { ProfileBlock, BlockConfig } from "@/types/blocks";

export interface BlockListProps {
  blocks: ProfileBlock[];
  onSaveBlock: (blockId: string, updatedConfig: BlockConfig) => Promise<void>;
  onToggleVisibility: (block: ProfileBlock) => void;
  onDuplicateBlock: (block: ProfileBlock) => void;
  onReorderBlocks: (newBlocks: ProfileBlock[]) => void;
  onDeleteBlock: (block: ProfileBlock) => void;
  isSaving: boolean;
}

export function BlockList({
  blocks,
  onSaveBlock,
  onToggleVisibility,
  onDuplicateBlock,
  onReorderBlocks,
  onDeleteBlock,
  isSaving,
}: BlockListProps) {
  const [editingBlockId, setEditingBlockId] = React.useState<string | null>(null);

  const handleToggleEdit = (blockId: string) => {
    setEditingBlockId((prev) => (prev === blockId ? null : blockId));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index - 1];
    if (temp && newBlocks[index]) {
      newBlocks[index - 1] = newBlocks[index]!;
      newBlocks[index] = temp;
      onReorderBlocks(newBlocks);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index + 1];
    if (temp && newBlocks[index]) {
      newBlocks[index + 1] = newBlocks[index]!;
      newBlocks[index] = temp;
      onReorderBlocks(newBlocks);
    }
  };

  if (blocks.length === 0) {
    return <EditorEmptyState />;
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          Page Blocks ({blocks.length})
        </span>
        <span className="text-[11px] font-bold text-muted-foreground">
          Drag or click arrows to reorder
        </span>
      </div>

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <BlockCard
            key={block.id}
            block={block}
            index={index}
            totalBlocks={blocks.length}
            isEditing={editingBlockId === block.id}
            onToggleEdit={handleToggleEdit}
            onSaveBlock={onSaveBlock}
            onToggleVisibility={onToggleVisibility}
            onDuplicateBlock={onDuplicateBlock}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDeleteBlock={onDeleteBlock}
            isSaving={isSaving}
          />
        ))}
      </div>
    </div>
  );
}
