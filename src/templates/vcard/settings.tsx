"use client";

import * as React from "react";
import type { TemplateSettingsProps } from "../types";
import { ThemePicker } from "@/components/appearance/ThemePicker";
import { TypographyPicker } from "@/components/appearance/TypographyPicker";
import { ButtonStylePicker } from "@/components/appearance/ButtonStylePicker";
import { VCardSettingsPicker } from "@/components/appearance/VCardSettingsPicker";
import type { FontFamily, ButtonRadius } from "@/types/profile";

export function VCardSettings({
  profile,
  themeTokens,
  onChangeTheme,
  onUpdateProfile,
}: TemplateSettingsProps) {
  return (
    <div className="space-y-6">
      {/* ── 1. Color Palette & Themes ── */}
      <ThemePicker
        themeTokens={themeTokens}
        stepNumber={1}
        onChangeTheme={(updated) => onChangeTheme(updated)}
      />

      {/* ── 2. Typography & Fonts ── */}
      <TypographyPicker
        selectedFont={themeTokens.font_family}
        stepNumber={2}
        onSelectFont={(font: FontFamily) => onChangeTheme({ font_family: font })}
      />

      {/* ── 3. Button Shapes & Roundness ── */}
      <ButtonStylePicker
        selectedRadius={themeTokens.button_radius}
        stepNumber={3}
        onChangeRadius={(radius: ButtonRadius) =>
          onChangeTheme({ button_radius: radius })
        }
      />

      {/* ── 4. Business Card Settings (VCard specific) ── */}
      <VCardSettingsPicker
        profile={profile}
        themeTokens={themeTokens}
        stepNumber={4}
        defaultOpen={true}
        onChangeTheme={onChangeTheme}
        onUpdateProfile={onUpdateProfile}
      />
    </div>
  );
}
