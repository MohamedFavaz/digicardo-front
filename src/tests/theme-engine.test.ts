import { describe, it, expect } from "vitest";
import { getThemeVariables } from "@/lib/theme/applyTheme";
import type { ThemeTokens } from "@/types/profile";

describe("Theme Engine & Safe CSS Variable Application", () => {
  const validTokens: ThemeTokens = {
    color_background: "#090d16",
    color_surface: "#1e293b",
    color_text_primary: "#f8fafc",
    color_text_secondary: "#94a3b8",
    color_accent: "#38bdf8",
    font_family: "outfit",
    button_radius: "large",
    button_style: "glass",
    animation: "fade",
  };

  it("converts valid theme tokens to CSS custom properties", () => {
    const cssVars = getThemeVariables(validTokens) as Record<string, string>;

    expect(cssVars["--lf-bg"]).toBe("#090d16");
    expect(cssVars["--lf-surface"]).toBe("#1e293b");
    expect(cssVars["--lf-text-primary"]).toBe("#f8fafc");
    expect(cssVars["--lf-text-secondary"]).toBe("#94a3b8");
    expect(cssVars["--lf-accent"]).toBe("#38bdf8");
    expect(cssVars["--lf-font"]).toContain("Outfit");
    expect(cssVars["--lf-radius"]).toBe("1rem");
    expect(cssVars["--lf-button-style"]).toBe("glass");
    expect(cssVars["--lf-animation"]).toBe("fade");
  });

  it("sanitizes CSS injection payloads to safe default colors", () => {
    const maliciousTokens = {
      ...validTokens,
      color_background: "#000; background: url(http://malicious.com);",
      color_accent: "expression(alert(1))",
    };

    const cssVars = getThemeVariables(maliciousTokens) as Record<string, string>;

    // Malicious strings must NOT be passed through
    expect(cssVars["--lf-bg"]).toBe("#ffffff"); // fallback
    expect(cssVars["--lf-accent"]).toBe("#6366f1"); // fallback
  });

  it("maps button radius tokens to exact CSS values", () => {
    expect((getThemeVariables({ ...validTokens, button_radius: "none" }) as Record<string, string>)["--lf-radius"]).toBe("0px");
    expect((getThemeVariables({ ...validTokens, button_radius: "small" }) as Record<string, string>)["--lf-radius"]).toBe("0.375rem");
    expect((getThemeVariables({ ...validTokens, button_radius: "medium" }) as Record<string, string>)["--lf-radius"]).toBe("0.75rem");
    expect((getThemeVariables({ ...validTokens, button_radius: "large" }) as Record<string, string>)["--lf-radius"]).toBe("1rem");
    expect((getThemeVariables({ ...validTokens, button_radius: "pill" }) as Record<string, string>)["--lf-radius"]).toBe("9999px");
  });

  it("maps allowlisted fonts to system/font fallback stacks", () => {
    const interVars = getThemeVariables({ ...validTokens, font_family: "inter" }) as Record<string, string>;
    expect(interVars["--lf-font"]).toContain("Inter");

    const poppinsVars = getThemeVariables({ ...validTokens, font_family: "poppins" }) as Record<string, string>;
    expect(poppinsVars["--lf-font"]).toContain("Poppins");

    const playfairVars = getThemeVariables({ ...validTokens, font_family: "playfair-display" }) as Record<string, string>;
    expect(playfairVars["--lf-font"]).toContain("Playfair Display");
  });
});
