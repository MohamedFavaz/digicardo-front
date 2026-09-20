import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileJsonLd } from "@/components/profile/ProfileJsonLd";
import type { PublicProfile } from "@/types/profile";

describe("ProfileJsonLd Component", () => {
  it("renders safe JSON-LD schema with person and social links", () => {
    const profile: PublicProfile = {
      username: "sarah",
      display_name: "Sarah Parker",
      bio: "Product designer and writer.",
      template_id: "vcard",
      seo_description: "Portfolio of Sarah Parker.",
      blocks: [
        {
          id: "01M0BLK1",
          type: "social",
          sort_order: 1,
          config: {
            platform: "x",
            url: "https://twitter.com/sarahparker",
          },
        },
      ],
      avatar_url: null,
    };

    const html = renderToStaticMarkup(<ProfileJsonLd profile={profile} />);

    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain('"@type":"ProfilePage"');
    expect(html).toContain('"name":"Sarah Parker"');
    expect(html).toContain('"sameAs":["https://twitter.com/sarahparker"]');
  });

  it("escapes special HTML characters to prevent XSS in script tags", () => {
    const profile: PublicProfile = {
      username: "hacker",
      display_name: "</script><script>alert('xss')</script>",
      bio: "Test bio with <tags>",
      avatar_url: null,
      template_id: "vcard",
    };

    const html = renderToStaticMarkup(<ProfileJsonLd profile={profile} />);

    // Must not contain raw unescaped </script> within JSON-LD payload
    expect(html).not.toContain("</script><script>");
    expect(html).toContain("\\u003c/script>");
  });
});
