import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { blocksApi } from "@/lib/api/blocks";
import { ApiConflictError, ApiValidationError } from "@/lib/api/errors";
import type { ProfileBlock } from "@/types/blocks";

describe("Frontend Blocks API Client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches blocks successfully for owner", async () => {
    const mockBlocks: ProfileBlock[] = [
      {
        id: "01HZMD5R4GKJA7TFP4QYX8VBJN",
        profile_id: "01HZMD5R4GKJA7TFP4QYX8USER",
        type: "link",
        sort_order: 0,
        config: { title: "My Portfolio", url: "https://portfolio.com" },
        is_visible: true,
        version: 1,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: mockBlocks,
      }),
    } as unknown as Response);

    const result = await blocksApi.getBlocks();
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("link");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/profile/blocks"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("creates a new block successfully", async () => {
    const createdBlock: ProfileBlock = {
      id: "01HZMD5R4GKJA7TFP4QYX8VBJN",
      profile_id: "01HZMD5R4GKJA7TFP4QYX8USER",
      type: "heading",
      sort_order: 1,
      config: { text: "Section 1", level: "h2" },
      is_visible: true,
      version: 1,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: createdBlock,
      }),
    } as unknown as Response);

    const result = await blocksApi.createBlock({
      type: "heading",
      config: { text: "Section 1", level: "h2" },
    });

    expect(result.id).toBe("01HZMD5R4GKJA7TFP4QYX8VBJN");
    expect(result.type).toBe("heading");
  });

  it("handles 409 conflict during block update", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: {
          code: "CONFLICT",
          message: "Block was updated by another request. Please reload.",
        },
      }),
    } as unknown as Response);

    await expect(
      blocksApi.updateBlock("01HZMD5R4GKJA7TFP4QYX8VBJN", {
        version: 1,
        is_visible: false,
      })
    ).rejects.toThrow(ApiConflictError);
  });

  it("handles validation errors when reordering with invalid payload", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Duplicate block IDs are not permitted.",
        },
      }),
    } as unknown as Response);

    await expect(
      blocksApi.reorderBlocks({
        ordered_ids: ["01HZMD5R4GKJA7TFP4QYX8VBJN", "01HZMD5R4GKJA7TFP4QYX8VBJN"],
        version: 1,
      })
    ).rejects.toThrow(ApiValidationError);
  });

  it("handles successful transactional block reordering", async () => {
    const reorderedBlocks: ProfileBlock[] = [
      {
        id: "01HZMD5R4GKJA7TFP4QYX8VB02",
        profile_id: "01HZMD5R4GKJA7TFP4QYX8USER",
        type: "heading",
        sort_order: 0,
        config: { text: "Second" },
        is_visible: true,
        version: 1,
      },
      {
        id: "01HZMD5R4GKJA7TFP4QYX8VB01",
        profile_id: "01HZMD5R4GKJA7TFP4QYX8USER",
        type: "link",
        sort_order: 1,
        config: { title: "First", url: "https://first.com" },
        is_visible: true,
        version: 1,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: reorderedBlocks,
        meta: { version: 5 },
      }),
    } as unknown as Response);

    const result = await blocksApi.reorderBlocks({
      ordered_ids: ["01HZMD5R4GKJA7TFP4QYX8VB02", "01HZMD5R4GKJA7TFP4QYX8VB01"],
      version: 4,
    });

    expect(result.version).toBe(5);
    expect(result.blocks[0].id).toBe("01HZMD5R4GKJA7TFP4QYX8VB02");
    expect(result.blocks[0].sort_order).toBe(0);
  });
});
