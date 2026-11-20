import { describe, it, expect } from "vitest";
import { buildSetupChecklist } from "@/lib/dashboard/setup-checklist";
import type { Profile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";

const baseTokens: ThemeTokens = {
  color_background: "#ffffff",
  color_surface: "#ffffff",
  color_text_primary: "#18181b",
  color_text_secondary: "#52525b",
  color_accent: "#0f766e",
  font_family: "inter",
  button_radius: "large",
  button_style: "solid",
  animation: "none",
};

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "01PROFILE",
    user_id: "01USER",
    username: "aisha",
    display_name: "",
    bio: null,
    avatar_url: null,
    cover_url: null,
    template_id: "vcard",
    theme_tokens: null,
    is_public: true,
    seo_title: null,
    seo_description: null,
    version: 1,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
    ...overrides,
  };
}

const byId = (steps: ReturnType<typeof buildSetupChecklist>) =>
  Object.fromEntries(steps.map((s) => [s.id, s.done]));

describe("buildSetupChecklist", () => {
  it("marks everything to do for a brand-new card", () => {
    const steps = buildSetupChecklist(makeProfile(), [], 0);
    expect(steps).toHaveLength(6);
    expect(steps.every((s) => !s.done)).toBe(true);
  });

  it("reads VCard options and blocks", () => {
    const profile = makeProfile({
      display_name: "Aisha Rahman",
      avatar_url: "https://cdn.example/a.jpg",
      theme_tokens: {
        ...baseTokens,
        custom_options: {
          whatsapp_number: "+919000000000",
          social_urls: { instagram: "https://instagram.com/aisha", website: "https://site.example" },
        },
      },
    });
    const blocks = [
      { id: "b1", type: "phone", is_visible: true, config: { phone: "+919000000001" } },
    ] as unknown as ProfileBlock[];

    const done = byId(buildSetupChecklist(profile, blocks, 12));
    expect(done).toEqual({
      identity: true,
      template: true,
      phone: true,
      whatsapp: true,
      socials: true,
      share: true,
    });
  });

  it("reads Botanical quick actions and social links, ignoring empty or hidden ones", () => {
    const profile = makeProfile({
      template_id: "botanical",
      display_name: "Rohan",
      theme_tokens: {
        ...baseTokens,
        custom_options: {
          quick_actions: { phone: { number: "+919000000002" }, whatsapp: { number: "" } },
          social_links: [
            { platform: "linkedin", url: "", is_active: true },
            { platform: "x", url: "https://x.com/rohan", is_active: false },
          ],
        },
      },
    });

    const steps = buildSetupChecklist(profile, [], 0);
    const done = byId(steps);
    expect(done.phone).toBe(true);
    expect(done.whatsapp).toBe(false);
    expect(done.socials).toBe(false);
    expect(done.identity).toBe(false); // no photo
    expect(steps.find((s) => s.id === "phone")?.href).toBe("/dashboard/editor?section=contact"); // deep link to the exact editor section
  });

  it("does not count hidden blocks", () => {
    const blocks = [
      { id: "b1", type: "phone", is_visible: false, config: { phone: "+919000000001" } },
    ] as unknown as ProfileBlock[];
    expect(byId(buildSetupChecklist(makeProfile(), blocks, 0)).phone).toBe(false);
  });
});
