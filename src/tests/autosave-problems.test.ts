import { describe, expect, it } from "vitest";
import { describePath, firstProblem, serverProblem } from "@/lib/editor/autosave";
import { emptyCardContent } from "@/lib/zod/content";

describe("save problem messages", () => {
  it("names the section, item and field", () => {
    expect(describePath(["catalog", "services", 0, "image_url"])).toBe("Services & products · Service 1 · Photo");
    expect(describePath(["payments", "upi_id"])).toBe("Payments · UPI ID");
    expect(describePath(["identity", "cover_images", 2])).toBe("Business details · Cover photo 3");
    expect(describePath(["contact", "whatsapp"])).toBe("Contact buttons · Whatsapp");
  });

  it("explains the first invalid draft field", () => {
    const content = emptyCardContent();
    content.identity.name = "Globicor";
    content.catalog.services = [{ id: "a", name: "", description: "", price: "", duration: "", image_url: "" }];
    expect(firstProblem(content, ["identity", "catalog"])).toBe("Services & products · Service 1 · Name: Add a name.");
    content.catalog.services[0].name = "Admissions help";
    expect(firstProblem(content, ["identity", "catalog"])).toBeNull();
  });

  it("turns a server validation error into words", () => {
    expect(serverProblem({ "sections.catalog.services.0.image_url": ["Upload this image first."] })).toBe(
      "Services & products · Service 1 · Photo: Upload this image first."
    );
    expect(serverProblem(null)).toBeNull();
  });
});
