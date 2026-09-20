"use client";

import * as React from "react";
import type { TemplateDefinition } from "@/templates/types";
import { cn } from "@/lib/utils";

export interface TemplateCardProps {
  template: TemplateDefinition;
  isSelected: boolean;
  isGated?: boolean;
  onSelect: (templateId: string) => void;
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
}: TemplateCardProps) {
  const imageUrl =
    template.id === "vcard"
      ? "/vcard-preview.png"
      : `/api/template-preview/${template.id}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      className={cn(
        "group relative w-full text-left rounded-3xl border transition-all duration-300 shadow-card select-none overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-card hover:shadow-lg",
        isSelected
          ? "border-brand-500 ring-2 ring-brand-500/30"
          : "border-border/80 hover:border-brand-300"
      )}
    >
      <img
        src={imageUrl}
        alt={`${template.name} Preview`}
        className="w-full max-w-sm max-h-[520px] object-contain rounded-2xl border border-border/40 shadow-inner group-hover:scale-[1.01] transition-transform duration-300"
        loading="eager"
      />
    </button>
  );
}

