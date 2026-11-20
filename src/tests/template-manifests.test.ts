import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { TEMPLATE_MANIFESTS, getManifest, resolveTemplateStyle } from "@/templates/manifests";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { contrastRatio } from "@/templates/shared/palette";

const HEX = /^#[0-9A-F]{6}$/i;
const backendDir = path.resolve(__dirname, "../../../backend/resources/templates");

describe("template manifests (ADR-031)", () => {
  it.skipIf(!existsSync(backendDir))("are identical to the backend copies", () => {
    for (const id of Object.keys(TEMPLATE_MANIFESTS)) {
      const backend = JSON.parse(readFileSync(path.join(backendDir, `${id}.json`), "utf8"));
      expect(TEMPLATE_MANIFESTS[id]).toEqual(backend);
    }
  });

  it("drive the registry names and default themes", () => {
    expect(TEMPLATE_REGISTRY.vcard.name).toBe("Classic");
    expect(TEMPLATE_REGISTRY.botanical.name).toBe("Botanical");
    expect(TEMPLATE_REGISTRY.vcard.default_theme).toEqual(TEMPLATE_MANIFESTS.vcard.default_theme);
    expect(getManifest("unknown").id).toBe("vcard");
  });

  it("only contain readable hex presets", () => {
    for (const manifest of Object.values(TEMPLATE_MANIFESTS)) {
      for (const preset of manifest.presets) {
        const t = preset.tokens;
        for (const value of Object.values(t)) expect(value).toMatch(HEX);
        // body text on the page background must pass WCAG AA (4.5:1)
        expect(contrastRatio(t.color_text_primary!, t.color_background!)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("resolve template_style against controls, ignoring unknown or invalid values", () => {
    const botanical = TEMPLATE_MANIFESTS.botanical;
    expect(resolveTemplateStyle(botanical, { background: "topo", evil: "x" })).toEqual({ background: "topo" });
    expect(resolveTemplateStyle(botanical, { background: "url(javascript:1)" })).toEqual({ background: "botanical" });
    expect(resolveTemplateStyle(TEMPLATE_MANIFESTS.vcard, null)).toEqual({ cover_slideshow: true });
  });
});
