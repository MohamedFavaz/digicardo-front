import { describe, expect, it } from "vitest";
import { legacyToCardContent } from "@/lib/content/legacy";
import { resolveCardData } from "@/lib/content/resolve";
import type { PublicProfile, ThemeTokens } from "@/types/profile";
import type { PublicProfileBlock } from "@/types/blocks";

/** Same fixtures as backend/tests/Unit/Services/LegacyContentMapperTest.php. */
describe("legacy custom_options → card content", () => {
  it("maps VCard options into every section", () => {
    const { content, templateStyle } = legacyToCardContent(
      { display_name: "Owner Name", template_id: "vcard" },
      {
        display_name_override: "Studio Noor",
        tagline_override: "Calm homes in Bengaluru.",
        custom_avatar_url: "https://cdn.example.com/a.jpg",
        banner_images: ["https://cdn.example.com/c1.jpg", "javascript:alert(1)", "https://cdn.example.com/c2.jpg"],
        category_badge_text: "Interior design",
        show_meta_verified: false,
        whatsapp_number: "+91 98450 12345",
        payment_phone: "+91 98450 99999",
        address_text: "12 MG Road, Bengaluru",
        map_url: "maps.google.com/?q=studio",
        website_url: "studionoor.in",
        social_urls: {
          instagram: "https://instagram.com/noor",
          twitter: "https://x.com/noor",
          youtube: "https://youtube.com/@noor",
          facebook: "",
        },
        active_action_icons: { youtube: false, qr: false },
        services: [{ id: "svc1", name: "Consultation", price: "₹2,500", duration: "90 min" }],
        products: [{ name: "Cushion", price: "₹1,800", buy_url: "javascript:void(0)" }],
        services_enquiry_template: "Hi! I want {service}.",
        upi_id: "noor@okhdfc",
        bank_holder_name: "Studio Noor",
        bank_ifsc: "hdfc0001234",
        gallery_enabled: false,
        gallery_title: "Recent work",
        gallery_images: ["/storage/media/g1.jpg"],
        google_review_url: "https://g.page/r/noor/review",
        banner_transition: false,
      }
    );

    expect(content.identity.name).toBe("Studio Noor");
    expect(content.identity.bio).toBe("Calm homes in Bengaluru.");
    expect(content.identity.cover_images).toEqual(["https://cdn.example.com/c1.jpg", "https://cdn.example.com/c2.jpg"]);
    expect(content.identity.verified_badge).toBe(false);
    expect(content.contact).toMatchObject({
      phone: "+91 98450 99999",
      whatsapp: "+91 98450 12345",
      website: "https://studionoor.in",
      map_url: "https://maps.google.com/?q=studio",
    });
    expect(content.socials.map((s) => s.platform)).toEqual(["instagram", "x"]);
    expect(content.catalog.products[0].buy_url).toBe("");
    expect(content.catalog.enquiry_message).toBe("Hi! I want {item}.");
    expect(content.payments.bank.ifsc).toBe("HDFC0001234");
    expect(content.layout.find((e) => e.key === "gallery")?.visible).toBe(false);
    expect(content.actions.qr).toBe(false);
    expect(templateStyle).toEqual({ cover_slideshow: false });
  });

  it("maps Botanical quick actions, links and style", () => {
    const { content, templateStyle } = legacyToCardContent(
      { display_name: "Owner Name", template_id: "botanical" },
      {
        executive_role: "Managing Partner",
        company_name: "Mehta & Iyer Advisory",
        profile_image_url: "https://cdn.example.com/rohan.jpg",
        custom_avatar_url: "https://cdn.example.com/old.jpg",
        trust_badges: [{ id: "b1", text: "Verified business" }, { id: "b2", text: "Hidden", enabled: false }],
        quick_actions: {
          phone: { number: "+91 22 4000 1000" },
          email: { address: "rohan@mehta.in", enabled: false },
          website: { url: "https://mehta.in" },
        },
        social_links: [
          { platform: "LinkedIn", url: "https://linkedin.com/in/rohan" },
          { platform: "custom", url: "https://youtube.com/@mehta" },
          { platform: "instagram", url: "https://instagram.com/x", enabled: false },
        ],
        content_links: [
          { headline: "Book a consultation", url: "https://cal.com/rohan", featured: true, icon: "Calendar" },
          { headline: "Bad", url: "javascript:alert(1)" },
        ],
        document_block: { title: "Company profile", file_url: "https://cdn.example.com/p.pdf", file_size: 2400000 },
        color_palette: "enterprise-navy",
        bg_style: "bg-topo",
        show_qr: false,
      }
    );

    expect(content.identity.avatar_url).toBe("https://cdn.example.com/rohan.jpg");
    expect(content.identity.badges).toEqual(["Verified business"]);
    expect(content.contact.email).toBe("");
    expect(content.contact.whatsapp).toBe("");
    expect(content.socials.map((s) => s.platform)).toEqual(["linkedin", "youtube"]);
    expect(content.links).toHaveLength(1);
    expect(content.links[0]).toMatchObject({ featured: true, icon: "calendar" });
    expect(content.documents[0].size_label).toBe("2.3 MB");
    expect(content.actions.qr).toBe(false);
    expect(templateStyle).toEqual({ palette: "navy", background: "topo" });
  });

  it("drops the system placeholder bio and lifts contact blocks out of 'More'", () => {
    const blocks: PublicProfileBlock[] = [
      { id: "b-email", type: "email", sort_order: 1, config: { label: "Mail", email: "hi@noor.in" } },
      { id: "b-social", type: "social", sort_order: 2, config: { platform: "github", url: "https://github.com/noor" } },
      { id: "b-text", type: "text", sort_order: 3, config: { content: "Hello" } },
    ];
    const profile: PublicProfile = { username: "noor", display_name: "Noor", bio: "Welcome to my page!", template_id: "vcard" };
    const theme = { custom_options: {} } as ThemeTokens;

    const data = resolveCardData(profile, theme, blocks);
    expect(data.isLegacy).toBe(true);
    expect(data.content.identity.bio).toBe("");
    expect(data.content.contact.email).toBe("hi@noor.in");
    expect(data.extraBlocks.map((b) => b.id)).toEqual(["b-text"]);
  });

  it("uses stored content as-is once the card has been converted", () => {
    const profile: PublicProfile = {
      username: "noor",
      template_id: "vcard",
      content: { identity: { name: "Stored Name" } } as PublicProfile["content"],
    };
    const blocks: PublicProfileBlock[] = [{ id: "b-email", type: "email", sort_order: 1, config: { label: "Mail", email: "x@y.in" } }];
    const data = resolveCardData(profile, { custom_options: { display_name_override: "Legacy" } } as ThemeTokens, blocks);
    expect(data.isLegacy).toBe(false);
    expect(data.content.identity.name).toBe("Stored Name");
    expect(data.extraBlocks).toHaveLength(1);
  });
});
