import { apiClient } from "./client";
import { ProfileSeoData, UpdateProfileSeoRequest } from "@/types/seo";

export const seoApi = {
  /**
   * Retrieve authenticated user's profile SEO and Open Graph settings.
   */
  async get(): Promise<ProfileSeoData> {
    return apiClient.get<ProfileSeoData>("/profile/seo");
  },

  /**
   * Update authenticated user's profile SEO and Open Graph settings.
   */
  async update(data: UpdateProfileSeoRequest): Promise<ProfileSeoData> {
    return apiClient.patch<ProfileSeoData>("/profile/seo", data);
  },
};
