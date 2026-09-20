import { describe, it, expect } from "vitest";
import React from "react";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { LinkBlock } from "@/components/blocks/LinkBlock";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { PublicProfileBlock, ImageBlockConfig, LinkBlockConfig } from "@/types/blocks";

describe("ImageBlock component", () => {
  it("renders image element safely when URL is provided", () => {
    const block: PublicProfileBlock<ImageBlockConfig> = {
      id: "01JIMAGE000000000000000001",
      type: "image",
      sort_order: 0,
      config: {
        media_id: "01JMEDIA000000000000000001",
        url: "https://example.com/photo.jpg",
        alt_text: "Sunset in Tokyo",
        caption: "A beautiful sunset view",
      },
    };

    const element = ImageBlock({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("renders link wrapper safely when link_url is provided", () => {
    const block: PublicProfileBlock<ImageBlockConfig> = {
      id: "01JIMAGE000000000000000002",
      type: "image",
      sort_order: 1,
      config: {
        media_id: "01JMEDIA000000000000000002",
        url: "https://example.com/art.jpg",
        link_url: "https://artstation.com/artist",
        open_in_new_tab: true,
      },
    };

    const element = ImageBlock({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("returns null safely if image url is missing", () => {
    const block: PublicProfileBlock<ImageBlockConfig> = {
      id: "01JIMAGE000000000000000003",
      type: "image",
      sort_order: 2,
      config: {
        media_id: "01JMEDIA000000000000000003",
      },
    };

    const element = ImageBlock({ block });
    expect(element).toBeNull();
  });
});

describe("LinkBlock with thumbnail", () => {
  it("renders safely when thumbnail_url is present", () => {
    const config: LinkBlockConfig = {
      title: "My Channel",
      url: "https://youtube.com/mychannel",
      thumbnail_url: "https://example.com/thumb.jpg",
    };

    const element = LinkBlock({ config });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });
});

describe("BlockRenderer with image block", () => {
  it("correctly renders image block through polymorphic renderer", () => {
    const block: PublicProfileBlock<ImageBlockConfig> = {
      id: "01JIMAGE000000000000000004",
      type: "image",
      sort_order: 0,
      config: {
        media_id: "01JMEDIA000000000000000004",
        url: "https://example.com/gallery.webp",
        alt_text: "Gallery Item",
      },
    };

    const element = BlockRenderer({ block });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });
});
