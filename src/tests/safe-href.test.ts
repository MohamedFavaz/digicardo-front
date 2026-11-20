import { describe, it, expect } from "vitest";
import { safeHref } from "@/lib/utils/safe-href";

describe("safeHref", () => {
  it("refuses script-capable and other unsafe schemes", () => {
    for (const bad of [
      "javascript:alert(1)",
      "JAVASCRIPT:alert(1)",
      " java\tscript:alert(1)",
      "data:text/html;base64,PHNjcmlwdD4=",
      "vbscript:msgbox(1)",
      "file:///etc/passwd",
    ]) {
      expect(safeHref(bad), bad).toBeNull();
    }
  });

  it("keeps http(s), mailto and tel links unchanged", () => {
    expect(safeHref("https://instagram.com/aisha")).toBe("https://instagram.com/aisha");
    expect(safeHref("http://example.com")).toBe("http://example.com");
    expect(safeHref("mailto:hello@example.com")).toBe("mailto:hello@example.com");
    expect(safeHref("tel:+919000000000")).toBe("tel:+919000000000");
  });

  it("adds https:// to bare domains and protocol-relative URLs", () => {
    expect(safeHref("studionoor.in")).toBe("https://studionoor.in");
    expect(safeHref("example.com:8080/path")).toBe("https://example.com:8080/path");
    expect(safeHref("//cdn.example/a.jpg")).toBe("https://cdn.example/a.jpg");
  });

  it("keeps in-page anchors and site-relative paths", () => {
    expect(safeHref("#services")).toBe("#services");
    expect(safeHref("/aisha")).toBe("/aisha");
  });

  it("returns null for empty or non-string input", () => {
    expect(safeHref("")).toBeNull();
    expect(safeHref("   ")).toBeNull();
    expect(safeHref(null)).toBeNull();
    expect(safeHref(undefined)).toBeNull();
  });
});
