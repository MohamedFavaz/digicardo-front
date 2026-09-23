import type React from "react";
import type { ThemeTokens, Profile, PublicProfile } from "@/types/profile";
import type { ProfileBlock, PublicProfileBlock } from "@/types/blocks";

export type TemplateCategory =
  | "Minimal"
  | "Modern"
  | "Creative"
  | "Social"
  | "Corporate"
  | "Editorial"
  | "Business";

export interface TemplateProps {
  profile: Profile | PublicProfile;
  blocks: (ProfileBlock | PublicProfileBlock)[];
  theme: ThemeTokens;
}

export interface TemplateSettingsProps {
  profile: Profile | null;
  themeTokens: ThemeTokens;
  onChangeTheme: (updated: Partial<ThemeTokens>) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  onUpdateProfile?: (updated: Partial<Profile>) => void;
}

export type TemplateSupportedSection =
  | "profile"
  | "socials"
  | "quickActions"
  | "links"
  | "pdf"
  | "drive"
  | "background"
  | "palette"
  | "qr"
  | "vcard"
  | "share";

export interface TemplateSupportedBackground {
  id: string;
  name: string;
  icon?: string;
  label?: string;
}

export interface TemplateSupportedColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent?: string;
  background?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  preview?: string;
  default_theme: ThemeTokens;
  Component: React.ComponentType<TemplateProps>;
  SettingsComponent?: React.ComponentType<TemplateSettingsProps>;
  supportedSections?: TemplateSupportedSection[];
  supportedBackgrounds?: TemplateSupportedBackground[];
  supportedColorPalettes?: TemplateSupportedColorPalette[];
}
