"use client";

import * as React from "react";
import {
  GripVertical,
  ChevronUp,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { BLOCK_DEFINITIONS } from "@/lib/blocks/registry";
import { BlockEditor } from "./BlockEditor";
import type { ProfileBlock, BlockConfig } from "@/types/blocks";
import { cn } from "@/lib/utils";

export interface BlockCardProps {
  block: ProfileBlock;
  index: number;
  totalBlocks: number;
  isEditing: boolean;
  onToggleEdit: (blockId: string) => void;
  onSaveBlock: (blockId: string, updatedConfig: BlockConfig) => Promise<void>;
  onToggleVisibility: (block: ProfileBlock) => void;
  onDuplicateBlock: (block: ProfileBlock) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDeleteBlock: (block: ProfileBlock) => void;
  isSaving: boolean;
}

export function BlockCard({
  block,
  index,
  totalBlocks,
  isEditing,
  onToggleEdit,
  onSaveBlock,
  onToggleVisibility,
  onDuplicateBlock,
  onMoveUp,
  onMoveDown,
  onDeleteBlock,
  isSaving,
}: BlockCardProps) {
  const meta = BLOCK_DEFINITIONS[block.type];
  const Icon = meta?.icon || Sparkles;

  const title =
    (block.config as Record<string, unknown>)?.title ||
    (block.config as Record<string, unknown>)?.label ||
    (block.config as Record<string, unknown>)?.text ||
    meta?.label ||
    block.type;

  const subtitle =
    (block.config as Record<string, unknown>)?.url ||
    (block.config as Record<string, unknown>)?.description ||
    (block.config as Record<string, unknown>)?.email ||
    (block.config as Record<string, unknown>)?.phone ||
    meta?.description ||
    "";

  return (
    <div
      className={cn(
        "rounded-[28px] border transition-all duration-200 shadow-card overflow-hidden",
        isEditing
          ? "bg-card border-brand-400 ring-2 ring-brand-500/20"
          : block.is_visible
          ? "bg-card border-border/80 hover:border-brand-300"
          : "bg-card/70 border-border/60 opacity-65"
      )}
    >
      {/* ── Card Header Row ── */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 select-none">
        
        {/* Left Side: Grip + Icon + Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Reorder Buttons / Grip */}
          <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
            <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground/60 hidden sm:block" />
            <div className="flex flex-col gap-0.5 sm:hidden">
              <button
                onClick={() => onMoveUp(index)}
                disabled={index === 0}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
                title="Move up"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => onMoveDown(index)}
                disabled={index === totalBlocks - 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
                title="Move down"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Block Type Icon */}
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Icon className="w-5 h-5" />
          </div>

          {/* Title & Preview Subtitle */}
          <div className="min-w-0 cursor-pointer flex-1" onClick={() => onToggleEdit(block.id)}>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-foreground truncate">
                {String(title)}
              </span>
              {!block.is_visible && (
                <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                  Hidden
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
                {String(subtitle)}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Move Up/Down (Desktop) */}
          <div className="hidden sm:flex items-center gap-0.5 text-muted-foreground mr-1">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1.5 rounded-xl hover:bg-muted hover:text-foreground disabled:opacity-25 transition-colors"
              title="Move block up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalBlocks - 1}
              className="p-1.5 rounded-xl hover:bg-muted hover:text-foreground disabled:opacity-25 transition-colors"
              title="Move block down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visibility Toggle */}
          <button
            onClick={() => onToggleVisibility(block)}
            className={cn(
              "p-2 rounded-xl border transition-colors shadow-2xs",
              block.is_visible
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
                : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
            )}
            title={block.is_visible ? "Block is visible (click to hide)" : "Block is hidden (click to show)"}
          >
            {block.is_visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Duplicate Block */}
          <button
            onClick={() => onDuplicateBlock(block)}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-2xs hidden sm:block"
            title="Duplicate block"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete Block */}
          <button
            onClick={() => onDeleteBlock(block)}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-rose-50 text-muted-foreground hover:text-coral hover:border-coral/30 transition-colors shadow-2xs"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Expand/Collapse Edit */}
          <button
            onClick={() => onToggleEdit(block.id)}
            className={cn(
              "p-2 rounded-xl border transition-colors shadow-2xs ml-0.5",
              isEditing
                ? "bg-brand-600 text-white border-brand-600"
                : "border-border/80 bg-card hover:bg-muted text-foreground"
            )}
            title={isEditing ? "Collapse editor" : "Edit block"}
          >
            {isEditing ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <Edit2 className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>

      {/* ── Expandable Inline Editor ── */}
      {isEditing && (
        <div className="p-4 sm:p-5 pt-0 border-t border-border/80">
          <BlockEditor
            block={block}
            onSave={async (updatedConfig) => {
              await onSaveBlock(block.id, updatedConfig);
              onToggleEdit(block.id);
            }}
            onCancel={() => onToggleEdit(block.id)}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}
