import { describe, it, expect } from "vitest";
import {
  LinkBlockConfigSchema,
  HeadingBlockConfigSchema,
  TextBlockConfigSchema,
  DividerBlockConfigSchema,
  SocialBlockConfigSchema,
  CreateBlockSchema,
  BlockReorderSchema,
} from "@/lib/validation/blocks";

describe("Blocks & Reorder Validation", () => {
  it("validates LinkBlockConfig url and title", () => {
    const valid = {
      title: "My Blog",
      url: "https://example.com",
      icon: "bookmark",
    };
    const result = LinkBlockConfigSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects invalid URL in LinkBlockConfig", () => {
    const invalidCases = [
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///etc/passwd",
      "not-a-valid-url",
      "ftp://example.com",
    ];

    invalidCases.forEach((url) => {
      const result = LinkBlockConfigSchema.safeParse({ title: "Bad URL", url });
      expect(result.success).toBe(false);
    });
  });

  it("validates HeadingBlockConfig", () => {
    const valid = HeadingBlockConfigSchema.safeParse({
      text: "Featured Projects",
      level: "h2",
    });
    expect(valid.success).toBe(true);

    const invalid = HeadingBlockConfigSchema.safeParse({
      text: "", // missing
    });
    expect(invalid.success).toBe(false);
  });

  it("validates TextBlockConfig", () => {
    const valid = TextBlockConfigSchema.safeParse({
      content: "Hello from my link in bio page.",
      align: "center",
    });
    expect(valid.success).toBe(true);
  });

  it("validates DividerBlockConfig", () => {
    const valid = DividerBlockConfigSchema.safeParse({
      style: "dots",
    });
    expect(valid.success).toBe(true);
  });

  it("validates SocialBlockConfig with allowed platforms", () => {
    const valid = SocialBlockConfigSchema.safeParse({
      platform: "github",
      url: "https://github.com/myuser",
    });
    expect(valid.success).toBe(true);

    const invalidPlatform = SocialBlockConfigSchema.safeParse({
      platform: "unknown_platform",
      url: "https://example.com",
    });
    expect(invalidPlatform.success).toBe(false);
  });

  it("validates CreateBlockSchema discriminated union", () => {
    const linkBlock = CreateBlockSchema.safeParse({
      type: "link",
      config: {
        title: "Test Link",
        url: "https://test.com",
      },
      is_visible: true,
    });
    expect(linkBlock.success).toBe(true);

    const invalidType = CreateBlockSchema.safeParse({
      type: "unsupported_block",
      config: {},
    });
    expect(invalidType.success).toBe(false);
  });

  it("validates correct block reorder payload with distinct ULIDs and version", () => {
    const payload = {
      version: 2,
      ordered_ids: [
        "01HZMD5R4GKJA7TFP4QYX8VBJN",
        "01HZMD5R4GKJA7TFP4QYX8VBJM",
        "01HZMD5R4GKJA7TFP4QYX8VBJK",
      ],
    };
    const result = BlockReorderSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("rejects duplicate IDs in block reorder payload", () => {
    const payload = {
      version: 2,
      ordered_ids: [
        "01HZMD5R4GKJA7TFP4QYX8VBJN",
        "01HZMD5R4GKJA7TFP4QYX8VBJN",
      ],
    };
    const result = BlockReorderSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
