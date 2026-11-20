import { apiClient } from "./client";
import type {
  Profile,
  PublicProfile,
  CreateProfileInput,
  UpdateProfileInput,
  ThemeTokens,
} from "@/types/profile";
import type { TemplateDefinition } from "@/templates/types";
import type { ProfileBlock } from "@/types/blocks";
import type { CardContent, UpdateContentRequest } from "@/lib/zod/content";
import type { TemplateManifest } from "@/templates/manifests";

/** GET /profile/editor — everything the card editor needs (ADR-030). */
export interface EditorData {
  profile: Profile;
  content: CardContent;
  content_stored: boolean;
  template_id: string;
  theme_tokens: ThemeTokens | null;
  blocks: ProfileBlock[];
  templates: TemplateManifest[];
  version: number;
}

export interface AppearanceData {
  template_id: string;
  theme_tokens: ThemeTokens | null;
  version: number;
}

export interface UpdateAppearanceInput {
  template_id: string;
  version: number;
  theme_tokens?: ThemeTokens | null;
}

export const profileApi = {
  /**
   * Retrieve the authenticated user's profile.
   */
  getProfile: async (): Promise<Profile> => {
    return apiClient.get<Profile>("/profile");
  },

  /**
   * Create a new profile for the authenticated user.
   */
  createProfile: async (data: CreateProfileInput): Promise<Profile> => {
    return apiClient.post<Profile>("/profile", data);
  },

  /**
   * Update the authenticated user's profile.
   */
  updateProfile: async (data: UpdateProfileInput): Promise<Profile> => {
    return apiClient.patch<Profile>("/profile", data);
  },

  /**
   * Retrieve current appearance settings (template & theme tokens).
   */
  getAppearance: async (): Promise<AppearanceData> => {
    return apiClient.get<AppearanceData>("/profile/appearance");
  },

  /**
   * Update profile appearance (template selection and theme customization).
   */
  updateAppearance: async (data: UpdateAppearanceInput): Promise<Profile> => {
    return apiClient.put<Profile>("/profile/appearance", data);
  },

  /**
   * Retrieve catalog of approved templates.
   */
  getTemplates: async (): Promise<TemplateDefinition[]> => {
    return apiClient.get<TemplateDefinition[]>("/templates");
  },

  /** Load the card editor in one call. */
  getEditor: async (): Promise<EditorData> => {
    return apiClient.get<EditorData>("/profile/editor");
  },

  /** Replace the given parts of the card content (optimistic locking via `version`). */
  updateContent: async (data: UpdateContentRequest): Promise<{ content: CardContent; version: number }> => {
    return apiClient.patch<{ content: CardContent; version: number }>("/profile/content", data);
  },

  /**
   * Retrieve public profile data by username.
   */
  getPublicProfile: async (username: string): Promise<PublicProfile & { theme_tokens?: ThemeTokens | null }> => {
    return apiClient.get<PublicProfile & { theme_tokens?: ThemeTokens | null }>(`/p/${encodeURIComponent(username)}`);
  },
};
