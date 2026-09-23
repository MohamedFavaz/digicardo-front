import { apiClient } from "./client";
import type { MediaItem } from "@/types/media";

export const mediaApi = {
  /**
   * Upload user profile avatar.
   */
  uploadAvatar: async (file: File): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post<MediaItem>("/profile/avatar", formData);
  },

  /**
   * Remove user profile avatar.
   */
  deleteAvatar: async (): Promise<void> => {
    return apiClient.delete<void>("/profile/avatar");
  },

  /**
   * Upload user profile cover image.
   */
  uploadCover: async (file: File): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post<MediaItem>("/profile/cover", formData);
  },

  /**
   * Remove user profile cover image.
   */
  deleteCover: async (): Promise<void> => {
    return apiClient.delete<void>("/profile/cover");
  },

  /**
   * Upload generic image for content blocks.
   */
  uploadImage: async (file: File, altText?: string): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append("image", file);
    if (altText) {
      formData.append("alt_text", altText);
    }
    return apiClient.post<MediaItem>("/media/images", formData);
  },

  /**
   * Upload PDF document (brochure, catalog, profile).
   */
  uploadDocument: async (file: File, title?: string): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append("document", file);
    if (title) {
      formData.append("title", title);
    }
    return apiClient.post<MediaItem>("/media/documents", formData);
  },

  /**
   * Delete an unreferenced media item.
   */
  deleteMedia: async (mediaId: string): Promise<void> => {
    return apiClient.delete<void>(`/media/${encodeURIComponent(mediaId)}`);
  },

  /**
   * List all uploaded media items for the user's profile.
   */
  getMedia: async (): Promise<MediaItem[]> => {
    return apiClient.get<MediaItem[]>("/media");
  },
};
