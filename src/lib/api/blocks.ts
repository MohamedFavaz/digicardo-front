/**
 * Block API Client (BFF Proxy Communicator)
 * Communicates with Next.js BFF at /api/bff/v1/profile/blocks/*
 */

import { apiClient } from "./client";
import type {
  ProfileBlock,
  CreateBlockInput,
  UpdateBlockInput,
  BlockReorderInput,
} from "@/types/blocks";

export const blocksApi = {
  /**
   * Retrieve all blocks for the authenticated user's profile.
   */
  async getBlocks(): Promise<ProfileBlock[]> {
    return apiClient.get<ProfileBlock[]>("/profile/blocks");
  },

  /**
   * Create a new content block.
   */
  async createBlock(input: CreateBlockInput): Promise<ProfileBlock> {
    return apiClient.post<ProfileBlock>("/profile/blocks", input);
  },

  /**
   * Update an existing content block with optimistic concurrency version.
   */
  async updateBlock(
    blockId: string,
    input: UpdateBlockInput
  ): Promise<ProfileBlock> {
    return apiClient.patch<ProfileBlock>(`/profile/blocks/${blockId}`, input);
  },

  /**
   * Delete a content block.
   */
  async deleteBlock(blockId: string): Promise<void> {
    return apiClient.delete<void>(`/profile/blocks/${blockId}`);
  },

  /**
   * Reorder content blocks transactionally.
   */
  async reorderBlocks(
    payload: BlockReorderInput
  ): Promise<{ blocks: ProfileBlock[]; version: number }> {
    const blocks = await apiClient.post<ProfileBlock[]>("/profile/blocks/reorder", payload);
    return {
      blocks,
      version: payload.version + 1,
    };
  },
};
