import { beforeEach, describe, expect, it } from "vitest";
import { useCardEditor } from "@/lib/editor/store";
import { validParts } from "@/lib/editor/autosave";
import { emptyCardContent } from "@/lib/zod/content";
import type { EditorData } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";

function editorData(): EditorData {
  const content = emptyCardContent();
  content.identity.name = "Aisha Rahman";
  return {
    profile: { id: "p1", username: "aisha", display_name: "Aisha Rahman", template_id: "vcard", version: 3 } as Profile,
    content,
    content_stored: true,
    template_id: "vcard",
    theme_tokens: null,
    blocks: [],
    templates: [],
    version: 3,
  };
}

const state = () => useCardEditor.getState();

describe("card editor store", () => {
  beforeEach(() => {
    // Start each test from a fresh, fully saved editor.
    useCardEditor.setState({ loaded: false, dirtyParts: [], themeDirty: false, status: "saved" });
    state().load(editorData());
  });

  it("loads clean and marks only the changed part dirty", () => {
    expect(state().dirtyParts).toEqual([]);
    state().setPart("contact", { ...state().content.contact, phone: "+91 98450 12345" }, "phone");
    expect(state().dirtyParts).toEqual(["contact"]);
    expect(state().status).toBe("unsaved");
  });

  it("merges quick typing in one field into a single undo step", () => {
    const contact = state().content.contact;
    state().setPart("contact", { ...contact, email: "a" }, "email");
    state().setPart("contact", { ...contact, email: "ab" }, "email");
    state().setPart("contact", { ...contact, email: "abc" }, "email");
    expect(state().past).toHaveLength(1);
    state().undo();
    expect(state().content.contact.email).toBe("");
    state().redo();
    expect(state().content.contact.email).toBe("abc");
  });

  it("undo marks the restored part dirty so autosave sends it", () => {
    state().setPart("identity", { ...state().content.identity, role: "Designer" }, "role");
    state().markSaved({ version: 4, parts: ["identity"], theme: false, revision: state().revision });
    expect(state().dirtyParts).toEqual([]);
    state().undo();
    expect(state().content.identity.role).toBe("");
    expect(state().dirtyParts).toContain("identity");
  });

  it("switching template keeps content and applies the template's look", () => {
    const before = state().content;
    state().setTemplate("botanical");
    expect(state().templateId).toBe("botanical");
    expect(state().content).toBe(before);
    expect(state().theme.color_accent).toBe("#2D6A4F");
    expect(state().themeDirty).toBe(true);
    state().undo();
    expect(state().templateId).toBe("vcard");
  });

  it("does not clear dirty parts when the card changed during a save", () => {
    state().setPart("socials", [], "list");
    const revision = state().revision;
    state().setPart("socials", [{ id: "s1", platform: "instagram", url: "https://instagram.com/a" }], "list");
    state().markSaved({ version: 4, parts: ["socials"], theme: false, revision });
    expect(state().dirtyParts).toContain("socials");
    expect(state().status).toBe("unsaved");
    expect(state().version).toBe(4);
  });
});

describe("autosave validation", () => {
  it("only sends parts that pass validation", () => {
    const content = emptyCardContent();
    content.identity.name = "Aisha";
    content.contact.website = "javascript:alert(1)";
    const parts = validParts(content, ["identity", "contact"]);
    expect(Object.keys(parts)).toEqual(["identity"]);
  });
});

describe("late loads", () => {
  it("never overwrite unsaved edits", () => {
    useCardEditor.setState({ loaded: false, dirtyParts: [], themeDirty: false, status: "saved" });
    state().load(editorData());
    state().setPart("identity", { ...state().content.identity, role: "Product Designer" }, "role");
    state().load({ ...editorData(), version: 5 });
    expect(state().content.identity.role).toBe("Product Designer");
    expect(state().version).toBe(5);
  });
});
