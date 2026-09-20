import { describe, it, expect } from "vitest";
import { ThemeTokensSchema } from "@/lib/validation/theme";

describe("Theme Tokens Zod Validation (CSS Injection Prevention)", () => {
  it("accepts valid ThemeTokens with hex colors and allowlisted tokens", () => {
    const validTokens = {
      color_background: "#0a0a0a",
      color_surface: "#1f1f1f",
      color_text_primary: "#ffffff",
      color_text_secondary: "#a0a0a0",
      color_accent: "#6366f1",
      font_family: "inter",
      button_radius: "medium",
      button_style: "solid",
      animation: "fade",
    };

    const result = ThemeTokensSchema.safeParse(validTokens);
    expect(result.success).toBe(true);
  });

  it("rejects arbitrary CSS injection in color fields", () => {
    const maliciousTokens = {
      color_background: "#ffffff; } body { display:none }",
      color_surface: "#1f1f1f",
      color_text_primary: "#ffffff",
      color_text_secondary: "#a0a0a0",
      color_accent: "#6366f1",
      font_family: "inter",
      button_radius: "medium",
      button_style: "solid",
      animation: "fade",
    };

    const result = ThemeTokensSchema.safeParse(maliciousTokens);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path).toContain("color_background");
    }
  });

  it("rejects non-allowlisted font family injection", () => {
    const maliciousTokens = {
      color_background: "#ffffff",
      color_surface: "#1f1f1f",
      color_text_primary: "#ffffff",
      color_text_secondary: "#a0a0a0",
      color_accent: "#6366f1",
      font_family: "evil-font; background: url(https://attacker.com)",
      button_radius: "medium",
      button_style: "solid",
      animation: "fade",
    };

    const result = ThemeTokensSchema.safeParse(maliciousTokens);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path).toContain("font_family");
    }
  });

  it("rejects arbitrary CSS in radius token", () => {
    const invalidTokens = {
      color_background: "#ffffff",
      color_surface: "#1f1f1f",
      color_text_primary: "#ffffff",
      color_text_secondary: "#a0a0a0",
      color_accent: "#6366f1",
      font_family: "inter",
      button_radius: "50px", // must be enum token
      button_style: "solid",
      animation: "fade",
    };

    const result = ThemeTokensSchema.safeParse(invalidTokens);
    expect(result.success).toBe(false);
  });
});
