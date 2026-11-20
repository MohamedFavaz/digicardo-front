import { describe, expect, it } from "vitest";
import { buildScene, type CardData, type Shape } from "@/components/nfc-card/scene";
import { DEFAULT_DESIGN, THEMES, resolveTheme, CARD_W } from "@/components/nfc-card/design";
import { sceneToSvg, withPngDpi } from "@/components/nfc-card/render";

const data: CardData = {
  name: "Aisha Rahman",
  role: "Interior Designer · Studio Noor",
  brand: "Studio Noor",
  jobTitle: "Interior Designer",
  initials: "AR",
  logoUrl: null,
  url: "https://digicardo.app/aisha",
  urlLabel: "digicardo.app/aisha",
  phone: "+91 98450 12345",
  email: "hi@noor.in",
  website: "noor.in",
};
// ~0.55 em per character: good enough to exercise the fit-to-width logic.
const measure = (text: string, size: number) => text.length * size * 0.55;
const texts = (shapes: Shape[]) => shapes.filter((s): s is Extract<Shape, { t: "text" }> => s.t === "text");
const CLASSIC = { ...DEFAULT_DESIGN, front: "classic" as const };

describe("NFC card scene", () => {
  it("puts the name, role and tap symbol on the front", () => {
    const front = buildScene("front", CLASSIC, data, measure);
    expect(texts(front).map((t) => t.text)).toEqual(expect.arrayContaining(["Aisha Rahman", "Interior Designer · Studio Noor", "AR"]));
    expect(front.some((s) => s.t === "glyph")).toBe(true);
  });

  it("puts a QR code for the card link and the contact lines on the back", () => {
    const back = buildScene("back", DEFAULT_DESIGN, data, measure);
    const qr = back.find((s) => s.t === "qr");
    expect(qr && qr.t === "qr" && qr.matrix.length).toBeGreaterThan(20);
    expect(texts(back).map((t) => t.text)).toEqual(expect.arrayContaining(["digicardo.app/aisha", "+91 98450 12345", "hi@noor.in", "noor.in"]));
  });

  it("respects the show options", () => {
    const design = { ...CLASSIC, showLogo: false, showRole: false, showContacts: false };
    expect(texts(buildScene("front", design, data, measure)).map((t) => t.text)).toEqual(["Aisha Rahman"]);
    expect(texts(buildScene("back", design, data, measure)).map((t) => t.text)).not.toContain("hi@noor.in");
  });

  it("shrinks a long name to fit the card", () => {
    const long = { ...data, name: "Dr. Venkataraghavan Subramaniam Iyer" };
    const name = texts(buildScene("front", CLASSIC, long, measure)).find((t) => t.text === long.name)!;
    expect(measure(name.text, name.size)).toBeLessThanOrEqual(CARD_W - 14 + 0.01);
  });

  it("Signature (the default) has brand, chip, tap button, name and job title", () => {
    expect(DEFAULT_DESIGN.front).toBe("signature");
    const front = buildScene("front", DEFAULT_DESIGN, data, measure);
    // Company at the top, so the line under the name is the job title alone (no repeat).
    expect(texts(front).map((t) => t.text)).toEqual(["Studio Noor", "Aisha Rahman", "Interior Designer"]);
    expect(front.some((s) => s.t === "rect" && s.fill === "#E9C46A")).toBe(true); // chip
    expect(front.filter((s) => s.t === "glyph")).toHaveLength(2); // logo tile + tap button
    const tap = front.find((s) => s.t === "circle" && s.r === 6.3);
    expect(tap && tap.t === "circle" && tap.fill).toBe(resolveTheme(DEFAULT_DESIGN).accent);
    const noRole = buildScene("front", { ...DEFAULT_DESIGN, showRole: false }, data, measure);
    expect(texts(noRole).map((t) => t.text)).not.toContain("Interior Designer");
  });

  it("Signature keeps a long name clear of the tap button", () => {
    const long = { ...data, name: "Dr. Venkataraghavan Subramaniam Iyer" };
    const lines = texts(buildScene("front", DEFAULT_DESIGN, long, measure)).filter((t) => t.weight === 800);
    // Wrapped onto two lines that together read the full name, each clear of the button rings.
    expect(lines.map((l) => l.text).join(" ")).toBe(long.name);
    for (const l of lines) expect(l.x + measure(l.text, l.size)).toBeLessThanOrEqual(73.2 - 12.4);
  });

  it("uses the chosen theme, or the custom colours", () => {
    const ocean = THEMES.find((t) => t.id === "ocean")!;
    expect(resolveTheme({ ...DEFAULT_DESIGN, themeId: "ocean" })).toEqual(ocean);
    expect(resolveTheme({ ...DEFAULT_DESIGN, themeId: "custom" }).bg).toBe(DEFAULT_DESIGN.custom.bg);
  });

  it("builds a self-contained SVG at real card size, escaping text", () => {
    const svg = sceneToSvg(buildScene("front", DEFAULT_DESIGN, { ...data, name: "A & B <Co>" }, measure), { bleed: 3 });
    expect(svg).toContain('width="91.6mm" height="60mm"');
    expect(svg).toContain("A &amp; B &lt;Co&gt;");
    expect(svg).not.toContain("<Co>");
  });
});

describe("PNG resolution", () => {
  it("adds a 300 dpi pHYs chunk right after IHDR", async () => {
    // Minimal PNG: signature + IHDR (13 bytes) + IEND.
    const sig = [137, 80, 78, 71, 13, 10, 26, 10];
    const ihdr = [0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 0x1f, 0x15, 0xc4, 0x89];
    const iend = [0, 0, 0, 0, 73, 69, 78, 68, 0xae, 0x42, 0x60, 0x82];
    const out = new Uint8Array(await (await withPngDpi(new Blob([new Uint8Array([...sig, ...ihdr, ...iend])]), 300)).arrayBuffer());
    const at = sig.length + ihdr.length;
    expect(String.fromCharCode(...out.slice(at + 4, at + 8))).toBe("pHYs");
    const view = new DataView(out.buffer);
    expect(view.getUint32(at + 8)).toBe(11811);
    expect(out[at + 16]).toBe(1);
    expect(out.length).toBe(sig.length + ihdr.length + 21 + iend.length);
  });
});
