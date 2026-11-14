import { apiClient } from "./client";
import type { CardItem, CreateCardInput, UpdateCardInput, CardCategoryType } from "@/types/cards";
import type { ThemeTokens } from "@/types/profile";

export interface CardListFilters {
  category?: CardCategoryType;
  status?: "draft" | "published" | "archived";
  search?: string;
}

export const cardsApi = {
  /**
   * List all cards owned by the authenticated user.
   */
  listCards: async (filters?: CardListFilters): Promise<CardItem[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<CardItem[]>(`/cards${query}`);
  },

  /**
   * Create a new card.
   */
  createCard: async (data: CreateCardInput): Promise<CardItem> => {
    return apiClient.post<CardItem>("/cards", data);
  },

  /**
   * Retrieve a specific card with its blocks and details.
   */
  getCard: async (cardId: string): Promise<CardItem> => {
    return apiClient.get<CardItem>(`/cards/${cardId}`);
  },

  /**
   * Update a specific card.
   */
  updateCard: async (cardId: string, data: UpdateCardInput): Promise<CardItem> => {
    return apiClient.patch<CardItem>(`/cards/${cardId}`, data);
  },

  /**
   * Delete a card.
   */
  deleteCard: async (cardId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/cards/${cardId}`);
  },

  /**
   * Publish a card (set live status and generate public URL).
   */
  publishCard: async (cardId: string): Promise<CardItem> => {
    return apiClient.post<CardItem>(`/cards/${cardId}/publish`, {});
  },

  /**
   * Unpublish a card (set to draft).
   */
  unpublishCard: async (cardId: string): Promise<CardItem> => {
    return apiClient.post<CardItem>(`/cards/${cardId}/unpublish`, {});
  },

  /**
   * Duplicate an existing card and all its blocks.
   */
  duplicateCard: async (cardId: string): Promise<CardItem> => {
    return apiClient.post<CardItem>(`/cards/${cardId}/duplicate`, {});
  },

  /**
   * Set a card as the primary card.
   */
  setPrimaryCard: async (cardId: string): Promise<CardItem> => {
    return apiClient.post<CardItem>(`/cards/${cardId}/set-primary`, {});
  },
};
