"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ProfileBlock } from "@/types/blocks";

export interface BlockDeleteDialogProps {
  block: ProfileBlock | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function BlockDeleteDialog({
  block,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: BlockDeleteDialogProps) {
  if (!isOpen || !block) return null;

  const title =
    (block.config as Record<string, unknown>)?.title ||
    (block.config as Record<string, unknown>)?.label ||
    (block.config as Record<string, unknown>)?.text ||
    block.type;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-md rounded-[32px] bg-card border border-border/80 p-6 sm:p-7 shadow-float space-y-5 animate-in zoom-in-95">
        
        {/* Header with Danger Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-50 border border-coral/20 text-coral flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="font-black text-lg text-foreground">
              Delete this block?
            </h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              This will permanently remove <strong className="text-foreground">{String(title)}</strong> from your public profile.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full font-bold text-xs px-4"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="pill"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-coral hover:bg-rose-600 text-white font-extrabold text-xs px-5 shadow-xs gap-1.5"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Block</span>
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
