import { describe, it, expect } from "vitest";
import {
  getTemplate,
  getAllTemplates,
  isValidTemplate,
  DEFAULT_TEMPLATE_ID,
} from "@/templates/registry";

describe("Template Registry", () => {
  it("resolves the vcard template", () => {
    const template = getTemplate("vcard");
    expect(template).toBeDefined();
    expect(template.id).toBe("vcard");
    expect(template.name).toBeTruthy();
    expect(template.description).toBeTruthy();
    expect(template.default_theme).toBeDefined();
    expect(template.Component).toBeDefined();
  });

  it("identifies valid vs invalid template IDs", () => {
    expect(isValidTemplate("vcard")).toBe(true);

    expect(isValidTemplate("minimal-light")).toBe(false);
    expect(isValidTemplate("glass")).toBe(false);
    expect(isValidTemplate("gradient")).toBe(false);
    expect(isValidTemplate("creator")).toBe(false);
    expect(isValidTemplate("professional")).toBe(false);
    expect(isValidTemplate("editorial")).toBe(false);
    expect(isValidTemplate("resort")).toBe(false);
    expect(isValidTemplate("unknown-template")).toBe(false);
    expect(isValidTemplate("")).toBe(false);
    expect(isValidTemplate(null)).toBe(false);
    expect(isValidTemplate(undefined)).toBe(false);
  });

  it("safely falls back to vcard (default) for unknown or missing IDs", () => {
    const fallbackForNull = getTemplate(null);
    expect(fallbackForNull.id).toBe(DEFAULT_TEMPLATE_ID);
    expect(fallbackForNull.id).toBe("vcard");

    const fallbackForInvalid = getTemplate("non-existent-template-id");
    expect(fallbackForInvalid.id).toBe(DEFAULT_TEMPLATE_ID);
  });

  it("retrieves only the vcard template in the catalog", () => {
    const templates = getAllTemplates();
    expect(templates.length).toBe(1);

    const ids = templates.map((t) => t.id);
    expect(ids).toContain("vcard");
  });
});
