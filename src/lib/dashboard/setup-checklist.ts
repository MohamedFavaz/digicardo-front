import type { Profile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import { resolveCardData } from "@/lib/content/resolve";

/**
 * Home "Finish setting up your card" checklist (docs/editor-redesign-plan.md §3.4).
 *
 * Reads the same card content the templates render (typed content, or the legacy options
 * mapped the same way), so a step is only "done" when it really shows on the card. Each
 * step deep-links to the exact editor section.
 */
export interface SetupStep {
  id: "identity" | "template" | "phone" | "whatsapp" | "socials" | "share";
  title: string;
  hint: string;
  done: boolean;
  href: string;
  actionLabel: string;
}

export function buildSetupChecklist(profile: Profile, blocks: ProfileBlock[], totalViews: number): SetupStep[] {
  const theme = (profile.theme_tokens ?? {}) as ThemeTokens;
  const { content } = resolveCardData(profile, theme, blocks);
  const name = content.identity.name.trim();
  const hasName = name !== "" && name !== profile.username;

  return [
    {
      id: "identity",
      title: "Add your name and photo",
      hint: "A clear photo or logo makes people trust your card.",
      done: hasName && Boolean(content.identity.avatar_url),
      href: "/dashboard/editor?section=identity",
      actionLabel: "Add",
    },
    {
      id: "template",
      title: "Choose a template",
      hint: "Pick the layout and colours of your card.",
      done: profile.theme_tokens != null,
      href: "/dashboard/editor?tab=design",
      actionLabel: "Choose",
    },
    {
      id: "phone",
      title: "Add a phone number",
      hint: "Visitors can call you in one tap.",
      done: Boolean(content.contact.phone),
      href: "/dashboard/editor?section=contact",
      actionLabel: "Add",
    },
    {
      id: "whatsapp",
      title: "Add your WhatsApp number",
      hint: "Most enquiries arrive on WhatsApp.",
      done: Boolean(content.contact.whatsapp),
      href: "/dashboard/editor?section=contact",
      actionLabel: "Add",
    },
    {
      id: "socials",
      title: "Add your social links",
      hint: "Instagram or LinkedIn help people recognise you.",
      done: content.socials.length > 0,
      href: "/dashboard/editor?section=socials",
      actionLabel: "Add links",
    },
    {
      id: "share",
      title: "Share your card for the first time",
      hint: "Send it on WhatsApp or print the QR code.",
      done: totalViews > 0,
      href: "/dashboard/qr",
      actionLabel: "Share",
    },
  ];
}
