import { describe, it, expect } from "vitest";
import React from "react";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { PublicProfileBlock, BlockType } from "@/types/blocks";

describe("BlockRenderer Component", () => {
  it("renders link block safely", () => {
    const block: PublicProfileBlock = {
      id: "01HZMD5R4GKJA7TFP4QYX8VB01",
      type: "link",
      sort_order: 0,
      config: { title: "Portfolio", url: "https://portfolio.com" },
    };

    const element = BlockRenderer({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("renders heading block safely", () => {
    const block: PublicProfileBlock = {
      id: "01HZMD5R4GKJA7TFP4QYX8VB02",
      type: "heading",
      sort_order: 1,
      config: { text: "My Links", level: "h2" },
    };

    const element = BlockRenderer({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("renders text block safely", () => {
    const block: PublicProfileBlock = {
      id: "01HZMD5R4GKJA7TFP4QYX8VB03",
      type: "text",
      sort_order: 2,
      config: { content: "Welcome!", align: "center" },
    };

    const element = BlockRenderer({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("renders divider block safely", () => {
    const block: PublicProfileBlock = {
      id: "01HZMD5R4GKJA7TFP4QYX8VB04",
      type: "divider",
      sort_order: 3,
      config: { style: "line" },
    };

    const element = BlockRenderer({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("renders social block safely", () => {
    const block: PublicProfileBlock = {
      id: "01HZMD5R4GKJA7TFP4QYX8VB05",
      type: "social",
      sort_order: 4,
      config: { platform: "github", url: "https://github.com/test" },
    };

    const element = BlockRenderer({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("fails safely and returns null for unknown block type", () => {
    const block = {
      id: "01HZMD5R4GKJA7TFP4QYX8VB99",
      type: "unknown_custom_embed" as BlockType,
      sort_order: 5,
      config: {},
    };

    const element = BlockRenderer({ block });
    expect(element).toBeNull();
  });
});
