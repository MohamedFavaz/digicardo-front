import { describe, it, expect } from "vitest";
import React from "react";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import type { PublicProfile } from "@/types/profile";
import type { PublicProfileBlock } from "@/types/blocks";

describe("ProfileRenderer Component", () => {
  const sampleProfile: PublicProfile = {
    username: "johndoe",
    display_name: "John Doe",
    bio: "Software Engineer & Creator",
    avatar_url: "https://example.com/avatar.jpg",
    template_id: "vcard",
    seo_title: "John Doe Portfolio",
    seo_description: "Welcome to my portfolio",
  };

  const sampleBlocks: PublicProfileBlock[] = [
    {
      id: "01HZMD5R4GKJA7TFP4QYX8VB01",
      type: "heading",
      sort_order: 0,
      config: { text: "Connect With Me", level: "h2" },
    },
    {
      id: "01HZMD5R4GKJA7TFP4QYX8VB02",
      type: "link",
      sort_order: 1,
      config: { title: "My Website", url: "https://johndoe.com" },
    },
  ];

  it("renders with vcard template", () => {
    const element = ProfileRenderer({
      profile: sampleProfile,
      blocks: sampleBlocks,
      templateId: "vcard",
    });

    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("safely falls back to default template for unknown template ID", () => {
    const element = ProfileRenderer({
      profile: sampleProfile,
      blocks: sampleBlocks,
      templateId: "some-nonexistent-template-id",
    });

    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });

  it("merges custom theme tokens without throwing errors", () => {
    const element = ProfileRenderer({
      profile: sampleProfile,
      blocks: sampleBlocks,
      templateId: "vcard",
      themeTokens: {
        color_background: "#000000",
        color_accent: "#ff007f",
      },
    });

    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
  });
});
