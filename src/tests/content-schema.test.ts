import { describe, expect, it } from "vitest";
import {
  cardContentSchema,
  emptyCardContent,
  normalizeCardContent,
  normalizeLayout,
  updateContentRequestSchema,
  SECTION_KEYS,
} from "@/lib/zod/content";

describe("card content schema (mirrors CardContentSchema.php)", () => {
  it("accepts a complete empty document once a name is set", () => {
    const content = emptyCardContent();
    expect(cardContentSchema.safeParse(content).success).toBe(false); // name is required
    content.identity.name = "Aisha Rahman";
    expect(cardContentSchema.safeParse(content).success).toBe(true);
  });

  it("fills a partial API object into the full shape and drops unknown keys", () => {
    const content = normalizeCardContent({
      identity: { name: "  Aisha  ", injected: "x" },
      contact: { phone: "+91 98450 12345" },
      socials: [{ id: "bad id!", platform: "myspace", url: "https://myspace.com/a" }],
      layout: [{ key: "gallery", visible: false }, { key: "nope" }],
      extra: true,
    });

    expect(content.identity.name).toBe("Aisha");
    expect("injected" in content.identity).toBe(false);
    expect(content.contact.phone).toBe("+91 98450 12345");
    expect(content.contact.email).toBe("");
    expect(content.socials[0]).toEqual({ id: "item-1", platform: "other", url: "https://myspace.com/a" });
    expect(content.layout[0]).toEqual({ key: "gallery", visible: false });
    expect(content.layout).toHaveLength(SECTION_KEYS.length);
    expect("extra" in content).toBe(false);
  });

  it("rejects unsafe links and malformed payment details with friendly messages", () => {
    const content = emptyCardContent();
    content.identity.name = "Aisha";
    content.contact.website = "javascript:alert(1)";
    content.payments.upi_id = "not a upi";
    content.payments.bank.ifsc = "hdfc123";
    content.contact.phone = "12";

    const result = cardContentSchema.safeParse(content);
    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages).toContain("Enter a full web address that starts with https://");
    expect(messages).toContain("Enter a UPI ID like name@bank.");
    expect(messages).toContain("Enter an 11-character IFSC code like HDFC0001234.");
    expect(messages).toContain("Enter a phone number with country code, like +91 98765 43210.");
  });

  it("uppercases IFSC codes and accepts valid UPI ids", () => {
    const parsed = cardContentSchema.shape.payments.parse({
      upi_id: "studionoor@okhdfc",
      upi_name: "",
      payment_phone: "",
      bank: { holder: "", bank_name: "", account_number: "50100123456789", ifsc: "hdfc0001234" },
    });
    expect(parsed.bank.ifsc).toBe("HDFC0001234");
  });

  it("validates PATCH requests: at least one part, known parts only", () => {
    expect(updateContentRequestSchema.safeParse({ version: 3, sections: {} }).success).toBe(false);
    expect(
      updateContentRequestSchema.safeParse({
        version: 3,
        sections: { actions: { save_contact: true, share: false, qr: true, review_url: "", booking_message: "" } },
      }).success
    ).toBe(true);
  });

  it("normalizes layouts: unique known keys first, missing ones appended", () => {
    const layout = normalizeLayout([{ key: "qr", visible: false }, { key: "qr", visible: true }]);
    expect(layout[0]).toEqual({ key: "qr", visible: false });
    expect(layout.filter((e) => e.key === "qr")).toHaveLength(1);
    expect(layout.map((e) => e.key).sort()).toEqual([...SECTION_KEYS].sort());
  });
});
