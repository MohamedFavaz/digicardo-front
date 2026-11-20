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

/**
 * "public": the live card at /[username] — tracks analytics.
 * "preview": rendered inside the dashboard (editor, onboarding, home) — never tracks,
 * never fetches, so owners don't inflate their own numbers.
 */
export type TemplateRenderMode = "public" | "preview";

export interface TemplateProps {
  profile: Profile | PublicProfile;
  blocks: (ProfileBlock | PublicProfileBlock)[];
  theme: ThemeTokens;
  mode?: TemplateRenderMode;
  /** Branding / report links, rendered by the template at the bottom of its own background. */
  footer?: React.ReactNode;
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
  supportedSections?: TemplateSupportedSection[];
  supportedBackgrounds?: TemplateSupportedBackground[];
  supportedColorPalettes?: TemplateSupportedColorPalette[];
}
