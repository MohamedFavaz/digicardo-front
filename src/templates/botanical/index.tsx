"use client";

import React, { useState, useEffect, useMemo } from "react";
import { QrCode, X, Copy, Check, Download, Share2, ExternalLink } from "lucide-react";
import type { TemplateProps } from "../types";
import { BOTANICAL_PALETTES } from "./constants";

export { BOTANICAL_PALETTES };

export function BotanicalTemplate({ profile, blocks, theme }: TemplateProps) {
  const custom = theme?.custom_options || {};

  // ── Palette Aliases & Active Palette (Set exclusively in Appearance Studio) ──
  const PALETTE_ALIAS: Record<string, string> = {
    "executive-forest": "sage",
    "enterprise-navy": "navy",
    "noir-gold": "gold",
    "terracotta-clay": "terracotta",
    "charcoal-minimal": "charcoal",
  };
  const rawPalette = (custom.color_palette || custom.palette || "sage") as string;
  const activeTheme = PALETTE_ALIAS[rawPalette] || rawPalette || "sage";

  const rawBg = (custom.bg_style as string) || "botanical";
  const activeBg = rawBg.replace(/^bg-/, "") || "botanical";

  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // ── Custom Colors overrides if configured in Appearance Studio ──
  const customColors = custom.custom_colors || {};

  // ── Profile Fields ──
  const displayName =
    (custom.display_name_override as string) ||
    profile?.display_name ||
    "Alex Morgan";

  const isHiddenVal = (val: unknown) =>
    val === false ||
    val === "false" ||
    val === 0 ||
    val === "0" ||
    val === "off" ||
    val === "hide" ||
    val === "hidden";

  const showCompanyName =
    !isHiddenVal(custom.show_company_name) &&
    (custom.company_name !== undefined ? custom.company_name.trim() !== "" : true);

  const companyName =
    custom.company_name !== undefined
      ? custom.company_name
      : "Nexus Global Solutions Ltd.";

  const showExecutiveRole =
    !isHiddenVal(custom.show_executive_role) &&
    (custom.executive_role !== undefined ? custom.executive_role.trim() !== "" : true);

  const executiveRole =
    custom.executive_role !== undefined
      ? custom.executive_role
      : "Managing Director · Founder";

  const showBio =
    !isHiddenVal(custom.show_bio) &&
    (custom.bio_override !== undefined ? custom.bio_override.trim() !== "" : Boolean(profile?.bio || true));

  const bio =
    (custom.bio_override as string) ||
    profile?.bio ||
    "Enterprise digital solutions & strategic consulting.";

  const avatarUrl =
    (custom.profile_image_url as string) ||
    (profile?.avatar_url as string) ||
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80";

  const companyLogoUrl =
    (custom.company_logo_url as string) || "/logo.png";

  const showVerified = custom.verified_badge !== false;

  // ── Quick Actions ──
  const qa = custom.quick_actions || {};
  const showCall = qa.show_call !== false && qa.phone?.enabled !== false;
  const showWhatsapp = qa.show_whatsapp !== false && qa.whatsapp?.enabled !== false;
  const showEmail = qa.show_email !== false && qa.email?.enabled !== false;
  const showWebsite = qa.show_website !== false && qa.website?.enabled !== false;

  const phoneVal: string = String(qa.phone?.number || (typeof custom.phone === "string" ? custom.phone : "") || "+918593048536");
  const whatsappVal: string = String(qa.whatsapp?.number || (typeof custom.whatsapp === "string" ? custom.whatsapp : "") || "+918593048536");
  const emailVal: string = String(qa.email?.address || (typeof custom.email === "string" ? custom.email : "") || "contact@nexusglobal.com");
  const websiteVal: string = String(qa.website?.url || (typeof custom.website === "string" ? custom.website : "") || "https://example.com");

  const phoneLabel = qa.phone?.label || "Call Office";
  const whatsappLabel = qa.whatsapp?.label || "WhatsApp";
  const emailLabel = qa.email?.label || "Email Us";
  const websiteLabel = qa.website?.label || "Website";

  // ── Trust Badges ──
  const trustBadges = custom.trust_badges || [
    { id: "1", text: "Verified Corporate", icon: "shield", enabled: true },
    { id: "2", text: "5.0 Rated Services", icon: "star", enabled: true },
  ];

  // ── Content Link Cards ──
  const contentLinks = useMemo(() => {
    if (custom.content_links && Array.isArray(custom.content_links) && custom.content_links.length > 0) {
      return custom.content_links
        .filter((l: any) => l.enabled !== false && l.is_active !== false)
        .map((l: any) => ({
          id: l.id || String(Math.random()),
          headline: l.headline || l.title || "Link",
          description: l.description || "",
          url: l.url || "#",
          icon: (l.icon || "services").toLowerCase(),
          featured: Boolean(l.featured || l.is_featured),
        }));
    }
    // Default 5 cards matching botanical-preview.html
    return [
      {
        id: "1",
        headline: "Corporate Services & Solutions",
        description: "Explore enterprise offerings & portfolio",
        url: "#services",
        icon: "services",
        featured: true,
      },
      {
        id: "2",
        headline: "Bank & Payment Details",
        description: "Account, IFSC, UPI & billing info",
        url: "#payment",
        icon: "bank",
        featured: false,
      },
      {
        id: "3",
        headline: "Schedule Consultation",
        description: "Book a 30-min executive strategy call",
        url: "#booking",
        icon: "meeting",
        featured: false,
      },
      {
        id: "4",
        headline: "Download Company Profile",
        description: "Corporate brochure & credentials (PDF)",
        url: "#brochure",
        icon: "brochure",
        featured: false,
      },
      {
        id: "5",
        headline: "Corporate Headquarters",
        description: "Business Park, Tower B, Level 8",
        url: "#location",
        icon: "location",
        featured: false,
      },
    ];
  }, [custom.content_links]);

  // ── Helper to intelligently detect platform from name or URL ──
  const detectSocialPlatform = (platform?: string, url?: string): string => {
    const rawP = (platform || "").toLowerCase().trim();
    const cleanP = rawP.replace(/[-_ ]/g, "");
    const u = (url || "").toLowerCase().trim();

    // Check platform string first
    if (cleanP && !["custom", "website", "link", "url", "other", "site", "web"].includes(cleanP)) {
      if (cleanP === "x" || cleanP.includes("twitter")) return "x";
      if (cleanP.includes("linkedin")) return "linkedin";
      if (cleanP.includes("insta") || cleanP === "ig") return "instagram";
      if (cleanP.includes("whats") || cleanP === "wa") return "whatsapp";
      if (cleanP.includes("youtube") || cleanP === "yt") return "youtube";
      if (cleanP.includes("facebook") || cleanP === "fb") return "facebook";
      if (cleanP.includes("telegram") || cleanP === "tg") return "telegram";
      if (cleanP.includes("github") || cleanP === "git") return "github";
      if (cleanP.includes("tiktok") || cleanP === "tt") return "tiktok";
      if (cleanP.includes("thread")) return "threads";
      if (cleanP.includes("snap")) return "snapchat";
      if (cleanP.includes("pin")) return "pinterest";
      if (cleanP.includes("spot")) return "spotify";
      if (cleanP.includes("apple") || cleanP.includes("itunes") || cleanP.includes("music")) return "apple_music";
      if (cleanP.includes("disc")) return "discord";
      if (cleanP.includes("reddit")) return "reddit";
      if (cleanP.includes("twitch")) return "twitch";
      if (cleanP.includes("behance")) return "behance";
      if (cleanP.includes("drib")) return "dribbble";
      if (cleanP.includes("medium")) return "medium";
      if (cleanP.includes("quora")) return "quora";
      if (cleanP.includes("map")) return "google_maps";
      if (cleanP.includes("review") || cleanP.includes("googlebiz") || cleanP.includes("googlebusiness")) return "google_business";
      if (cleanP === "google") return "google_business";
      if (cleanP.includes("mail") || cleanP === "email") return "email";
      if (cleanP.includes("phone") || cleanP.includes("tel") || cleanP.includes("call") || cleanP.includes("mobile")) return "phone";
      return rawP;
    }

    // Check URL domain / protocol
    if (u.includes("linkedin.com")) return "linkedin";
    if (u.includes("twitter.com") || u.includes("x.com")) return "x";
    if (u.includes("instagram.com") || u.includes("instagr.am")) return "instagram";
    if (u.includes("wa.me") || u.includes("whatsapp.com")) return "whatsapp";
    if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
    if (u.includes("facebook.com") || u.includes("fb.com") || u.includes("fb.me")) return "facebook";
    if (u.includes("t.me") || u.includes("telegram.me")) return "telegram";
    if (u.includes("github.com")) return "github";
    if (u.includes("tiktok.com")) return "tiktok";
    if (u.includes("threads.net")) return "threads";
    if (u.includes("snapchat.com")) return "snapchat";
    if (u.includes("pinterest.com") || u.includes("pin.it")) return "pinterest";
    if (u.includes("spotify.com")) return "spotify";
    if (u.includes("music.apple.com") || u.includes("itunes.apple.com")) return "apple_music";
    if (u.includes("discord.gg") || u.includes("discord.com")) return "discord";
    if (u.includes("reddit.com")) return "reddit";
    if (u.includes("twitch.tv")) return "twitch";
    if (u.includes("behance.net")) return "behance";
    if (u.includes("dribbble.com")) return "dribbble";
    if (u.includes("medium.com")) return "medium";
    if (u.includes("quora.com")) return "quora";
    if (u.includes("maps.google") || u.includes("goo.gl/maps")) return "google_maps";
    if (u.includes("google.com/search") || u.includes("g.page") || u.includes("reviews")) return "google_business";
    if (u.startsWith("mailto:") || (u.includes("@") && !u.includes("/"))) return "email";
    if (u.startsWith("tel:") || /^\+?[0-9\s-]{7,}$/.test(u)) return "phone";

    return rawP || "website";
  };

  // ── Social Links (With automatic platform detection from URL & type) ──
  const socialLinks = useMemo(() => {
    // 1. From custom_options.social_links
    if (custom.social_links && Array.isArray(custom.social_links) && custom.social_links.length > 0) {
      const active = custom.social_links.filter((s: any) => s.enabled !== false && s.is_active !== false && s.url);
      if (active.length > 0) {
        return active.map((s: any) => {
          const detected = detectSocialPlatform(s.platform, s.url);
          return {
            platform: detected,
            url: s.url,
            title: s.name || detected.toUpperCase(),
          };
        });
      }
    }

    // 2. Fallback to blocks if present
    if (blocks && Array.isArray(blocks) && blocks.length > 0) {
      const socialBlocks = blocks.filter((b) => b.type === "social" && b.is_active !== false);
      if (socialBlocks.length > 0) {
        return socialBlocks.map((b: any) => {
          const cfg = b.config || {};
          const detected = detectSocialPlatform(cfg.platform, cfg.url);
          return {
            platform: detected,
            url: cfg.url || "#",
            title: cfg.title || detected.toUpperCase(),
          };
        });
      }
    }

    // 3. Fallback default 6 icons matching botanical-preview.html
    return [
      { platform: "linkedin", url: "https://linkedin.com", title: "LinkedIn" },
      { platform: "x", url: "https://x.com", title: "X (Twitter)" },
      { platform: "google_business", url: "https://google.com", title: "Google Reviews" },
      { platform: "youtube", url: "https://youtube.com", title: "YouTube" },
      { platform: "instagram", url: "https://instagram.com", title: "Instagram" },
      { platform: "website", url: "https://example.com", title: "Website Portal" },
    ];
  }, [custom.social_links, blocks]);

  // ── CTAs & Utilities ──
  const showSaveContact = custom.show_save_contact !== false && custom.save_contact_enabled !== false;
  const showShareProfile = custom.show_share !== false && custom.share_profile_enabled !== false;
  const showQr = custom.show_qr !== false && custom.qr_code_enabled !== false;
  const qrTitle = custom.qr_title || "Scan Business Card";
  const qrDesc = custom.qr_desc || "Instant corporate contact save & vCard";

  // ── Profile URL & Real Scannable QR Code ──
  const [mountedUrl, setMountedUrl] = useState<string>("");

  useEffect(() => {
    setMountedUrl(window.location.href);
  }, []);

  const defaultProfileUrl = profile?.primary_custom_domain
    ? `https://${profile.primary_custom_domain}/`
    : `https://digicardo.app/${profile?.username || "profile"}`;

  const profileUrl = mountedUrl || defaultProfileUrl;
  const qrTargetUrl = (custom.qr_target_url as string) || profileUrl;

  const currentPalette =
    BOTANICAL_PALETTES[activeTheme as keyof typeof BOTANICAL_PALETTES] ||
    BOTANICAL_PALETTES.sage;

  const rawPrimary = customColors.primary || currentPalette.primary;
  const qrHex = (custom.qr_color_style === "dark" ? "141D23" : rawPrimary.replace("#", ""));
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrTargetUrl)}&margin=8&color=${qrHex}`;

  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copiedQrLink, setCopiedQrLink] = useState<boolean>(false);

  const handleCopyQrLink = async () => {
    try {
      await navigator.clipboard.writeText(qrTargetUrl);
      setCopiedQrLink(true);
      setTimeout(() => setCopiedQrLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  // ── vCard Download Action ──
  const handleDownloadVCard = () => {
    const vcardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${displayName}`,
      showCompanyName && companyName ? `ORG:${companyName}` : null,
      showExecutiveRole && executiveRole ? `TITLE:${executiveRole}` : null,
      showBio && bio ? `NOTE:${bio}` : null,
      phoneVal ? `TEL;TYPE=WORK,VOICE:${phoneVal}` : null,
      emailVal ? `EMAIL;TYPE=WORK,INTERNET:${emailVal}` : null,
      websiteVal ? `URL:${websiteVal}` : null,
      "END:VCARD",
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${displayName.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Share Card Action ──
  const handleShareCard = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : qrTargetUrl;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} — ${companyName}`,
          text: bio || `Connect with ${displayName} on Digicardo`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard & modal if user cancels or browser doesn't permit
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      } catch {
        // Ignore clipboard failure
      }
    }
    // Also open the QR & Share modal for quick scanning & image save
    setShowQrModal(true);
  };

  // ── Helper to render card icon (Supports both business icons & all social media icons) ──
  const renderCardIcon = (icon?: string, url?: string) => {
    let normalized = (icon || "").toLowerCase().trim();

    // If icon is unspecified or 'auto', check if url belongs to a known platform
    if (!normalized || normalized === "auto" || normalized === "default") {
      if (url) {
        const detected = detectSocialPlatform("", url);
        if (detected && detected !== "website") {
          normalized = detected;
        }
      }
    }

    switch (normalized) {
      // ── Business & Utility Icons ──
      case "bank":
      case "payment":
      case "finance":
      case "upi":
      case "billing":
        return (
          <div className="card-icon-box icon-bank">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="21" x2="21" y2="21"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <polyline points="5 6 12 3 19 6"></polyline>
              <line x1="4" y1="10" x2="4" y2="21"></line>
              <line x1="20" y1="10" x2="20" y2="21"></line>
              <line x1="8" y1="14" x2="8" y2="17"></line>
              <line x1="12" y1="14" x2="12" y2="17"></line>
              <line x1="16" y1="14" x2="16" y2="17"></line>
            </svg>
          </div>
        );

      case "meeting":
      case "calendar":
      case "booking":
      case "consultation":
      case "schedule":
        return (
          <div className="card-icon-box icon-meeting">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        );

      case "brochure":
      case "file":
      case "pdf":
      case "download":
      case "document":
      case "doc":
        return (
          <div className="card-icon-box icon-brochure">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
        );

      case "location":
      case "map":
      case "office":
      case "headquarters":
      case "address":
        return (
          <div className="card-icon-box icon-location">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
          </div>
        );

      case "drive":
      case "vault":
      case "cloud":
        return (
          <div className="card-icon-box icon-drive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="12" x2="2" y2="12"></line>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              <line x1="6" y1="16" x2="6.01" y2="16"></line>
              <line x1="10" y1="16" x2="10.01" y2="16"></line>
            </svg>
          </div>
        );

      case "globe":
      case "website":
      case "portal":
      case "web":
        return (
          <div className="card-icon-box icon-globe">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
        );

      case "email":
      case "mail":
        return (
          <div className="card-icon-box icon-email">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        );

      case "phone":
      case "tel":
      case "call":
        return (
          <div className="card-icon-box icon-phone">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
        );

      // ── Social Media & Platform Icons ──
      case "whatsapp":
        return (
          <div className="card-icon-box icon-whatsapp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.06c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31c-.84-1.33-1.28-2.88-1.28-4.47 0-4.44 3.61-8.05 8.05-8.05 2.15 0 4.17.84 5.69 2.36 1.52 1.52 2.36 3.54 2.36 5.69 0 4.44-3.61 8.05-8.09 8.05zm4.42-6.04c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.17.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
            </svg>
          </div>
        );

      case "instagram":
      case "insta":
      case "ig":
        return (
          <div className="card-icon-box icon-instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <radialGradient id="card-ig-grad" r="150%" cx="30%" cy="107%">
                <stop stopColor="#fdf497" offset="0%" />
                <stop stopColor="#fdf497" offset="5%" />
                <stop stopColor="#fd5949" offset="45%" />
                <stop stopColor="#d6249f" offset="60%" />
                <stop stopColor="#285AEB" offset="90%" />
              </radialGradient>
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#card-ig-grad)" strokeWidth="2.2" />
              <circle cx="12" cy="12" r="4.5" stroke="url(#card-ig-grad)" strokeWidth="2.2" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="url(#card-ig-grad)" />
            </svg>
          </div>
        );

      case "linkedin":
        return (
          <div className="card-icon-box icon-linkedin">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </div>
        );

      case "x":
      case "twitter":
        return (
          <div className="card-icon-box icon-x">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="#111413">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        );

      case "youtube":
      case "yt":
        return (
          <div className="card-icon-box icon-youtube">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );

      case "facebook":
      case "fb":
        return (
          <div className="card-icon-box icon-facebook">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );

      case "tiktok":
        return (
          <div className="card-icon-box icon-tiktok">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="#010101">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.62a8.28 8.28 0 0 0 5.17 1.83V7a4.82 4.82 0 0 1-1.27-.31z" />
            </svg>
          </div>
        );

      case "telegram":
      case "tg":
        return (
          <div className="card-icon-box icon-telegram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#229ED9">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.194 1.006.131.832.942z"/>
            </svg>
          </div>
        );

      case "threads":
        return (
          <div className="card-icon-box icon-threads">
            <svg width="21" height="21" viewBox="0 0 192 192" fill="#000000">
              <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.745C75.2974 44.745 58.7423 58.0772 58.7423 85.045C58.7423 111.445 74.0044 125.745 96.222 125.745C108.647 125.745 119.52 120.916 126.792 112.186L113.882 101.428C108.435 107.579 101.534 110.021 95.8443 110.021C83.826 110.021 75.3371 100.999 75.0592 85.8753H141.62C141.691 84.4533 141.727 83.0039 141.727 81.5273C141.727 50.852 123.633 29.5 96.7963 29.5C66.1957 29.5 42.5 52.8808 42.5 86.8524C42.5 120.824 66.1957 144.205 96.7963 144.205C114.776 144.205 130.639 135.539 140.233 121.725L140.407 121.465L153.255 131.815L153.076 132.083C140.678 150.405 119.98 162.205 96.7963 162.205C54.4988 162.205 20.5 128.433 20.5 86.8524C20.5 45.2718 54.4988 11.5 96.7963 11.5C136.654 11.5 163.727 38.8687 163.727 81.5273C163.727 84.0538 163.637 86.5513 163.46 89.0189L141.537 88.9883ZM75.2917 72.8252C76.4385 61.2755 84.8143 57.545 96.5372 57.545C108.646 57.545 117.151 61.3276 118.067 72.8252H75.2917Z" />
            </svg>
          </div>
        );

      case "snapchat":
        return (
          <div className="card-icon-box icon-snapchat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFC00" stroke="#000000" strokeWidth="1.2">
              <path d="M12.002 2.5c-3.666 0-5.999 2.531-5.999 5.86 0 1.096.34 2.45.698 3.197.14.292.054.437-.183.585-.689.43-1.636.853-2.062 1.488-.344.512-.132 1.05.517 1.156.914.15 1.83.18 2.378.694.343.323.332.748.243 1.258-.09.516-.27 1.549.49 1.954.58.309 1.41-.09 2.228-.621.503-.327.971-.242 1.69-.242s1.187-.085 1.69.242c.818.531 1.648.93 2.228.621.76-.405.58-1.438.49-1.954-.089-.51-.1-.935.243-1.258.548-.514 1.464-.544 2.378-.694.649-.106.861-.644.517-1.156-.426-.635-1.373-1.058-2.062-1.488-.237-.148-.323-.293-.183-.585.358-.747.698-2.101.698-3.197 0-3.329-2.333-5.86-5.999-5.86z"/>
            </svg>
          </div>
        );

      case "pinterest":
        return (
          <div className="card-icon-box icon-pinterest">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#E60023">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.62-5.373-11.987-11.983-11.987z"/>
            </svg>
          </div>
        );

      case "spotify":
        return (
          <div className="card-icon-box icon-spotify">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1ED760">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.352-.676.463-1.028.248-2.857-1.745-6.452-2.14-10.686-1.173-.404.092-.807-.16-.899-.564-.092-.403.16-.807.564-.899 4.636-1.06 8.608-.616 11.799 1.332.354.215.465.676.25 1.056zm1.464-3.256c-.27.44-.848.577-1.288.307-3.27-2.01-8.254-2.593-12.122-1.418-.496.15-1.022-.136-1.173-.632-.15-.496.136-1.022.632-1.173 4.417-1.341 9.907-.692 13.644 1.604.44.27.577.848.307 1.312zm.126-3.393c-3.921-2.328-10.38-2.543-14.127-1.405-.6.182-1.237-.164-1.42-.764-.182-.6.164-1.237.764-1.42 4.305-1.307 11.432-1.056 15.938 1.619.539.32.716 1.02.396 1.559-.32.539-1.02.716-1.551.411z"/>
            </svg>
          </div>
        );

      case "apple_music":
      case "apple":
      case "itunes":
        return (
          <div className="card-icon-box icon-apple_music">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FA243C">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.79 1.43-.58.68-1.1 1.74-1.03 2.8 1.07.08 2.18-.55 2.81-1.36z"/>
            </svg>
          </div>
        );

      case "github":
        return (
          <div className="card-icon-box icon-github">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#24292F">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>
        );

      case "discord":
        return (
          <div className="card-icon-box icon-discord">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
        );

      case "reddit":
        return (
          <div className="card-icon-box icon-reddit">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF4500">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
          </div>
        );

      case "twitch":
        return (
          <div className="card-icon-box icon-twitch">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#9146FF">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
          </div>
        );

      case "behance":
        return (
          <div className="card-icon-box icon-behance">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1769FF">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.401 0-5.755-2.168-5.755-5.999 0-3.964 2.48-6.001 5.677-6.001 3.52 0 5.324 2.378 4.976 6.329h-7.618c.084 1.776 1.348 2.651 2.822 2.651 1.277 0 2.108-.609 2.502-1.393l2.367 1.413zm-7.666-4.999h4.743c-.11-1.428-.908-2.033-2.315-2.033-1.429 0-2.281.696-2.428 2.033zm-9.06-8.001h-7v16h7.027c3.961 0 6.007-1.97 6.007-5.008 0-1.895-.97-3.42-2.585-4.048 1.264-.593 1.954-1.849 1.954-3.321 0-2.585-1.921-3.623-5.403-3.623zm-4 3h3.044c1.464 0 2.456.49 2.456 1.748 0 1.27-.992 1.752-2.456 1.752h-3.044v-3.5zm0 6h3.407c1.699 0 2.836.568 2.836 2.052 0 1.545-1.137 2.048-2.836 2.048h-3.407v-4.1z"/>
            </svg>
          </div>
        );

      case "dribbble":
        return (
          <div className="card-icon-box icon-dribbble">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#EA4C89">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.18 10.428c-.244-.047-2.373-.448-4.739-.089.444-1.229.805-2.483 1.077-3.738 2.072 1.036 3.398 2.377 3.662 3.827zm-5.751-4.764c-.266 1.205-.618 2.413-1.047 3.593-2.613-.865-5.592-1.332-8.818-1.397.949-1.748 2.417-3.155 4.22-3.992 2.052.413 4.025 1.032 5.645 1.796zm-11.874 3.731c3.15.064 6.06.52 8.625 1.368-.45 1.229-.982 2.42-1.597 3.551-3.619-1.157-7.238-.854-10.74.871.299-2.227 1.681-4.168 3.712-5.79zm-.654 7.747c3.4-.1.749 6.84-.969 10.435.152.492.894.945 1.802 1.344 2.632-1.686 4.385-4.52 4.49-7.781-5.323-.105-10.518 1.488-14.737 4.542.42 1.353 1.272 2.493 2.414 3.253zm9.645 5.097c-1.872.934-4.004 1.461-6.262 1.461-.418 0-.832-.018-1.242-.054 3.876-2.825 8.697-4.296 13.626-4.202-.676 1.246-1.596 2.336-2.697 3.208-1.078.683-2.26 1.189-3.425-1.587zm2.441-2.909c-4.593-.086-9.102 1.289-12.74 3.914-.522-.962-.871-2.029-.993-3.161 3.238-1.611 6.579-1.895 9.923-.812.569-1.05 1.063-2.155 1.482-3.292 2.193-.332 4.168.04 4.394.086.014.152.021.306.021.462 0 1.037-.193 2.028-.548 2.936-.462-.059-.979-.115-1.539-.133z"/>
            </svg>
          </div>
        );

      case "medium":
        return (
          <div className="card-icon-box icon-medium">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
          </div>
        );

      case "quora":
        return (
          <div className="card-icon-box icon-quora">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#B92B27">
              <path d="M12.015 0C5.378 0 0 5.378 0 12.015c0 5.093 3.176 9.445 7.668 11.192.176-.569.362-1.395.409-1.921-2.915-1.466-4.838-4.502-4.838-8.04 0-5.074 3.93-9.191 8.776-9.191 4.846 0 8.776 4.117 8.776 9.191 0 4.636-3.284 8.487-7.618 9.102l1.603 2.825c.196.347.534.568.932.568.049 0 .099-.004.148-.011C18.995 24.375 24 18.784 24 12.015 24 5.378 18.622 0 12.015 0z"/>
            </svg>
          </div>
        );

      case "google_business":
      case "google":
      case "google_reviews":
        return (
          <div className="card-icon-box icon-google">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
          </div>
        );

      case "google_maps":
      case "maps":
        return (
          <div className="card-icon-box icon-google_maps">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
          </div>
        );

      case "services":
      case "briefcase":
      case "portfolio":
      case "corporate":
      case "company":
      default:
        return (
          <div className="card-icon-box icon-services">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        );
    }
  };

  // ── Helper to render social pills row (Adaptive sizing + Authentic platform SVG icons) ──
  const renderSocialPillsRow = () => {
    if (!socialLinks || socialLinks.length === 0) return null;

    const total = socialLinks.length;
    // Dynamic sizing based on number of icons:
    // 1 - 3 icons: Large, comfortable hero pills (52px pill, 26px icon, 14px gap)
    // 4 - 5 icons: Standard sleek pills (48px pill, 24px icon, 12px gap)
    // 6 icons: Compact pills (44px pill, 22px icon, 10px gap)
    // 7 - 8 icons: Fitted pills (40px pill, 20px icon, 8px gap)
    // 9 - 10 icons: Mini pills (36px pill, 18px icon, 8px gap)
    // 11+ icons: Micro pills (34px pill, 17px icon, 6px gap)
    let pillSize = 44;
    let iconSize = 22;
    let gapSize = 10;

    if (total <= 3) {
      pillSize = 52;
      iconSize = 26;
      gapSize = 14;
    } else if (total <= 5) {
      pillSize = 48;
      iconSize = 24;
      gapSize = 12;
    } else if (total <= 6) {
      pillSize = 44;
      iconSize = 22;
      gapSize = 10;
    } else if (total <= 8) {
      pillSize = 40;
      iconSize = 20;
      gapSize = 8;
    } else if (total <= 10) {
      pillSize = 36;
      iconSize = 18;
      gapSize = 8;
    } else {
      pillSize = 34;
      iconSize = 17;
      gapSize = 6;
    }

    return (
      <section className="social-row" style={{ gap: `${gapSize}px` }}>
        {socialLinks.map((s, idx) => {
          let iconSvg: React.ReactNode = null;
          const platform = (s.platform || "").toLowerCase();

          switch (platform) {
            case "linkedin":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              );
              break;

            case "x":
            case "twitter":
              iconSvg = (
                <svg width={Math.round(iconSize * 0.85)} height={Math.round(iconSize * 0.85)} viewBox="0 0 24 24" fill="#111413">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              );
              break;

            case "instagram":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
                  <radialGradient id={`ig-grad-${idx}`} r="150%" cx="30%" cy="107%">
                    <stop stopColor="#fdf497" offset="0%" />
                    <stop stopColor="#fdf497" offset="5%" />
                    <stop stopColor="#fd5949" offset="45%" />
                    <stop stopColor="#d6249f" offset="60%" />
                    <stop stopColor="#285AEB" offset="90%" />
                  </radialGradient>
                  <rect x="2" y="2" width="20" height="20" rx="6" stroke={`url(#ig-grad-${idx})`} strokeWidth="2.2" />
                  <circle cx="12" cy="12" r="4.5" stroke={`url(#ig-grad-${idx})`} strokeWidth="2.2" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill={`url(#ig-grad-${idx})`} />
                </svg>
              );
              break;

            case "whatsapp":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#25D366">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.06c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31c-.84-1.33-1.28-2.88-1.28-4.47 0-4.44 3.61-8.05 8.05-8.05 2.15 0 4.17.84 5.69 2.36 1.52 1.52 2.36 3.54 2.36 5.69 0 4.44-3.61 8.05-8.09 8.05zm4.42-6.04c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.17.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
                </svg>
              );
              break;

            case "google_business":
            case "google":
            case "google_reviews":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              );
              break;

            case "youtube":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              );
              break;

            case "facebook":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              );
              break;

            case "telegram":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#229ED9">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.194 1.006.131.832.942z"/>
                </svg>
              );
              break;

            case "github":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#24292F">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              );
              break;

            case "tiktok":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#010101">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.62a8.28 8.28 0 0 0 5.17 1.83V7a4.82 4.82 0 0 1-1.27-.31z" />
                </svg>
              );
              break;

            case "threads":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 192 192" fill="#000000">
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.745C75.2974 44.745 58.7423 58.0772 58.7423 85.045C58.7423 111.445 74.0044 125.745 96.222 125.745C108.647 125.745 119.52 120.916 126.792 112.186L113.882 101.428C108.435 107.579 101.534 110.021 95.8443 110.021C83.826 110.021 75.3371 100.999 75.0592 85.8753H141.62C141.691 84.4533 141.727 83.0039 141.727 81.5273C141.727 50.852 123.633 29.5 96.7963 29.5C66.1957 29.5 42.5 52.8808 42.5 86.8524C42.5 120.824 66.1957 144.205 96.7963 144.205C114.776 144.205 130.639 135.539 140.233 121.725L140.407 121.465L153.255 131.815L153.076 132.083C140.678 150.405 119.98 162.205 96.7963 162.205C54.4988 162.205 20.5 128.433 20.5 86.8524C20.5 45.2718 54.4988 11.5 96.7963 11.5C136.654 11.5 163.727 38.8687 163.727 81.5273C163.727 84.0538 163.637 86.5513 163.46 89.0189L141.537 88.9883ZM75.2917 72.8252C76.4385 61.2755 84.8143 57.545 96.5372 57.545C108.646 57.545 117.151 61.3276 118.067 72.8252H75.2917Z" />
                </svg>
              );
              break;

            case "snapchat":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FFFC00" stroke="#000000" strokeWidth="1.2">
                  <path d="M12.002 2.5c-3.666 0-5.999 2.531-5.999 5.86 0 1.096.34 2.45.698 3.197.14.292.054.437-.183.585-.689.43-1.636.853-2.062 1.488-.344.512-.132 1.05.517 1.156.914.15 1.83.18 2.378.694.343.323.332.748.243 1.258-.09.516-.27 1.549.49 1.954.58.309 1.41-.09 2.228-.621.503-.327.971-.242 1.69-.242s1.187-.085 1.69.242c.818.531 1.648.93 2.228.621.76-.405.58-1.438.49-1.954-.089-.51-.1-.935.243-1.258.548-.514 1.464-.544 2.378-.694.649-.106.861-.644.517-1.156-.426-.635-1.373-1.058-2.062-1.488-.237-.148-.323-.293-.183-.585.358-.747.698-2.101.698-3.197 0-3.329-2.333-5.86-5.999-5.86z"/>
                </svg>
              );
              break;

            case "pinterest":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#E60023">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.62-5.373-11.987-11.983-11.987z"/>
                </svg>
              );
              break;

            case "spotify":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#1ED760">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.352-.676.463-1.028.248-2.857-1.745-6.452-2.14-10.686-1.173-.404.092-.807-.16-.899-.564-.092-.403.16-.807.564-.899 4.636-1.06 8.608-.616 11.799 1.332.354.215.465.676.25 1.056zm1.464-3.256c-.27.44-.848.577-1.288.307-3.27-2.01-8.254-2.593-12.122-1.418-.496.15-1.022-.136-1.173-.632-.15-.496.136-1.022.632-1.173 4.417-1.341 9.907-.692 13.644 1.604.44.27.577.848.307 1.312zm.126-3.393c-3.921-2.328-10.38-2.543-14.127-1.405-.6.182-1.237-.164-1.42-.764-.182-.6.164-1.237.764-1.42 4.305-1.307 11.432-1.056 15.938 1.619.539.32.716 1.02.396 1.559-.32.539-1.02.716-1.551.411z"/>
                </svg>
              );
              break;

            case "apple_music":
            case "apple":
            case "itunes":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FA243C">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.79 1.43-.58.68-1.1 1.74-1.03 2.8 1.07.08 2.18-.55 2.81-1.36z"/>
                </svg>
              );
              break;

            case "discord":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              );
              break;

            case "reddit":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FF4500">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              );
              break;

            case "twitch":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#9146FF">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              );
              break;

            case "behance":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#1769FF">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.401 0-5.755-2.168-5.755-5.999 0-3.964 2.48-6.001 5.677-6.001 3.52 0 5.324 2.378 4.976 6.329h-7.618c.084 1.776 1.348 2.651 2.822 2.651 1.277 0 2.108-.609 2.502-1.393l2.367 1.413zm-7.666-4.999h4.743c-.11-1.428-.908-2.033-2.315-2.033-1.429 0-2.281.696-2.428 2.033zm-9.06-8.001h-7v16h7.027c3.961 0 6.007-1.97 6.007-5.008 0-1.895-.97-3.42-2.585-4.048 1.264-.593 1.954-1.849 1.954-3.321 0-2.585-1.921-3.623-5.403-3.623zm-4 3h3.044c1.464 0 2.456.49 2.456 1.748 0 1.27-.992 1.752-2.456 1.752h-3.044v-3.5zm0 6h3.407c1.699 0 2.836.568 2.836 2.052 0 1.545-1.137 2.048-2.836 2.048h-3.407v-4.1z"/>
                </svg>
              );
              break;

            case "dribbble":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#EA4C89">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.18 10.428c-.244-.047-2.373-.448-4.739-.089.444-1.229.805-2.483 1.077-3.738 2.072 1.036 3.398 2.377 3.662 3.827zm-5.751-4.764c-.266 1.205-.618 2.413-1.047 3.593-2.613-.865-5.592-1.332-8.818-1.397.949-1.748 2.417-3.155 4.22-3.992 2.052.413 4.025 1.032 5.645 1.796zm-11.874 3.731c3.15.064 6.06.52 8.625 1.368-.45 1.229-.982 2.42-1.597 3.551-3.619-1.157-7.238-.854-10.74.871.299-2.227 1.681-4.168 3.712-5.79zm-.654 7.747c3.4-.1.749 6.84-.969 10.435.152.492.894.945 1.802 1.344 2.632-1.686 4.385-4.52 4.49-7.781-5.323-.105-10.518 1.488-14.737 4.542.42 1.353 1.272 2.493 2.414 3.253zm9.645 5.097c-1.872.934-4.004 1.461-6.262 1.461-.418 0-.832-.018-1.242-.054 3.876-2.825 8.697-4.296 13.626-4.202-.676 1.246-1.596 2.336-2.697 3.208-1.078.683-2.26 1.189-3.425-1.587zm2.441-2.909c-4.593-.086-9.102 1.289-12.74 3.914-.522-.962-.871-2.029-.993-3.161 3.238-1.611 6.579-1.895 9.923-.812.569-1.05 1.063-2.155 1.482-3.292 2.193-.332 4.168.04 4.394.086.014.152.021.306.021.462 0 1.037-.193 2.028-.548 2.936-.462-.059-.979-.115-1.539-.133z"/>
                </svg>
              );
              break;

            case "medium":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#000000">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              );
              break;

            case "quora":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#B92B27">
                  <path d="M12.015 0C5.378 0 0 5.378 0 12.015c0 5.093 3.176 9.445 7.668 11.192.176-.569.362-1.395.409-1.921-2.915-1.466-4.838-4.502-4.838-8.04 0-5.074 3.93-9.191 8.776-9.191 4.846 0 8.776 4.117 8.776 9.191 0 4.636-3.284 8.487-7.618 9.102l1.603 2.825c.196.347.534.568.932.568.049 0 .099-.004.148-.011C18.995 24.375 24 18.784 24 12.015 24 5.378 18.622 0 12.015 0z"/>
                </svg>
              );
              break;

            case "google_maps":
            case "maps":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
              );
              break;

            case "email":
            case "mail":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#2D7A58" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              );
              break;

            case "phone":
            case "tel":
            case "call":
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#2D7A58" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              );
              break;

            case "website":
            case "portal":
            case "web":
            default:
              iconSvg = (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#2D7A58" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              );
              break;
          }

          return (
            <a
              key={(s.platform || "social") + s.url + idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill"
              title={s.title}
              style={{
                width: `${pillSize}px`,
                height: `${pillSize}px`,
              }}
            >
              {iconSvg}
            </a>
          );
        })}
      </section>
    );
  };

  // ── Custom color overrides applied via CSS variables ──
  const customCssVars: React.CSSProperties = {
    ...(customColors.primary
      ? {
          "--primary-color": customColors.primary,
          "--shape-color": customColors.primary,
          "--leaf-top-grad2": customColors.primary,
          "--leaf-top-grad4": customColors.primary,
          "--leaf-bot2": customColors.primary,
        }
      : {}),
    ...(customColors.secondary
      ? {
          "--shape-color-sec": customColors.secondary,
          "--leaf-top-grad1": customColors.secondary,
          "--leaf-top-grad3": customColors.secondary,
          "--leaf-bot1": customColors.secondary,
        }
      : {}),
    ...(customColors.background ? { "--canvas-bg": customColors.background } : {}),
    ...(customColors.text ? { "--text-main": customColors.text } : {}),
    ...(customColors.accent ? { "--quick-action-primary": customColors.accent } : {}),
  } as React.CSSProperties;

  return (
    <>
      {/* ─── 1:1 EMBEDDED STYLESHEET DIRECT FROM BOTANICAL-PREVIEW.HTML ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

        .botanical-page-wrapper {
          background-color: #D6D1C9;
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
          color: #1A1F1C;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding: 24px 16px 60px;
          transition: background-color 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .preview-container {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          position: relative;
        }

        /* ─── Mobile Viewport & In-Phone Preview Adaptations ─── */
        .in-phone-frame .botanical-page-wrapper,
        @media (max-width: 540px) {
          .botanical-page-wrapper {
            background-color: var(--canvas-bg, #F4EFEB) !important;
            padding: 0 !important;
            min-height: 100% !important;
            display: block !important;
          }
          .preview-container {
            max-width: 100% !important;
            margin: 0 !important;
          }
        }

        /* ─── THEME PALETTES ─── */
        .card-canvas.theme-sage {
          --canvas-bg: #F4EFEB;
          --text-main: #141A17;
          --text-sub: #4A564F;
          --primary-color: #2D4A3E;
          --primary-hover: #223930;
          --primary-card-text: #FFFFFF;
          --primary-card-sub: #D2DCD5;
          --shape-color: #355346;
          --shape-color-sec: #7B9487;
          --shape-bot-bg: #E2D7C9;
          --leaf-stem: #1E3028;
          --leaf-top-grad1: #4A6E5D;
          --leaf-top-grad2: #2E4C3E;
          --leaf-top-grad3: #638B76;
          --leaf-top-grad4: #3E6050;
          --leaf-bot1: #3B5A4B;
          --leaf-bot2: #284034;
          --quick-action-primary: #7FD79E;
          --quick-action-primary-txt: #143821;
        }

        .card-canvas.theme-navy {
          --canvas-bg: #F2F5F8;
          --text-main: #0F172A;
          --text-sub: #475569;
          --primary-color: #1E3A8A;
          --primary-hover: #172554;
          --primary-card-text: #FFFFFF;
          --primary-card-sub: #BFDBFE;
          --shape-color: #1E3A8A;
          --shape-color-sec: #60A5FA;
          --shape-bot-bg: #DCE6F2;
          --leaf-stem: #0F172A;
          --leaf-top-grad1: #3B82F6;
          --leaf-top-grad2: #1D4ED8;
          --leaf-top-grad3: #60A5FA;
          --leaf-top-grad4: #2563EB;
          --leaf-bot1: #1E40AF;
          --leaf-bot2: #172554;
          --quick-action-primary: #93C5FD;
          --quick-action-primary-txt: #0F172A;
        }

        .card-canvas.theme-gold {
          --canvas-bg: #F7F7F8;
          --text-main: #11141D;
          --text-sub: #475569;
          --primary-color: #11141D;
          --primary-hover: #000000;
          --primary-card-text: #F8FAFC;
          --primary-card-sub: #D4AF37;
          --shape-color: #11141D;
          --shape-color-sec: #C5A059;
          --shape-bot-bg: #EBE7DD;
          --leaf-stem: #8C6D2B;
          --leaf-top-grad1: #D4AF37;
          --leaf-top-grad2: #9E7D23;
          --leaf-top-grad3: #E6C86E;
          --leaf-top-grad4: #B89028;
          --leaf-bot1: #8C753D;
          --leaf-bot2: #5E4E24;
          --quick-action-primary: #ECDCA8;
          --quick-action-primary-txt: #382D08;
        }

        .card-canvas.theme-terracotta {
          --canvas-bg: #FAF6F2;
          --text-main: #241611;
          --text-sub: #5C433A;
          --primary-color: #8C3E24;
          --primary-hover: #702E19;
          --primary-card-text: #FFFFFF;
          --primary-card-sub: #F7D5C9;
          --shape-color: #8C3E24;
          --shape-color-sec: #DE957D;
          --shape-bot-bg: #F4DFD5;
          --leaf-stem: #481B0E;
          --leaf-top-grad1: #BD5B39;
          --leaf-top-grad2: #843217;
          --leaf-top-grad3: #D37D60;
          --leaf-top-grad4: #9A4122;
          --leaf-bot1: #943F24;
          --leaf-bot2: #6B2914;
          --quick-action-primary: #FDBFA8;
          --quick-action-primary-txt: #4E1E0F;
        }

        .card-canvas.theme-charcoal {
          --canvas-bg: #F4F4F5;
          --text-main: #09090B;
          --text-sub: #52525B;
          --primary-color: #27272A;
          --primary-hover: #18181B;
          --primary-card-text: #FAFAFA;
          --primary-card-sub: #A1A1AA;
          --shape-color: #27272A;
          --shape-color-sec: #A1A1AA;
          --shape-bot-bg: #E4E4E7;
          --leaf-stem: #18181B;
          --leaf-top-grad1: #52525B;
          --leaf-top-grad2: #27272A;
          --leaf-top-grad3: #71717A;
          --leaf-top-grad4: #3F3F46;
          --leaf-bot1: #3F3F46;
          --leaf-bot2: #18181B;
          --quick-action-primary: #D4D4D8;
          --quick-action-primary-txt: #18181B;
        }

        /* ─── Template Card Canvas ─── */
        .card-canvas {
          position: relative;
          background: var(--canvas-bg);
          border-radius: 46px;
          box-shadow: 0 30px 70px -12px rgba(45, 52, 48, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.85);
          overflow: hidden;
          padding: 24px 22px 36px;
          display: flex;
          flex-direction: column;
          transition: background 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .in-phone-frame .card-canvas,
        @media (max-width: 540px) {
          .card-canvas {
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
            padding: 18px 16px 44px !important;
            min-height: 100% !important;
          }
        }

        /* ─── 10 BACKGROUND STYLES ─── */

        /* 1. Botanical */
        .bg-shape-top-right {
          position: absolute;
          top: -25px;
          right: -30px;
          width: 250px;
          height: 285px;
          background: radial-gradient(ellipse at 80% 20%, var(--shape-color) 0%, var(--shape-color) 75%, transparent 100%);
          border-radius: 45% 25% 65% 35% / 30% 65% 35% 70%;
          opacity: 0.92;
          pointer-events: none;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .bg-shape-top-secondary {
          position: absolute;
          top: -40px;
          right: 55px;
          width: 155px;
          height: 175px;
          background: var(--shape-color-sec);
          border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%;
          opacity: 0.30;
          pointer-events: none;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .bg-leaf-top-right {
          position: absolute;
          top: 8px;
          right: -12px;
          width: 205px;
          height: auto;
          pointer-events: none;
          z-index: 2;
          filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.14));
          transition: all 0.3s ease;
        }
        .bg-shape-bottom-left {
          position: absolute;
          bottom: -60px;
          left: -70px;
          width: 250px;
          height: 310px;
          background: radial-gradient(ellipse at 30% 70%, var(--shape-bot-bg) 0%, var(--shape-bot-bg) 65%, transparent 100%);
          border-radius: 40% 60% 70% 30% / 60% 40% 50% 50%;
          opacity: 0.85;
          pointer-events: none;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .bg-leaf-bottom-left {
          position: absolute;
          bottom: -20px;
          left: -25px;
          width: 190px;
          height: auto;
          pointer-events: none;
          z-index: 3;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
          transition: all 0.3s ease;
        }

        /* 2. Geometric Architectural */
        .bg-layer-geometric {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .geo-grid {
          position: absolute;
          top: 0; right: 0;
          width: 260px; height: 260px;
          background-image: radial-gradient(var(--shape-color) 1.2px, transparent 1.2px);
          background-size: 16px 16px;
          opacity: 0.25;
          mask-image: radial-gradient(circle at 100% 0%, black 50%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 100% 0%, black 50%, transparent 80%);
        }
        .geo-corner-band {
          position: absolute;
          top: -80px; right: -80px;
          width: 240px; height: 240px;
          border-radius: 48px;
          background: linear-gradient(135deg, var(--shape-color) 0%, transparent 70%);
          opacity: 0.85;
          transform: rotate(45deg);
        }
        .geo-accent-line {
          position: absolute;
          top: 140px; right: 0;
          width: 140px; height: 3px;
          background: linear-gradient(90deg, transparent, var(--shape-color-sec));
        }
        .geo-bottom-band {
          position: absolute;
          bottom: -70px; left: -70px;
          width: 200px; height: 200px;
          border-radius: 40px;
          background: linear-gradient(315deg, var(--shape-color) 0%, transparent 75%);
          opacity: 0.4;
          transform: rotate(45deg);
        }

        /* 3. Topographic Contours */
        .bg-layer-topo {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .topo-svg-top {
          position: absolute;
          top: -20px; right: -20px;
          width: 260px; height: auto;
          opacity: 0.65;
        }
        .topo-svg-bot {
          position: absolute;
          bottom: -20px; left: -20px;
          width: 230px; height: auto;
          opacity: 0.55;
        }

        /* 4. Ambient Aura */
        .bg-layer-aura {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .aura-orb-1 {
          position: absolute;
          top: -30px; right: -30px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--shape-color) 0%, transparent 70%);
          filter: blur(24px);
          opacity: 0.75;
        }
        .aura-orb-2 {
          position: absolute;
          bottom: 20px; left: -40px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--shape-color-sec) 0%, transparent 70%);
          filter: blur(28px);
          opacity: 0.55;
        }

        /* 5. Minimalist Executive */
        .bg-layer-minimal {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .min-accent-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--primary-color) 0%, var(--shape-color-sec) 100%);
        }

        /* 6. Luxury Marble */
        .bg-layer-marble {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .marble-cloud-top {
          position: absolute;
          top: -30px; right: -30px;
          width: 250px; height: 250px;
          background: radial-gradient(ellipse at center, var(--shape-color) 0%, transparent 70%);
          opacity: 0.18;
          filter: blur(25px);
        }
        .marble-cloud-bot {
          position: absolute;
          bottom: -40px; left: -40px;
          width: 240px; height: 240px;
          background: radial-gradient(ellipse at center, var(--shape-color-sec) 0%, transparent 70%);
          opacity: 0.22;
          filter: blur(28px);
        }
        .marble-svg-top {
          position: absolute;
          top: -10px; right: -15px;
          width: 250px; height: auto;
          opacity: 0.85;
        }
        .marble-svg-bot {
          position: absolute;
          bottom: -15px; left: -15px;
          width: 230px; height: auto;
          opacity: 0.8;
        }

        /* 7. Tech Matrix */
        .bg-layer-tech {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .tech-svg-top {
          position: absolute;
          top: -15px; right: -15px;
          width: 245px; height: auto;
          opacity: 0.85;
        }
        .tech-svg-bot {
          position: absolute;
          bottom: -15px; left: -15px;
          width: 230px; height: auto;
          opacity: 0.8;
        }

        /* 8. Frosted Glass */
        .bg-layer-frosted {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .frost-prism-top {
          position: absolute;
          top: -45px; right: -45px;
          width: 230px; height: 230px;
          border-radius: 44px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.65);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06), inset 0 0 20px rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transform: rotate(28deg);
          opacity: 0.92;
        }
        .frost-prism-glow {
          position: absolute;
          top: -15px; right: -15px;
          width: 170px; height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--shape-color) 0%, transparent 70%);
          opacity: 0.4;
          filter: blur(18px);
        }
        .frost-prism-bot {
          position: absolute;
          bottom: -55px; left: -55px;
          width: 215px; height: 215px;
          border-radius: 40px;
          background: linear-gradient(315deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.06) 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.05), inset 0 0 18px rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transform: rotate(-24deg);
          opacity: 0.88;
        }

        /* 9. Silk Ribbon Wave */
        .bg-layer-silk {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .silk-svg-top {
          position: absolute;
          top: -20px; right: -20px;
          width: 255px; height: auto;
          opacity: 0.88;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.08));
        }
        .silk-svg-bot {
          position: absolute;
          bottom: -20px; left: -20px;
          width: 235px; height: auto;
          opacity: 0.82;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.06));
        }

        /* 10. Bauhaus Modern */
        .bg-layer-bauhaus {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .bauhaus-top {
          position: absolute;
          top: -10px; right: -10px;
          width: 235px; height: auto;
          opacity: 0.88;
        }
        .bauhaus-bot {
          position: absolute;
          bottom: -15px; left: -15px;
          width: 215px; height: auto;
          opacity: 0.8;
        }

        /* Layer Visibility */
        .bg-layer-botanical,
        .bg-layer-geometric,
        .bg-layer-topo,
        .bg-layer-aura,
        .bg-layer-minimal,
        .bg-layer-marble,
        .bg-layer-tech,
        .bg-layer-frosted,
        .bg-layer-silk,
        .bg-layer-bauhaus {
          display: none;
        }

        .card-canvas.bg-botanical .bg-layer-botanical { display: block; }
        .card-canvas.bg-geometric .bg-layer-geometric { display: block; }
        .card-canvas.bg-topo .bg-layer-topo { display: block; }
        .card-canvas.bg-aura .bg-layer-aura { display: block; }
        .card-canvas.bg-minimal .bg-layer-minimal { display: block; }
        .card-canvas.bg-marble .bg-layer-marble { display: block; }
        .card-canvas.bg-tech .bg-layer-tech { display: block; }
        .card-canvas.bg-frosted .bg-layer-frosted { display: block; }
        .card-canvas.bg-silk .bg-layer-silk { display: block; }
        .card-canvas.bg-bauhaus .bg-layer-bauhaus { display: block; }

        /* ─── Header: Brand & Menu ─── */
        .top-header {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          user-select: none;
          transition: transform 0.2s ease;
        }
        .brand-logo:hover {
          transform: scale(1.02);
        }
        .brand-logo-badge {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .brand-name {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--text-main);
        }
        .brand-accent {
          color: var(--primary-color);
          font-weight: 900;
          transition: color 0.3s ease;
        }

        .btn-share-top {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }
        .btn-share-top:hover {
          background: #FFFFFF;
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
        }
        .btn-share-top:active {
          transform: scale(0.97);
        }
        .btn-share-top svg {
          width: 13px;
          height: 13px;
          display: block;
          flex-shrink: 0;
        }

        /* ─── Profile Hero Section ─── */
        .profile-hero {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 22px;
        }
        .avatar-wrapper {
          position: relative;
          width: 124px;
          height: 124px;
          margin-top: 4px;
          margin-bottom: 16px;
        }
        .avatar-ring {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 4px;
          background: #FFFFFF;
          box-shadow: 0 10px 30px rgba(36, 45, 39, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          background: #D9DFDA;
        }
        .status-dot {
          position: absolute;
          bottom: 6px;
          right: 8px;
          width: 17px;
          height: 17px;
          background: #22C55E;
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .profile-name-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .profile-name {
          font-size: 1.62rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
        }
        .verified-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 19px;
          height: 19px;
          background: #2563EB;
          border-radius: 50%;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        .verified-badge svg {
          width: 11px;
          height: 11px;
          fill: #FFFFFF;
        }

        .profile-company {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .profile-role-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .profile-role-divider .line {
          width: 24px;
          height: 1.5px;
          background: #AFA496;
          opacity: 0.6;
        }
        .profile-role {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: var(--text-sub);
          text-transform: uppercase;
        }

        .profile-bio {
          font-size: 0.90rem;
          color: var(--text-main);
          font-weight: 600;
          line-height: 1.55;
          max-width: 320px;
          margin: 0 auto 14px;
          text-align: center;
          position: relative;
          z-index: 20;
        }

        .trust-badges-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-main);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        .trust-badge svg {
          width: 12px;
          height: 12px;
          color: #10B981;
        }

        /* ─── 4 Quick Actions Row ─── */
        .action-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 22px;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          cursor: pointer;
          min-width: 0;
        }
        .action-btn {
          width: 52px;
          height: 52px;
          max-width: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }
        .action-item:hover .action-btn {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
        .action-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          text-align: center;
          display: block;
        }
        .action-btn.green {
          background: var(--quick-action-primary);
          color: var(--quick-action-primary-txt);
        }
        .action-btn.mint {
          background: #A0E6BA;
          color: #164326;
        }
        .action-btn.coral {
          background: #FFB3AF;
          color: #5A1E1C;
        }
        .action-btn.blue {
          background: #A3D3FF;
          color: #10385F;
        }
        .action-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        /* ─── Content Link Cards Stack ─── */
        .cards-stack {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .card-item {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
          position: relative;
          background: #FFFFFF;
          box-shadow: 0 4px 18px rgba(36, 45, 39, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-sizing: border-box;
        }
        .card-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(36, 45, 39, 0.09);
        }

        .card-item.featured {
          background: var(--primary-color);
          color: var(--primary-card-text);
          border: none;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
        }
        .card-item.featured .card-title {
          color: var(--primary-card-text);
        }
        .card-item.featured .card-subtitle {
          color: var(--primary-card-sub);
        }
        .card-item.featured .card-icon-box {
          background: rgba(255, 255, 255, 0.18);
          color: #FFFFFF;
        }
        .card-item.featured .card-icon-box.icon-x svg,
        .card-item.featured .card-icon-box.icon-tiktok svg,
        .card-item.featured .card-icon-box.icon-threads svg,
        .card-item.featured .card-icon-box.icon-github svg,
        .card-item.featured .card-icon-box.icon-medium svg {
          fill: #FFFFFF !important;
        }
        .card-item.featured .card-arrow {
          color: var(--primary-card-sub);
        }

        .card-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 14px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .card-item:hover .card-icon-box {
          transform: scale(1.05);
        }

        .icon-services {
          background: #EBF2ED;
          color: #2D7A58;
        }
        .icon-bank {
          background: #FEF3C7;
          color: #B45309;
        }
        .icon-brochure {
          background: #E0E7FF;
          color: #4338CA;
        }
        .icon-meeting {
          background: #FEE7DE;
          color: #E65A2E;
        }
        .icon-location {
          background: #F2E8FA;
          color: #9C45DF;
        }
        .icon-drive {
          background: #E8F0FE;
          color: #1967D2;
        }
        .icon-globe {
          background: #E2E8F0;
          color: #334155;
        }
        .icon-whatsapp {
          background: #DCFCE7;
          color: #16A34A;
        }
        .icon-instagram {
          background: #FDF2F8;
          color: #DB2777;
        }
        .icon-linkedin {
          background: #E0F2FE;
          color: #0284C7;
        }
        .icon-x {
          background: #F3F4F6;
          color: #111827;
        }
        .icon-youtube {
          background: #FEE2E2;
          color: #DC2626;
        }
        .icon-facebook {
          background: #DBEAFE;
          color: #2563EB;
        }
        .icon-tiktok {
          background: #F3F4F6;
          color: #111827;
        }
        .icon-telegram {
          background: #E0F2FE;
          color: #0284C7;
        }
        .icon-threads {
          background: #F3F4F6;
          color: #111827;
        }
        .icon-snapchat {
          background: #FEF9C3;
          color: #CA8A04;
        }
        .icon-pinterest {
          background: #FEE2E2;
          color: #E60023;
        }
        .icon-spotify {
          background: #DCFCE7;
          color: #16A34A;
        }
        .icon-apple_music {
          background: #FFE4E6;
          color: #E11D48;
        }
        .icon-github {
          background: #F3F4F6;
          color: #1F2937;
        }
        .icon-discord {
          background: #EDE9FE;
          color: #5865F2;
        }
        .icon-reddit {
          background: #FFEDD5;
          color: #EA580C;
        }
        .icon-twitch {
          background: #F3E8FF;
          color: #9333EA;
        }
        .icon-behance {
          background: #DBEAFE;
          color: #1769FF;
        }
        .icon-dribbble {
          background: #FDF2F8;
          color: #EA4C89;
        }
        .icon-medium {
          background: #F3F4F6;
          color: #111827;
        }
        .icon-quora {
          background: #FEE2E2;
          color: #B92B27;
        }
        .icon-google {
          background: #FEF3C7;
          color: #EA4335;
        }
        .icon-google_maps {
          background: #FEE2E2;
          color: #EA4335;
        }
        .icon-email {
          background: #E0F2FE;
          color: #0284C7;
        }
        .icon-phone {
          background: #DCFCE7;
          color: #16A34A;
        }

        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
          min-width: 0;
        }
        .card-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.01em;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-subtitle {
          font-size: 0.74rem;
          color: #728178;
          font-weight: 500;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-arrow {
          color: #333F38;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* ─── Social Row ─── */
        .social-row {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 22px;
          padding: 0 4px;
        }
        .social-pill {
          border-radius: 50%;
          background: #FFFFFF;
          box-shadow: 0 4px 14px rgba(36, 45, 39, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }
        .social-pill:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 8px 22px rgba(36, 45, 39, 0.15);
        }

        /* ─── Primary Dual CTA ─── */
        .cta-row {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .btn-save-contact {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 16px;
          background: var(--primary-color);
          color: #FFFFFF;
          border-radius: 26px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        .btn-save-contact:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }
        .btn-share-profile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 16px;
          background: #FFFFFF;
          color: var(--text-main);
          border-radius: 26px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          border: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(36, 45, 39, 0.05);
          transition: all 0.2s ease;
        }
        .btn-share-profile:hover {
          background: #FAF8F5;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(36, 45, 39, 0.09);
        }

        /* ─── QR Code Card ─── */
        .qr-card {
          position: relative;
          z-index: 10;
          background: #FFFFFF;
          border-radius: 22px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 18px rgba(36, 45, 39, 0.04);
          margin-bottom: 28px;
          box-sizing: border-box;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          border: 1px solid #ECE7E1;
        }
        .qr-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(36, 45, 39, 0.08);
          border-color: var(--primary);
        }
        .qr-box {
          width: 72px;
          height: 72px;
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #E2DCD5;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        .qr-real-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .qr-text {
          flex: 1;
          text-align: left;
        }
        .qr-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .qr-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .qr-expand-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(27, 67, 50, 0.07);
          padding: 3px 8px;
          border-radius: 9999px;
          white-space: nowrap;
        }
        .qr-desc {
          font-size: 0.74rem;
          color: #728178;
          font-weight: 500;
          margin-top: 4px;
          line-height: 1.35;
        }

        /* ─── Botanical QR Modal Overlay ─── */
        .botanical-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 20, 0.65);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: botanicalFadeIn 0.2s ease-out;
        }
        @keyframes botanicalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .botanical-modal-card {
          background: #FFFFFF;
          border-radius: 28px;
          width: 100%;
          max-width: 360px;
          padding: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(27, 67, 50, 0.12);
          text-align: center;
          animation: botanicalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }
        @keyframes botanicalScaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        .botanical-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid #ECE7E1;
        }
        .botanical-modal-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }
        .botanical-modal-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .botanical-modal-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
          line-height: 1.2;
        }
        .botanical-modal-sub {
          font-size: 0.72rem;
          font-weight: 600;
          color: #728178;
          margin: 2px 0 0;
        }
        .botanical-modal-close {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #F4F0EB;
          border: none;
          color: #4A5550;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .botanical-modal-close:hover {
          background: #ECE6DE;
          color: #1A201C;
        }
        .botanical-modal-body {
          padding: 20px 0 16px;
        }
        .botanical-modal-qr-frame {
          width: 210px;
          height: 210px;
          margin: 0 auto 14px;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 10px;
          border: 1px solid #ECE7E1;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .botanical-modal-qr-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .botanical-modal-instruction {
          font-size: 0.76rem;
          font-weight: 500;
          color: #617066;
          margin: 0 0 12px;
          line-height: 1.4;
          padding: 0 8px;
        }
        .botanical-modal-link-box {
          background: #F7F5F1;
          border-radius: 12px;
          padding: 8px 12px;
          border: 1px solid #ECE7E1;
          overflow: hidden;
        }
        .botanical-modal-url {
          font-size: 0.72rem;
          font-family: monospace;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
        .botanical-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }
        .botanical-btn-action {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
          box-sizing: border-box;
        }
        .botanical-btn-action.secondary {
          background: #F4F0EB;
          color: #2D3A32;
          border: 1px solid #E2DCD5;
        }
        .botanical-btn-action.secondary:hover {
          background: #EAE4DC;
        }
        .botanical-btn-action.primary {
          background: var(--primary);
          color: #FFFFFF;
          border: none;
          box-shadow: 0 4px 12px rgba(27, 67, 50, 0.25);
        }
        .botanical-btn-action.primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        /* ─── Footer Section ─── */
        .footer-divider {
          width: 100%;
          height: 1px;
          background: #DFD8CD;
          opacity: 0.7;
          margin-bottom: 18px;
          position: relative;
          z-index: 10;
        }
        .footer-brand {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .footer-powered {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.76rem;
          color: #55625A;
          font-weight: 500;
        }
        .footer-logo-badge {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          box-sizing: border-box;
        }
        .footer-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .footer-powered strong {
          color: var(--text-main);
          font-weight: 800;
        }
        .footer-tagline {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.26em;
          color: #8C9991;
          text-transform: uppercase;
          margin-top: 2px;
        }
      `}} />

      <div className="botanical-page-wrapper">
        <div className="preview-container">

          {/* ─── MAIN BUSINESS PROFILE CARD (Configured solely via Appearance Menu) ─── */}
          <div
            className={`card-canvas theme-${activeTheme} bg-${activeBg}`}
            id="cardCanvas"
            style={customCssVars}
          >

            {/* 1. BOTANICAL BACKGROUND LAYER */}
            <div className="bg-layer-botanical">
              <div className="bg-shape-top-right"></div>
              <div className="bg-shape-top-secondary"></div>
              <svg className="bg-leaf-top-right" viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="leafStem" d="M220 10 C180 80, 130 160, 95 280" stroke="var(--leaf-stem)" strokeWidth="2.6" strokeLinecap="round" />
                <defs>
                  <linearGradient id="leafGradTop1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--leaf-top-grad1)" />
                    <stop offset="100%" stopColor="var(--leaf-top-grad2)" />
                  </linearGradient>
                  <linearGradient id="leafGradTop2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--leaf-top-grad3)" />
                    <stop offset="100%" stopColor="var(--leaf-top-grad4)" />
                  </linearGradient>
                </defs>
                <path d="M205 35 C170 15, 135 35, 145 75 C165 95, 200 68, 205 35 Z" fill="url(#leafGradTop1)" opacity="0.96" />
                <path d="M175 80 C135 70, 110 100, 128 130 C152 142, 175 110, 175 80 Z" fill="url(#leafGradTop2)" opacity="0.94" />
                <path d="M150 125 C175 112, 208 135, 195 168 C170 180, 142 155, 150 125 Z" fill="url(#leafGradTop1)" opacity="0.96" />
                <path d="M125 170 C90 162, 78 198, 102 225 C128 230, 140 198, 125 170 Z" fill="url(#leafGradTop2)" opacity="0.92" />
                <path d="M110 215 C132 208, 158 232, 145 258 C128 270, 102 245, 110 215 Z" fill="url(#leafGradTop1)" opacity="0.95" />
              </svg>

              <div className="bg-shape-bottom-left"></div>
              <svg className="bg-leaf-bottom-left" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 270 C45 190, 75 130, 120 50" stroke="var(--leaf-stem)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M110 65 C100 30, 65 42, 75 78 C88 95, 110 88, 110 65 Z" fill="var(--leaf-bot1)" opacity="0.94" />
                <path d="M85 110 C58 98, 40 132, 62 155 C85 160, 98 132, 85 110 Z" fill="var(--leaf-bot2)" opacity="0.9" />
                <path d="M68 160 C90 148, 118 170, 106 198 C88 208, 68 188, 68 160 Z" fill="var(--leaf-bot1)" opacity="0.96" />
                <path d="M50 205 C28 198, 16 226, 34 248 C56 254, 68 226, 50 205 Z" fill="var(--leaf-bot2)" opacity="0.88" />
              </svg>
            </div>

            {/* 2. GEOMETRIC ARCHITECTURAL BACKGROUND LAYER */}
            <div className="bg-layer-geometric">
              <div className="geo-corner-band"></div>
              <div className="geo-grid"></div>
              <div className="geo-accent-line"></div>
              <div className="geo-bottom-band"></div>
            </div>

            {/* 3. TOPOGRAPHIC CONTOUR WAVES BACKGROUND LAYER */}
            <div className="bg-layer-topo">
              <svg className="topo-svg-top" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0 C150 40, 220 30, 300 120" stroke="var(--shape-color)" strokeWidth="2" opacity="0.5" />
                <path d="M60 0 C120 60, 180 50, 300 150" stroke="var(--shape-color)" strokeWidth="2" opacity="0.6" />
                <path d="M20 0 C90 80, 140 70, 300 180" stroke="var(--shape-color)" strokeWidth="2" opacity="0.7" />
                <path d="M0 30 C70 100, 110 90, 300 210" stroke="var(--shape-color-sec)" strokeWidth="2" opacity="0.8" />
                <path d="M0 70 C50 120, 80 110, 260 220" stroke="var(--shape-color-sec)" strokeWidth="1.8" opacity="0.5" />
              </svg>
              <svg className="topo-svg-bot" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 120 C80 60, 140 80, 240 200" stroke="var(--shape-color)" strokeWidth="2" opacity="0.4" />
                <path d="M0 80 C110 30, 170 50, 280 200" stroke="var(--shape-color)" strokeWidth="2" opacity="0.6" />
                <path d="M0 40 C140 0, 200 20, 300 180" stroke="var(--shape-color-sec)" strokeWidth="1.8" opacity="0.5" />
              </svg>
            </div>

            {/* 4. AMBIENT AURA MESH BACKGROUND LAYER */}
            <div className="bg-layer-aura">
              <div className="aura-orb-1"></div>
              <div className="aura-orb-2"></div>
            </div>

            {/* 5. MINIMALIST CLEAN LAYER */}
            <div className="bg-layer-minimal">
              <div className="min-accent-bar"></div>
            </div>

            {/* 6. LUXURY MARBLE VEINING BACKGROUND LAYER */}
            <div className="bg-layer-marble">
              <div className="marble-cloud-top"></div>
              <div className="marble-cloud-bot"></div>
              <svg className="marble-svg-top" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M260 20 C210 60, 220 110, 160 140 C120 160, 85 155, 30 210" stroke="var(--shape-color)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M180 95 C145 110, 110 100, 85 130" stroke="var(--shape-color)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
                <path d="M260 80 C215 130, 195 170, 130 200 C85 220, 50 250, 0 260" stroke="var(--shape-color-sec)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                <path d="M210 30 C190 10, 140 30, 110 10" stroke="var(--shape-color-sec)" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
                <circle cx="220" cy="45" r="2.8" fill="var(--shape-color)" opacity="0.7" />
                <circle cx="175" cy="115" r="2" fill="var(--shape-color-sec)" opacity="0.8" />
                <circle cx="130" cy="155" r="2.4" fill="var(--shape-color)" opacity="0.6" />
                <circle cx="240" cy="120" r="1.8" fill="var(--shape-color-sec)" opacity="0.7" />
                <circle cx="70" cy="180" r="2.2" fill="var(--shape-color-sec)" opacity="0.5" />
              </svg>
              <svg className="marble-svg-bot" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 240 C50 200, 40 150, 100 120 C140 100, 175 105, 230 50" stroke="var(--shape-color)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
                <path d="M80 165 C115 150, 150 160, 175 130" stroke="var(--shape-color)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
                <path d="M0 180 C45 130, 65 90, 130 60 C175 40, 210 10, 260 0" stroke="var(--shape-color-sec)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <circle cx="40" cy="215" r="2.8" fill="var(--shape-color)" opacity="0.7" />
                <circle cx="85" cy="145" r="2.2" fill="var(--shape-color-sec)" opacity="0.8" />
                <circle cx="130" cy="105" r="2.4" fill="var(--shape-color)" opacity="0.6" />
                <circle cx="20" cy="140" r="1.8" fill="var(--shape-color-sec)" opacity="0.7" />
              </svg>
            </div>

            {/* 7. TECH MATRIX BACKGROUND LAYER */}
            <div className="bg-layer-tech">
              <svg className="tech-svg-top" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="180,25 220,48 220,94 180,117 140,94 140,48" stroke="var(--shape-color)" strokeWidth="1.8" fill="var(--shape-color)" fillOpacity="0.08" />
                <polygon points="220,94 260,117 260,163 220,186 180,163 180,117" stroke="var(--shape-color-sec)" strokeWidth="1.5" fill="none" opacity="0.6" />
                <polygon points="135,100 165,117 165,152 135,169 105,152 105,117" stroke="var(--shape-color)" strokeWidth="1.2" fill="none" opacity="0.4" />
                <path d="M140 48 L95 48 L65 78" stroke="var(--shape-color)" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.5" />
                <path d="M180 117 L180 163 L135 189" stroke="var(--shape-color-sec)" strokeWidth="1.4" opacity="0.45" />
                <path d="M220 48 L250 48" stroke="var(--shape-color)" strokeWidth="1.4" opacity="0.5" />
                <circle cx="180" cy="25" r="4" fill="var(--shape-color)" />
                <circle cx="220" cy="48" r="3.5" fill="var(--shape-color-sec)" />
                <circle cx="220" cy="94" r="4.5" fill="var(--shape-color)" />
                <circle cx="140" cy="94" r="3.5" fill="var(--shape-color-sec)" />
                <circle cx="180" cy="117" r="4" fill="var(--shape-color)" />
                <circle cx="65" cy="78" r="3" fill="var(--shape-color-sec)" />
                <circle cx="260" cy="117" r="3.5" fill="var(--shape-color)" />
                <circle cx="135" cy="189" r="3" fill="var(--shape-color-sec)" />
              </svg>
              <svg className="tech-svg-bot" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="60,165 100,188 100,234 60,257 20,234 20,188" stroke="var(--shape-color)" strokeWidth="1.6" fill="var(--shape-color)" fillOpacity="0.08" />
                <polygon points="100,119 140,142 140,188 100,211 60,188 60,142" stroke="var(--shape-color-sec)" strokeWidth="1.4" fill="none" opacity="0.55" />
                <path d="M60 165 L60 110 L115 55" stroke="var(--shape-color-sec)" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.5" />
                <path d="M100 234 L150 234" stroke="var(--shape-color)" strokeWidth="1.4" opacity="0.4" />
                <circle cx="60" cy="165" r="4" fill="var(--shape-color)" />
                <circle cx="100" cy="188" r="3.5" fill="var(--shape-color-sec)" />
                <circle cx="60" cy="110" r="3" fill="var(--shape-color)" />
                <circle cx="115" cy="55" r="3.5" fill="var(--shape-color-sec)" />
                <circle cx="100" cy="234" r="4" fill="var(--shape-color)" />
                <circle cx="20" cy="188" r="3" fill="var(--shape-color-sec)" />
              </svg>
            </div>

            {/* 8. FROSTED GLASS PRISMS BACKGROUND LAYER */}
            <div className="bg-layer-frosted">
              <div className="frost-prism-glow"></div>
              <div className="frost-prism-top"></div>
              <div className="frost-prism-bot"></div>
            </div>

            {/* 9. SILK RIBBON WAVE BACKGROUND LAYER */}
            <div className="bg-layer-silk">
              <svg className="silk-svg-top" viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="silkGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--shape-color)" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="var(--shape-color-sec)" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="var(--shape-color)" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="silkGradTopSub" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--shape-color-sec)" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="var(--shape-color)" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M70 0 C110 80, 190 70, 280 150 L280 0 Z" fill="url(#silkGradTop)" />
                <path d="M130 0 C165 60, 220 60, 280 110 L280 0 Z" fill="url(#silkGradTopSub)" opacity="0.75" />
                <path d="M70 0 C110 80, 190 70, 280 150" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" />
                <path d="M130 0 C165 60, 220 60, 280 110" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" />
              </svg>
              <svg className="silk-svg-bot" viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="silkGradBot" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="var(--shape-color)" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="var(--shape-color-sec)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--shape-color)" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path d="M0 130 C80 190, 160 170, 220 260 L0 260 Z" fill="url(#silkGradBot)" />
                <path d="M0 130 C80 190, 160 170, 220 260" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" />
              </svg>
            </div>

            {/* 10. BAUHAUS MODERN ARCHITECTURAL BACKGROUND LAYER */}
            <div className="bg-layer-bauhaus">
              <svg className="bauhaus-top" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M130 0 A110 110 0 0 1 240 110 L240 0 Z" fill="var(--shape-color)" opacity="0.82" />
                <circle cx="240" cy="0" r="150" stroke="var(--shape-color-sec)" strokeWidth="2" opacity="0.6" strokeDasharray="6 6" />
                <circle cx="240" cy="0" r="190" stroke="var(--shape-color)" strokeWidth="1.6" opacity="0.4" />
                <circle cx="240" cy="0" r="230" stroke="var(--shape-color-sec)" strokeWidth="1.2" opacity="0.25" />
                <rect x="75" y="25" width="32" height="32" rx="8" fill="var(--shape-color-sec)" opacity="0.45" />
                <circle cx="50" cy="90" r="14" fill="var(--shape-color)" opacity="0.5" />
              </svg>
              <svg className="bauhaus-bot" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 130 A110 110 0 0 1 110 240 L0 240 Z" fill="var(--shape-color)" opacity="0.45" />
                <circle cx="0" cy="240" r="145" stroke="var(--shape-color)" strokeWidth="2" opacity="0.45" />
                <circle cx="0" cy="240" r="185" stroke="var(--shape-color-sec)" strokeWidth="1.6" opacity="0.5" strokeDasharray="5 5" />
                <circle cx="95" cy="190" r="14" fill="var(--shape-color-sec)" opacity="0.55" />
                <rect x="135" y="195" width="26" height="26" rx="6" fill="var(--shape-color)" opacity="0.35" />
              </svg>
            </div>

            {/* ─── TOP BAR ─── */}
            <header className="top-header">
              <a href="/" className="brand-logo">
                <div className="brand-logo-badge">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={companyLogoUrl}
                    alt={companyName}
                    className="brand-logo-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo.png";
                    }}
                  />
                </div>
                <span className="brand-name">
                  Digi<span className="brand-accent">cardo</span>
                </span>
              </a>
              <button
                className="btn-share-top"
                aria-label="Share digital card"
                type="button"
                onClick={handleShareCard}
                title="Share Digital Business Card"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </header>

            {/* ─── BUSINESS PROFILE HERO ─── */}
            <section className="profile-hero">
              <div className="avatar-wrapper">
                <div className="avatar-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="avatar-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80";
                    }}
                  />
                </div>
                <div className="status-dot" title="Available for business"></div>
              </div>

              <div className="profile-name-row">
                <h1 className="profile-name">{displayName}</h1>
                {showVerified && (
                  <span className="verified-badge" title="Verified Business Identity">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </span>
                )}
              </div>

              {Boolean(showCompanyName && companyName) && (
                <div className="profile-company">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M12 6h.01" />
                    <path d="M12 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 10h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 10h.01" />
                    <path d="M8 14h.01" />
                  </svg>
                  <span>{companyName}</span>
                </div>
              )}

              {Boolean(showExecutiveRole && executiveRole) && (
                <div className="profile-role-divider">
                  <div className="line"></div>
                  <span className="profile-role">{executiveRole}</span>
                  <div className="line"></div>
                </div>
              )}

              {Boolean(showBio && bio) && (
                <p className="profile-bio">{bio}</p>
              )}

              <div className="trust-badges-row">
                {trustBadges.filter((b: any) => b.enabled !== false).map((b: any) => (
                  <span key={b.id || b.text} className="trust-badge">
                    {b.icon === "star" ? (
                      <svg viewBox="0 0 24 24" fill="#F59E0B">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 9z" />
                      </svg>
                    )}
                    <span>{b.text}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* ─── 4 CIRCULAR BUSINESS ACTION BUTTONS ─── */}
            {(showCall || showWhatsapp || showEmail || showWebsite) && (
              <section className="action-grid">
                {showCall && (
                  <a href={`tel:${phoneVal}`} className="action-item">
                    <div className="action-btn green">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <span className="action-label">{phoneLabel}</span>
                  </a>
                )}

                {showWhatsapp && (
                  <a
                    href={`https://wa.me/${whatsappVal.replace(/\D/g, "")}?text=${encodeURIComponent(qa.whatsapp?.message || "Hello, I would like to enquire about your services.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-item"
                  >
                    <div className="action-btn mint">
                      <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.06c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31c-.84-1.33-1.28-2.88-1.28-4.47 0-4.44 3.61-8.05 8.05-8.05 2.15 0 4.17.84 5.69 2.36 1.52 1.52 2.36 3.54 2.36 5.69 0 4.44-3.61 8.05-8.09 8.05zm4.42-6.04c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.17.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
                      </svg>
                    </div>
                    <span className="action-label">{whatsappLabel}</span>
                  </a>
                )}

                {showEmail && (
                  <a href={`mailto:${emailVal}`} className="action-item">
                    <div className="action-btn coral">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <span className="action-label">{emailLabel}</span>
                  </a>
                )}

                {showWebsite && (
                  <a href={websiteVal} target="_blank" rel="noopener noreferrer" className="action-item">
                    <div className="action-btn blue">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </div>
                    <span className="action-label">{websiteLabel}</span>
                  </a>
                )}
              </section>
            )}

            {/* ─── BUSINESS CARDS STACK ─── */}
            <section className="cards-stack">
              {contentLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`card-item ${link.featured ? "featured" : ""}`}
                >
                  {renderCardIcon(link.icon, link.url)}
                  <div className="card-info">
                    <span className="card-title">{link.headline}</span>
                    {link.description && (
                      <span className="card-subtitle">{link.description}</span>
                    )}
                  </div>
                  <div className="card-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </a>
              ))}
            </section>

            {/* ─── PROFESSIONAL NETWORKING PILLS ROW (Always placed below Cards Stack matching botanical-preview.html) ─── */}
            {custom.show_socials !== false && renderSocialPillsRow()}

            {/* ─── PRIMARY DUAL BUSINESS CTA (Save vCard + Share Card) ─── */}
            {(showSaveContact || showShareProfile) && (
              <section className="cta-row">
                {showSaveContact && (
                  <button
                    type="button"
                    className="btn-save-contact"
                    onClick={handleDownloadVCard}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    <span>Save Business Card</span>
                  </button>
                )}

                {showShareProfile && (
                  <button
                    type="button"
                    className="btn-share-profile"
                    onClick={handleShareCard}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    <span>{copiedShare ? "Link Copied!" : "Share Card"}</span>
                  </button>
                )}
              </section>
            )}

            {/* ─── BUSINESS QR CODE CARD ─── */}
            {showQr && (
              <section
                className="qr-card"
                onClick={() => setShowQrModal(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowQrModal(true);
                  }
                }}
                title="Click to expand & scan digital business card QR"
              >
                <div className="qr-box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeImageUrl}
                    alt={`${displayName} QR Code`}
                    className="qr-real-img"
                    loading="lazy"
                    suppressHydrationWarning
                  />
                </div>
                <div className="qr-text">
                  <div className="qr-title-row">
                    <div className="qr-title">{qrTitle}</div>
                    <span className="qr-expand-pill">
                      <span>View &amp; Scan</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                  <div className="qr-desc">{qrDesc}</div>
                </div>
              </section>
            )}

            {/* ─── FOOTER ─── */}
            <div className="footer-divider"></div>
            <footer className="footer-brand">
              <div className="footer-powered">
                <div className="footer-logo-badge">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="Digicardo Logo" className="footer-logo-img" onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }} />
                </div>
                <span>
                  Powered by <strong>Digi<span className="brand-accent">cardo</span></strong>
                </span>
              </div>
              <div className="footer-tagline">Corporate Digital Visiting Card</div>
            </footer>

          </div>
        </div>
      </div>

      {/* ─── BOTANICAL QR CODE MODAL ─── */}
      {showQrModal && (
        <div
          className="botanical-modal-overlay"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="botanical-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="botanical-modal-header">
              <div className="botanical-modal-title-group">
                <div className="botanical-modal-icon">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="botanical-modal-title">{displayName}</h3>
                  <p className="botanical-modal-sub">Digital Business Card QR</p>
                </div>
              </div>
              <button
                type="button"
                className="botanical-modal-close"
                onClick={() => setShowQrModal(false)}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="botanical-modal-body">
              <div className="botanical-modal-qr-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeImageUrl}
                  alt={`${displayName} QR Code`}
                  className="botanical-modal-qr-img"
                  suppressHydrationWarning
                />
              </div>

              <p className="botanical-modal-instruction">
                Point any smartphone camera at this code to open the profile &amp; save contact
              </p>

              <div className="botanical-modal-link-box">
                <span className="botanical-modal-url" suppressHydrationWarning>{qrTargetUrl}</span>
              </div>
            </div>

            <div className="botanical-modal-actions">
              <button
                type="button"
                onClick={handleCopyQrLink}
                className="botanical-btn-action secondary"
              >
                {copiedQrLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQrLink ? "Copied!" : "Copy Link"}</span>
              </button>

              <a
                href={qrCodeImageUrl}
                download={`${displayName.replace(/\s+/g, "_")}_QR.png`}
                target="_blank"
                rel="noreferrer"
                className="botanical-btn-action primary"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
