"use client";

import * as React from "react";
import { CARD_CATEGORIES, type CardCategoryType, type CardCategoryOption } from "@/types/cards";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  User,
  Palette,
  Utensils,
  Laptop,
  Building2,
  Sparkles,
  Stethoscope,
  Home,
  GraduationCap,
  Heart,
  Calendar,
  Check,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  User,
  Palette,
  Utensils,
  Laptop,
  Building2,
  Sparkles,
  Stethoscope,
  Home,
  GraduationCap,
  Heart,
  Calendar,
};

export interface CategoryPickerProps {
  selectedCategory: CardCategoryType | null;
  onSelectCategory: (category: CardCategoryOption) => void;
}

export function CategoryPicker({
  selectedCategory,
  onSelectCategory,
}: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 select-none">
      {CARD_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        const IconComponent = ICON_MAP[category.iconName] || Briefcase;

        return (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "group relative flex flex-col p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left",
              isSelected
                ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2"
                : "bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-2xs"
            )}
          >
            {/* Top row: Icon + checkmark if selected */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-2xs",
                  isSelected
                    ? "bg-white/15 text-white"
                    : "bg-slate-100 text-slate-800 group-hover:bg-slate-200/80"
                )}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Label and description */}
            <div className="space-y-1">
              <h4
                className={cn(
                  "text-sm font-bold truncate",
                  isSelected ? "text-white" : "text-slate-900 group-hover:text-black"
                )}
              >
                {category.label}
              </h4>
              <p
                className={cn(
                  "text-xs line-clamp-2 leading-relaxed",
                  isSelected ? "text-slate-300" : "text-slate-500"
                )}
              >
                {category.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
