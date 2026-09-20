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

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  default_theme: ThemeTokens;
  Component: React.ComponentType<TemplateProps>;
}
