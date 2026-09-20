"use client";

import * as React from "react";
import { Search, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  BLOCK_DEFINITIONS,
  BLOCK_CATEGORIES,
} from "@/lib/blocks/registry";
import { BlockTypeCard } from "./BlockTypeCard";
import type { BlockType, BlockCategory } from "@/types/blocks";
import { cn } from "@/lib/utils";

export interface AddBlockSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: BlockType) => void;
}

export function AddBlockSheet({
  isOpen,
  onClose,
  onSelectType,
}: AddBlockSheetProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<BlockCategory | "ALL">("ALL");

  if (!isOpen) return null;

  const allBlocks = Object.values(BLOCK_DEFINITIONS);

  const filteredBlocks = allBlocks.filter((block) => {
    const matchesCategory =
      selectedCategory === "ALL" || block.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-[36px] bg-card border border-border/80 p-6 sm:p-8 shadow-float flex flex-col space-y-5 animate-in zoom-in-95 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xl text-foreground">
                Add Content Block
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-[11px] font-extrabold">
                <Sparkles className="w-3 h-3 text-brand-600" />
                <span>18 Types</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Choose a building block to showcase on your Digicardo page
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <Input
            type="text"
            placeholder="Search blocks (link, video, spotify, form, booking, faq...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-2xl bg-muted/30"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap select-none",
              selectedCategory === "ALL"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All Blocks ({allBlocks.length})
          </button>
          {BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap select-none",
                selectedCategory === cat.id
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blocks Grid (Scrollable) */}
        <div className="overflow-y-auto no-scrollbar flex-1 pr-1">
          {filteredBlocks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredBlocks.map((block) => (
                <BlockTypeCard
                  key={block.type}
                  metadata={block}
                  onSelect={(type) => {
                    onSelectType(type);
                    onClose();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-bold text-foreground">
                No blocks match &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Try searching for &ldquo;link&rdquo;, &ldquo;form&rdquo;, or &ldquo;video&rdquo;.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
