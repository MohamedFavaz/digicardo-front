"use client";

/**
 * Nexus Direct — VCard Business Template
 * ─────────────────────────────────────────────────────────────────────────────
 * Pixel-perfect implementation of the Nexus Direct digital business card layout
 * matching the exact visual architecture:
 *  - Top banner with LOGO badge & concentric circular overlapping avatar
 *  - Bold Montserrat business title & tagline
 *  - Category pill badge
 *  - Full-width primary CTA button ("🛍️ View Service >" / Customizable)
 *  - 2-column CTA buttons ("💳 Pay Now" & "📍 My Location")
 *  - 24×7 Always Open status indicator with live green pulse
 *  - 4-column pastel circular Quick Action Grid (Call, WhatsApp, Email, Website, Bank, Address, Book Now, Form, Facebook, Instagram, Review, Save, QR Code, Install)
 *  - "Share This Digital Card" WhatsApp input + button
 *  - Real-time Analytics metrics counter footer bar (Views, Clicks, Actions, Days Live, Engagement)
 *  - Interactive modals: Services catalogue with WhatsApp enquiry, Pay Now UPI with QR & copy, Bank details with copy, Book appointment form, Google Maps navigation, QR code, and .vcf contact card download.
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Landmark,
  MapPin,
  Calendar,
  FileText,
  Star,
  UserPlus,
  QrCode,
  Smartphone,
  X,
  Copy,
  Check,
  Clock,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Download,
  Share2,
  Send,
  CreditCard,
  Navigation,
  ShoppingBag,
  Package,
  Eye,
  MousePointerClick,
  Zap,
  BarChart3,
} from "lucide-react";
import type { TemplateProps } from "../types";

// ── Inline SVG brand icons not in lucide-react ──
const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.344 4.208-.01.04-.023.066-.03.098-.05.197-.076.349-.076.46 0 .51.36.985.858.985.146 0 .333-.04.513-.076.208-.044.42-.076.637-.076.397 0 .762.112 1.016.429.244.306.414.785.3 1.41-.255 1.349-1.483 1.799-1.994 1.965l-.241.085c-.47.2-.81.51-1.07.862-.228.306-.365.648-.386.963a.416.416 0 0 1-.065.193c-.07.11-.19.17-.36.17-.17 0-.36-.05-.56-.1-.47-.12-.995-.25-1.548-.25-.38 0-.726.064-1.057.193-.385.15-.75.4-1.13.685-.455.336-.933.689-1.54.689-.608 0-1.086-.353-1.54-.69-.38-.284-.747-.534-1.13-.684-.33-.13-.676-.194-1.057-.194-.553 0-1.079.13-1.548.25-.2.05-.39.1-.56.1-.17 0-.29-.06-.36-.17a.42.42 0 0 1-.065-.193c-.02-.315-.158-.657-.386-.963-.26-.352-.6-.662-1.07-.862l-.24-.085C2.907 14.016 1.68 13.566 1.424 12.217c-.115-.625.056-1.104.3-1.41.254-.317.62-.43 1.016-.429.216 0 .43.032.637.076.18.037.367.076.513.076.497 0 .858-.476.858-.984 0-.112-.027-.264-.076-.461-.007-.032-.02-.058-.03-.098-.058-.99-.185-3.015.344-4.208C6.573 1.069 9.916.793 12.206.793z" /></svg>
);
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.27a8.23 8.23 0 0 0 4.82 1.55V7.38a4.85 4.85 0 0 1-1.05-.69z" /></svg>
);
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
);
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.371-.885h-.048c-.726.23-1.283.679-1.657 1.14l-1.224 1.6c-.828-.637-1.857-.96-3.057-.96h-.035c-1.974.013-3.241.924-3.293 2.393-.027.756.27 1.395.887 1.851.643.47 1.567.707 2.747.742.84.022 1.617-.109 2.309-.39.697-.283 1.236-.71 1.608-1.273.267-.399.454-.852.566-1.353a11.882 11.882 0 0 0-2.782-.002z" /></svg>
);
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
);
const TwitchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" /></svg>
);
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
);
const WhatsAppChannelIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
);
const BehanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93s-.67 1-1.16 1.34c-.49.34-1.055.59-1.69.74-.625.16-1.275.23-1.95.23H0V4.51h6.938zm-.34 4.87c.585 0 1.05-.14 1.405-.41.35-.28.525-.7.525-1.26 0-.31-.057-.57-.17-.78-.115-.21-.27-.38-.462-.5-.196-.12-.42-.2-.67-.24-.26-.04-.53-.06-.81-.06H3.24v3.25h3.357zm.16 5.1c.32 0 .616-.03.89-.09.275-.06.512-.16.712-.3.2-.14.36-.33.475-.57.115-.24.172-.54.172-.91 0-.73-.196-1.25-.588-1.54-.39-.3-.916-.44-1.574-.44H3.24v3.86H6.76zm10.25-3.85c.49 0 .84.17 1.06.5.22.34.33.8.33 1.38H13.8c.08-.56.27-1 .57-1.31.3-.31.7-.47 1.2-.47.49 0 .89.13 1.12.4zm3.44-3.27H13.8v1.42h6.65V7.35zM22 16.75c-.22-.66-.54-1.23-.96-1.71-.42-.48-.94-.86-1.55-1.14-.61-.28-1.3-.42-2.07-.42-.78 0-1.47.14-2.09.41-.62.28-1.15.67-1.59 1.17-.44.5-.78 1.1-1.01 1.78-.24.68-.36 1.43-.36 2.23 0 .82.12 1.58.36 2.27.24.7.58 1.3 1.02 1.8.44.5.97.9 1.59 1.17.62.28 1.31.41 2.09.41.78 0 1.48-.14 2.09-.41.62-.27 1.14-.65 1.57-1.13.43-.48.77-1.07 1.01-1.76.24-.69.36-1.45.36-2.28 0-.79-.11-1.52-.33-2.18z" /></svg>
);
const DribbbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.048 6.39 1.73 1.358 3.92 2.166 6.298 2.166 1.42 0 2.77-.29 4.006-.806zm-9.88-2.65c.25-.47 3.22-5.79 8.5-7.503.18-.058.36-.108.54-.153a33.76 33.76 0 0 0-.422-1.034c-5.194 1.552-10.24 1.49-10.72 1.484a10.057 10.057 0 0 0-.006.5c0 2.68 1.01 5.127 2.665 6.957zm-2.428-8.61c.49.01 4.81.062 9.688-1.28-1.74-3.09-3.61-5.69-3.88-6.066-2.914 1.376-5.044 4.076-5.808 7.345zm7.56-8.05c.28.39 2.18 2.99 3.9 6.16 3.72-1.393 5.29-3.513 5.477-3.8-1.7-1.513-3.932-2.43-6.384-2.43-.35 0-.694.024-1.033.066zm9.133 4.7c-.22.307-1.95 2.55-5.818 4.1.245.5.47 1.016.68 1.53.07.18.143.36.21.542 3.41-.43 6.8.26 7.14.328-.024-2.42-.88-4.645-2.28-6.5z" /></svg>
);
import type {
  PhoneBlockConfig,
  WhatsAppBlockConfig,
  EmailBlockConfig,
  MapBlockConfig,
  SocialBlockConfig,
  LinkBlockConfig,
} from "@/types/blocks";
import type { VCardCustomOptions, VCardProduct, VCardService } from "@/types/profile";

// ─── Modal Types ──────────────────────────────────────────────────────────────
type ActiveModal =
  | null
  | "services"
  | "pay"
  | "bank"
  | "address"
  | "call"
  | "booking"
  | "contact_form"
  | "qr"
  | "install"
  | "gallery"
  | "share";

export function VCardTemplate({ profile, blocks, theme }: TemplateProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sharePhone, setSharePhone] = useState("");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  // Catalog tab inside Services modal: "services" | "products"
  const [catalogTab, setCatalogTab] = useState<"services" | "products">("services");

  // Booking Form State
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookService, setBookService] = useState("");
  const [bookNotes, setBookNotes] = useState("");

  // Contact Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMsg, setFormMsg] = useState("");

  // ── Real-Time Analytics Metrics State ──
  const initialDaysLive = useMemo(() => {
    const createdStr = (profile as any)?.created_at;
    if (!createdStr) return 1;
    const diff = Math.floor((Date.now() - new Date(createdStr).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  }, [profile]);

  const [liveStats, setLiveStats] = useState<{
    views: number;
    clicks: number;
    actions: number;
    days_live: number;
    engage: number;
  }>({
    views: (profile as any)?.stats?.views ?? 0,
    clicks: (profile as any)?.stats?.clicks ?? 0,
    actions: (profile as any)?.stats?.actions ?? 0,
    days_live: (profile as any)?.stats?.days_live ?? initialDaysLive,
    engage: (profile as any)?.stats?.engage ?? 0,
  });

  // Fetch real-time metrics for this profile on mount & poll every 10s
  useEffect(() => {
    const targetUsername = profile.username;
    if (!targetUsername) return;

    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const res = await fetch(`/api/bff/v1/public/profiles/${targetUsername}/stats`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          const data = json?.data || json;
          if (isMounted && data && typeof data.views === "number") {
            setLiveStats(data);
          }
        }
      } catch {
        // Non-blocking fallback
      }
    };

    fetchLiveStats();
    const pollInterval = setInterval(fetchLiveStats, 10000);
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [profile.username]);

  // Real-time optimistic interaction tracker
  const trackInteraction = useCallback(
    (type: "click" | "action", eventType?: string) => {
      setLiveStats((prev) => ({
        ...prev,
        clicks: type === "click" ? prev.clicks + 1 : prev.clicks,
        actions: type === "action" ? prev.actions + 1 : prev.actions,
        engage: prev.engage + 1,
      }));

      const pid = profile.id;
      if (pid && typeof window !== "undefined") {
        try {
          fetch("/api/bff/v1/analytics/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              profile_id: pid,
              event_type: eventType || (type === "action" ? "cta_click" : "link_click"),
            }),
            keepalive: true,
          }).catch(() => {});
        } catch {
          // Ignore
        }
      }
    },
    [profile.id]
  );

  // Extract Custom Options with sensible defaults
  const customOpts: VCardCustomOptions = useMemo(() => {
    return theme.custom_options || {};
  }, [theme.custom_options]);

  const showMetaVerified = customOpts.show_meta_verified !== false;
  const bannerTransition = customOpts.banner_transition !== false;
  // Services button
  const servicesBtnText = customOpts.services_button_text || "View Service";
  // Products button
  const productsBtnText = customOpts.products_button_text || "View Products";
  const productsBtnColor = customOpts.products_button_color || "#7c3aed";
  const productsUrl = customOpts.products_url || "";
  // Enquiry button customization
  const svcEnquiryBtnText = customOpts.services_enquiry_btn_text || "Enquire";
  const svcEnquiryBtnColor = customOpts.services_enquiry_btn_color || "#00c853";
  const prodEnquiryBtnText = customOpts.products_enquiry_btn_text || "Enquire";
  const prodEnquiryBtnColor = customOpts.products_enquiry_btn_color || "#7c3aed";
  // Misc
  const payNowEnabled = customOpts.pay_now_enabled !== false;
  const reviewUrl = customOpts.google_review_url || "";
  const iconToggles = customOpts.active_action_icons || {};
  // Button visibility toggles
  const viewServiceBtnEnabled = customOpts.view_service_btn_enabled !== false;
  const viewProductsBtnEnabled = customOpts.view_products_btn_enabled === true;
  const payNowBtnEnabled = customOpts.pay_now_btn_enabled !== false;
  const locationBtnEnabled = customOpts.location_btn_enabled !== false;

  // ── Block Classifications ──────────────────────────────────────────────────
  const phoneBlocks = useMemo(() => blocks.filter((b) => b.type === "phone"), [blocks]);
  const whatsappBlocks = useMemo(() => blocks.filter((b) => b.type === "whatsapp"), [blocks]);
  const emailBlocks = useMemo(() => blocks.filter((b) => b.type === "email"), [blocks]);
  const mapBlocks = useMemo(() => blocks.filter((b) => b.type === "map"), [blocks]);
  const linkBlocks = useMemo(() => blocks.filter((b) => b.type === "link"), [blocks]);
  const socialBlocks = useMemo(() => blocks.filter((b) => b.type === "social"), [blocks]);

  // Helper to extract social URL from custom options or blocks
  const getSocialUrl = useCallback(
    (platform: string): string | undefined => {
      if (customOpts.social_urls && customOpts.social_urls[platform]) {
        const u = customOpts.social_urls[platform];
        if (u && u.trim().length > 0) return u.trim();
      }
      const blk = socialBlocks.find(
        (s) =>
          (s.config as SocialBlockConfig).platform === platform ||
          (platform === "twitter" && (s.config as SocialBlockConfig).platform === "x")
      );
      if (blk) {
        const u = (blk.config as SocialBlockConfig).url;
        if (u && u.trim().length > 0) return u.trim();
      }
      return undefined;
    },
    [customOpts.social_urls, socialBlocks]
  );

  // ── Extract Business Details with safe fallbacks ────────────────────────────
  const displayName = customOpts.display_name_override?.trim() || profile.display_name || "CSC JANASEVA KENDRAM";
  const bio = customOpts.tagline_override?.trim() || profile.bio || "Akshaya services and sales";
  const avatarUrl = customOpts.custom_avatar_url || profile.avatar_url;
  const categoryText = customOpts.category_badge_text || displayName;

  // Banner images list (custom options or fallbacks)
  const bannerImages = useMemo(() => {
    const list: string[] = [];
    if (customOpts.banner_images && customOpts.banner_images.length > 0) {
      list.push(...customOpts.banner_images.filter((url) => typeof url === "string" && url.trim().length > 0));
    }
    if (customOpts.banner_image_url && !list.includes(customOpts.banner_image_url)) {
      list.unshift(customOpts.banner_image_url);
    }
    if (list.length > 0) {
      return list;
    }
    if (profile.cover_url) {
      return [profile.cover_url];
    }
    return [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    ];
  }, [customOpts.banner_image_url, customOpts.banner_images, profile.cover_url]);

  // Button radius styling based on theme token
  const btnRadiusStyle = useMemo(() => {
    switch (theme.button_radius) {
      case "none":
        return "0px";
      case "small":
        return "6px";
      case "medium":
        return "10px";
      case "large":
        return "16px";
      case "pill":
        return "9999px";
      default:
        return "14px";
    }
  }, [theme.button_radius]);

  // Theme & Customizable Colors
  const primaryBtnColor = customOpts.primary_button_color || theme.color_accent || "#00c853";
  const payBtnColor = customOpts.pay_button_color || "#f59e0b";
  const locationBtnColor = customOpts.location_button_color || "#6b7b70";
  const canvasBg = theme.color_background || "#f6faff";
  const surfaceBg = theme.color_surface || "#ffffff";
  const textPrimary = theme.color_text_primary || "#141d23";
  const textSecondary = theme.color_text_secondary || "#5f5e5e";
  const fontFamilyCss = theme.font_family
    ? `'${theme.font_family}', 'Montserrat', 'Inter', system-ui, sans-serif`
    : "'Montserrat', 'Inter', system-ui, sans-serif";

  // ── Dark/Light theme detection ── 
  // Computes luminance of background to auto-adapt all UI elements
  const isDark = useMemo(() => {
    const hex = canvasBg.replace("#", "");
    if (hex.length < 6) return false;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
  }, [canvasBg]);

  // Adaptive UI colors — automatically correct for dark/light themes
  const modalBg = surfaceBg;
  const modalBorder = isDark ? "rgba(255,255,255,0.12)" : "#e0e9f2";
  const modalText = textPrimary;
  const modalTextSub = textSecondary;
  const inputBg = isDark ? `${canvasBg}` : "#ffffff";
  const inputBorder = isDark ? "rgba(255,255,255,0.15)" : "#e0e9f2";
  const cardItemBg = isDark ? `${surfaceBg}` : "#f8fbfe";
  const cardItemBorder = isDark ? "rgba(255,255,255,0.10)" : "#e6eff8";
  const statusBarBg = isDark ? surfaceBg : "#f8fbfe";
  const statusBarBorder = isDark ? "rgba(255,255,255,0.10)" : "#e0e9f2";
  const actionIconBg = isDark ? `${surfaceBg}` : "#f6faff";
  const actionIconBorder = isDark ? "rgba(255,255,255,0.10)" : "#e6eff8";
  const dividerColor = isDark ? "rgba(255,255,255,0.10)" : "#e6eff8";


  // Animated gradient styles (avoid shorthand background conflict with backgroundSize)
  const isGradientAnim = customOpts.button_gradient_animation !== false;

  const primaryGradientStyle: React.CSSProperties = useMemo(() => {
    if (!isGradientAnim) {
      return {
        backgroundImage: "none",
        backgroundColor: primaryBtnColor,
        backgroundSize: "auto",
        animation: "none",
        color: "#ffffff",
        borderRadius: btnRadiusStyle,
      };
    }
    return {
      backgroundImage: `linear-gradient(135deg, ${primaryBtnColor}, #00e676, #00b0ff, ${primaryBtnColor})`,
      backgroundColor: primaryBtnColor,
      backgroundSize: "300% 300%",
      animation: "vcard-gradient-flow 4s ease infinite",
      color: "#ffffff",
      borderRadius: btnRadiusStyle,
    };
  }, [isGradientAnim, primaryBtnColor, btnRadiusStyle]);

  const payGradientStyle: React.CSSProperties = useMemo(() => {
    if (!isGradientAnim) {
      return {
        backgroundImage: "none",
        backgroundColor: payBtnColor,
        backgroundSize: "auto",
        animation: "none",
        color: "#ffffff",
        borderRadius: btnRadiusStyle,
      };
    }
    return {
      backgroundImage: `linear-gradient(135deg, ${payBtnColor}, #fbbf24, #f97316, ${payBtnColor})`,
      backgroundColor: payBtnColor,
      backgroundSize: "300% 300%",
      animation: "vcard-gradient-flow 4s ease infinite",
      color: "#ffffff",
      borderRadius: btnRadiusStyle,
    };
  }, [isGradientAnim, payBtnColor, btnRadiusStyle]);

  const locationGradientStyle: React.CSSProperties = useMemo(() => {
    if (!isGradientAnim) {
      return {
        backgroundImage: "none",
        backgroundColor: locationBtnColor,
        backgroundSize: "auto",
        animation: "none",
        color: "#ffffff",
        borderRadius: btnRadiusStyle,
      };
    }
    return {
      backgroundImage: `linear-gradient(135deg, ${locationBtnColor}, #475569, #334155, ${locationBtnColor})`,
      backgroundColor: locationBtnColor,
      backgroundSize: "300% 300%",
      animation: "vcard-gradient-flow 4s ease infinite",
      color: "#ffffff",
      borderRadius: btnRadiusStyle,
    };
  }, [isGradientAnim, locationBtnColor, btnRadiusStyle]);

  const productsGradientStyle: React.CSSProperties = useMemo(() => {
    if (!isGradientAnim) {
      return {
        backgroundImage: "none",
        backgroundColor: productsBtnColor,
        backgroundSize: "auto",
        animation: "none",
        color: "#ffffff",
        borderRadius: btnRadiusStyle,
      };
    }
    return {
      backgroundImage: `linear-gradient(135deg, ${productsBtnColor}, #a855f7, #8b5cf6, ${productsBtnColor})`,
      backgroundColor: productsBtnColor,
      backgroundSize: "300% 300%",
      animation: "vcard-gradient-flow 4s ease infinite",
      color: "#ffffff",
      borderRadius: btnRadiusStyle,
    };
  }, [isGradientAnim, productsBtnColor, btnRadiusStyle]);

  // Auto-cycle banner if enabled
  React.useEffect(() => {
    if (!bannerTransition || bannerImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [bannerTransition, bannerImages.length]);

  // Primary Contact Values
  const primaryPhone = useMemo(() => {
    if (customOpts.payment_phone) return customOpts.payment_phone;
    if (phoneBlocks.length > 0) {
      const cfg = phoneBlocks[0].config as PhoneBlockConfig;
      return cfg.phone || "+91 9876543210";
    }
    return "+91 9876543210";
  }, [customOpts.payment_phone, phoneBlocks]);

  /**
   * primaryWhatsapp — uses the permanent Business WhatsApp Number first,
   * then falls back to WA blocks, then the primary phone number.
   */
  const primaryWhatsapp = useMemo(() => {
    if (customOpts.whatsapp_number && customOpts.whatsapp_number.trim().length > 0)
      return customOpts.whatsapp_number.trim();
    if (whatsappBlocks.length > 0) {
      const cfg = whatsappBlocks[0].config as WhatsAppBlockConfig;
      return cfg.phone || primaryPhone;
    }
    return primaryPhone;
  }, [customOpts.whatsapp_number, whatsappBlocks, primaryPhone]);

  const primaryEmail = useMemo(() => {
    if (emailBlocks.length > 0) {
      const cfg = emailBlocks[0].config as EmailBlockConfig;
      return cfg.email || "support@janaseva.org";
    }
    return "support@janaseva.org";
  }, [emailBlocks]);

  const primaryAddress = useMemo(() => {
    if (customOpts.address_text?.trim()) return customOpts.address_text.trim();
    if (mapBlocks.length > 0) {
      const cfg = mapBlocks[0].config as MapBlockConfig;
      return cfg.address || "Main Street, Central Junction, City Center";
    }
    return "Main Street, Central Junction, City Center";
  }, [customOpts.address_text, mapBlocks]);

  const primaryWebsite = useMemo(() => {
    if (linkBlocks.length > 0) {
      const cfg = linkBlocks[0].config as LinkBlockConfig;
      return cfg.url || "https://Digicardo.app";
    }
    return "https://Digicardo.app";
  }, [linkBlocks]);

  // UPI Payment Details
  const upiId = customOpts.upi_id || "janaseva@okaxis";
  const upiNumber = customOpts.upi_number || primaryPhone.replace(/[^0-9]/g, "");
  const paymentPhone = customOpts.payment_phone || primaryPhone;
  const bankName = customOpts.bank_name || "State Bank of India";
  const bankAccNumber = customOpts.bank_account_number || "987654321001";
  const bankIfsc = customOpts.bank_ifsc || "SBIN0001234";
  const bankHolder = customOpts.bank_holder_name || displayName;

  // Copy helper
  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    });
  }, []);

  // Save .vcf contact card
  const handleSaveContact = useCallback(() => {
    trackInteraction("action", "cta_click");
    const vcardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${displayName}`,
      `ORG:${displayName}`,
      `TITLE:${bio}`,
      `TEL;TYPE=CELL:${primaryPhone}`,
      `EMAIL:${primaryEmail}`,
      `URL:${primaryWebsite}`,
      `ADR;TYPE=WORK:;;${primaryAddress};;;;`,
      "NOTE:Saved from Digicardo Digital Business Card",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${displayName.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [displayName, bio, primaryPhone, primaryEmail, primaryWebsite, primaryAddress]);

  // WhatsApp Enquiry for specific service
  const handleEnquireService = useCallback(
    (serviceTitle: string) => {
      const template =
        customOpts.services_enquiry_template ||
        "Hello! I am interested in your service: {service}. Please provide more information.";
      const msg = template.replace("{service}", serviceTitle);
      const cleanPhone = primaryWhatsapp.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    },
    [customOpts.services_enquiry_template, primaryWhatsapp]
  );

  // WhatsApp Enquiry for specific product
  const handleEnquireProduct = useCallback(
    (productName: string) => {
      const template =
        customOpts.products_enquiry_template ||
        "Hello! I am interested in your product: {product}. Please share more details and pricing.";
      const msg = template.replace("{product}", productName);
      const cleanPhone = primaryWhatsapp.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    },
    [customOpts.products_enquiry_template, primaryWhatsapp]
  );

  // Submit Booking to WhatsApp
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackInteraction("action", "booking_click");
    const msg = `*Appointment Booking Request*\n• Name: ${bookName}\n• Phone: ${bookPhone}\n• Date: ${bookDate}\n• Service: ${bookService || "General Enquiry"}\n• Notes: ${bookNotes || "None"}`;
    const cleanPhone = primaryWhatsapp.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    setActiveModal(null);
  };

  // Submit Contact Form to WhatsApp
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackInteraction("action", "cta_click");
    const msg = `*Quick Message / Lead*\n• Name: ${formName}\n• Phone: ${formPhone}\n• Message: ${formMsg}`;
    const cleanPhone = primaryWhatsapp.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    setActiveModal(null);
  };

  // Direct WhatsApp Share — uses permanent Business WhatsApp Number
  const handleShareToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const profileUrl = typeof window !== "undefined" ? window.location.href : `https://Digicardo.app/${profile.username}`;
    const text = `Hello! Check out the official digital card for *${displayName}* here: ${profileUrl}`;
    // If visitor typed a different number use that, otherwise send to business WhatsApp
    const targetPhone = sharePhone.trim().length > 0 ? sharePhone : primaryWhatsapp;
    const clean = targetPhone.replace(/[^0-9+]/g, "");
    if (clean) {
      window.open(`https://wa.me/${clean}?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  // ── Action Icons Matrix with Nexus Direct Pastel Tones ───────────────────────
  const actionIcons = [
    {
      id: "call",
      label: "Call",
      icon: Phone,
      bgColor: "#e8f7f0",
      textColor: "#00875a",
      borderColor: "#d3efe1",
      enabled: iconToggles.call !== false,
      action: () => {
        trackInteraction("action", "phone_click");
        if (phoneBlocks.length > 1) {
          setActiveModal("call");
        } else {
          window.location.href = `tel:${primaryPhone}`;
        }
      },
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      bgColor: "#e6fbf2",
      textColor: "#00a86b",
      borderColor: "#ccf6e4",
      // Always enabled — driven by permanent Business WhatsApp Number, not a toggle
      enabled: true,
      action: () => {
        trackInteraction("action", "whatsapp_click");
        const clean = primaryWhatsapp.replace(/[^0-9+]/g, "");
        window.open(`https://wa.me/${clean}?text=${encodeURIComponent("Hello, I would like to connect!")}`, "_blank");
      },
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      bgColor: "#fdeeed",
      textColor: "#e04f44",
      borderColor: "#fbdcd9",
      enabled: iconToggles.email !== false,
      action: () => {
        trackInteraction("action", "email_click");
        window.location.href = `mailto:${primaryEmail}`;
      },
    },
    {
      id: "website",
      label: "Website",
      icon: Globe,
      bgColor: "#eaf4fb",
      textColor: "#2b7bb9",
      borderColor: "#d4e9f7",
      enabled: iconToggles.website !== false,
      action: () => {
        trackInteraction("click", "link_click");
        window.open(primaryWebsite, "_blank");
      },
    },
    {
      id: "bank",
      label: "Bank",
      icon: Landmark,
      bgColor: "#eef3f8",
      textColor: "#3b5998",
      borderColor: "#dbe6f0",
      enabled: iconToggles.bank !== false,
      action: () => {
        trackInteraction("action", "cta_click");
        setActiveModal("bank");
      },
    },
    {
      id: "address",
      label: "Address",
      icon: MapPin,
      bgColor: "#f0f4f8",
      textColor: "#5a6b7c",
      borderColor: "#e0e8f0",
      enabled: iconToggles.address !== false,
      action: () => {
        trackInteraction("action", "cta_click");
        setActiveModal("address");
      },
    },
    {
      id: "booking",
      label: "Book Now",
      icon: Calendar,
      bgColor: "#eff2fe",
      textColor: "#4f46e5",
      borderColor: "#dfe4fd",
      enabled: iconToggles.booking !== false,
      action: () => {
        trackInteraction("action", "booking_click");
        setActiveModal("booking");
      },
    },
    {
      id: "form",
      label: "Form",
      icon: FileText,
      bgColor: "#e6f9f0",
      textColor: "#059669",
      borderColor: "#cff3e1",
      enabled: iconToggles.form !== false,
      action: () => {
        trackInteraction("action", "cta_click");
        setActiveModal("contact_form");
      },
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      bgColor: "#ebf2fc",
      textColor: "#1877f2",
      borderColor: "#d6e4f9",
      enabled:
        iconToggles.facebook === true ||
        (iconToggles.facebook !== false && Boolean(getSocialUrl("facebook"))),
      action: () => {
        const url = getSocialUrl("facebook") || ("https://facebook.com/" + profile.username);
        window.open(url, "_blank");
      },
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      bgColor: "#fdf0f4",
      textColor: "#e1306c",
      borderColor: "#fbdde5",
      enabled:
        iconToggles.instagram === true ||
        (iconToggles.instagram !== false && Boolean(getSocialUrl("instagram"))),
      action: () => {
        const url = getSocialUrl("instagram") || ("https://instagram.com/" + profile.username);
        window.open(url, "_blank");
      },
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: Youtube,
      bgColor: "#fee2e2",
      textColor: "#dc2626",
      borderColor: "#fecaca",
      enabled:
        iconToggles.youtube === true ||
        (iconToggles.youtube !== false && Boolean(getSocialUrl("youtube"))),
      action: () => {
        const url = getSocialUrl("youtube") || ("https://youtube.com/@" + profile.username);
        window.open(url, "_blank");
      },
    },
    {
      id: "twitter",
      label: "X / Twitter",
      icon: Twitter,
      bgColor: "#f1f5f9",
      textColor: "#0f172a",
      borderColor: "#e2e8f0",
      enabled:
        iconToggles.twitter === true ||
        (iconToggles.twitter !== false && Boolean(getSocialUrl("twitter"))),
      action: () => {
        const url = getSocialUrl("twitter") || ("https://x.com/" + profile.username);
        window.open(url, "_blank");
      },
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      bgColor: "#e0f2fe",
      textColor: "#0284c7",
      borderColor: "#bae6fd",
      enabled:
        iconToggles.linkedin === true ||
        (iconToggles.linkedin !== false && Boolean(getSocialUrl("linkedin"))),
      action: () => {
        const url = getSocialUrl("linkedin") || ("https://linkedin.com/in/" + profile.username);
        window.open(url, "_blank");
      },
    },
    {
      id: "telegram",
      label: "Telegram",
      icon: Send,
      bgColor: "#e0f2fe",
      textColor: "#0369a1",
      borderColor: "#bae6fd",
      enabled:
        iconToggles.telegram === true ||
        (iconToggles.telegram !== false && Boolean(getSocialUrl("telegram"))),
      action: () => {
        const url = getSocialUrl("telegram") || ("https://t.me/" + profile.username);
        window.open(url, "_blank");
      },
    },
    {
      id: "github",
      label: "GitHub",
      icon: Github,
      bgColor: "#f1f5f9",
      textColor: "#1e293b",
      borderColor: "#cbd5e1",
      enabled: iconToggles.github === true || (iconToggles.github !== false && Boolean(getSocialUrl("github"))),
      action: () => { window.open(getSocialUrl("github") || ("https://github.com/" + profile.username), "_blank"); },
    },
    {
      id: "snapchat",
      label: "Snapchat",
      icon: SnapchatIcon,
      bgColor: "#fffde7",
      textColor: "#f59f00",
      borderColor: "#fff3cd",
      enabled: iconToggles.snapchat === true || (iconToggles.snapchat !== false && Boolean(getSocialUrl("snapchat"))),
      action: () => { const url = getSocialUrl("snapchat"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "tiktok",
      label: "TikTok",
      icon: TikTokIcon,
      bgColor: "#f1f5f9",
      textColor: "#010101",
      borderColor: "#e2e8f0",
      enabled: iconToggles.tiktok === true || (iconToggles.tiktok !== false && Boolean(getSocialUrl("tiktok"))),
      action: () => { const url = getSocialUrl("tiktok"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "pinterest",
      label: "Pinterest",
      icon: PinterestIcon,
      bgColor: "#fff0f0",
      textColor: "#E60023",
      borderColor: "#ffd6d6",
      enabled: iconToggles.pinterest === true || (iconToggles.pinterest !== false && Boolean(getSocialUrl("pinterest"))),
      action: () => { const url = getSocialUrl("pinterest"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "threads",
      label: "Threads",
      icon: ThreadsIcon,
      bgColor: "#f1f5f9",
      textColor: "#000000",
      borderColor: "#e2e8f0",
      enabled: iconToggles.threads === true || (iconToggles.threads !== false && Boolean(getSocialUrl("threads"))),
      action: () => { const url = getSocialUrl("threads"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "discord",
      label: "Discord",
      icon: DiscordIcon,
      bgColor: "#eef0fe",
      textColor: "#5865F2",
      borderColor: "#dde0fd",
      enabled: iconToggles.discord === true || (iconToggles.discord !== false && Boolean(getSocialUrl("discord"))),
      action: () => { const url = getSocialUrl("discord"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "twitch",
      label: "Twitch",
      icon: TwitchIcon,
      bgColor: "#f3effe",
      textColor: "#9146FF",
      borderColor: "#e4d9fd",
      enabled: iconToggles.twitch === true || (iconToggles.twitch !== false && Boolean(getSocialUrl("twitch"))),
      action: () => { const url = getSocialUrl("twitch"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "spotify",
      label: "Spotify",
      icon: SpotifyIcon,
      bgColor: "#edfbf4",
      textColor: "#1DB954",
      borderColor: "#d4f7e5",
      enabled: iconToggles.spotify === true || (iconToggles.spotify !== false && Boolean(getSocialUrl("spotify"))),
      action: () => { const url = getSocialUrl("spotify"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "whatsapp_channel",
      label: "WA Channel",
      icon: WhatsAppChannelIcon,
      bgColor: "#e8faf2",
      textColor: "#25D366",
      borderColor: "#ccf5e4",
      enabled: iconToggles.whatsapp_channel === true || (iconToggles.whatsapp_channel !== false && Boolean(getSocialUrl("whatsapp_channel"))),
      action: () => { const url = getSocialUrl("whatsapp_channel"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "behance",
      label: "Behance",
      icon: BehanceIcon,
      bgColor: "#ebf3ff",
      textColor: "#1769FF",
      borderColor: "#d4e5ff",
      enabled: iconToggles.behance === true || (iconToggles.behance !== false && Boolean(getSocialUrl("behance"))),
      action: () => { const url = getSocialUrl("behance"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "dribbble",
      label: "Dribbble",
      icon: DribbbleIcon,
      bgColor: "#fdf0f6",
      textColor: "#EA4C89",
      borderColor: "#fbdaed",
      enabled: iconToggles.dribbble === true || (iconToggles.dribbble !== false && Boolean(getSocialUrl("dribbble"))),
      action: () => { const url = getSocialUrl("dribbble"); if (url) window.open(url, "_blank"); },
    },
    {
      id: "review",
      label: "Review",
      icon: Star,
      bgColor: "#fff8e6",
      textColor: "#d97706",
      borderColor: "#fef0c7",
      enabled: iconToggles.review !== false,
      action: () => {
        if (reviewUrl) {
          window.open(reviewUrl, "_blank");
        } else {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(displayName)}+reviews`, "_blank");
        }
      },
    },
    {
      id: "save_contact",
      label: "Save",
      icon: UserPlus,
      bgColor: "#f1f4f8",
      textColor: "#475569",
      borderColor: "#e2e8f0",
      enabled: iconToggles.save_contact !== false,
      action: handleSaveContact,
    },
    {
      id: "qr",
      label: "QR Code",
      icon: QrCode,
      bgColor: "#f0f7fe",
      textColor: "#0284c7",
      borderColor: "#e0effe",
      enabled: iconToggles.qr !== false,
      action: () => setActiveModal("qr"),
    },
    {
      id: "install",
      label: "Install",
      icon: Smartphone,
      bgColor: "#f1f5f9",
      textColor: "#334155",
      borderColor: "#e2e8f0",
      enabled: iconToggles.install !== false,
      action: () => setActiveModal("install"),
    },
  ];

  const visibleActionIcons = actionIcons.filter((i) => i.enabled);

  // Active social links list for bottom connect bar
  const activeSocialMediaLinks = useMemo(() => {
    const list: Array<{
      platform: string;
      label: string;
      url: string;
      icon: React.ComponentType<{ className?: string }>;
      bgColor: string;
      textColor: string;
      borderColor: string;
    }> = [];

    const platforms = [
      { id: "facebook", label: "Facebook", icon: Facebook, bg: "#ebf2fc", text: "#1877f2", border: "#d6e4f9" },
      { id: "instagram", label: "Instagram", icon: Instagram, bg: "#fdf0f4", text: "#e1306c", border: "#fbdde5" },
      { id: "youtube", label: "YouTube", icon: Youtube, bg: "#fee2e2", text: "#dc2626", border: "#fecaca" },
      { id: "twitter", label: "X / Twitter", icon: Twitter, bg: "#f1f5f9", text: "#0f172a", border: "#e2e8f0" },
      { id: "linkedin", label: "LinkedIn", icon: Linkedin, bg: "#e0f2fe", text: "#0284c7", border: "#bae6fd" },
      { id: "telegram", label: "Telegram", icon: Send, bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
      { id: "github", label: "GitHub", icon: Github, bg: "#f1f5f9", text: "#1e293b", border: "#cbd5e1" },
      { id: "snapchat", label: "Snapchat", icon: SnapchatIcon, bg: "#fffde7", text: "#f59f00", border: "#fff3cd" },
      { id: "tiktok", label: "TikTok", icon: TikTokIcon, bg: "#f1f5f9", text: "#010101", border: "#e2e8f0" },
      { id: "pinterest", label: "Pinterest", icon: PinterestIcon, bg: "#fff0f0", text: "#E60023", border: "#ffd6d6" },
      { id: "threads", label: "Threads", icon: ThreadsIcon, bg: "#f1f5f9", text: "#000000", border: "#e2e8f0" },
      { id: "discord", label: "Discord", icon: DiscordIcon, bg: "#eef0fe", text: "#5865F2", border: "#dde0fd" },
      { id: "twitch", label: "Twitch", icon: TwitchIcon, bg: "#f3effe", text: "#9146FF", border: "#e4d9fd" },
      { id: "spotify", label: "Spotify", icon: SpotifyIcon, bg: "#edfbf4", text: "#1DB954", border: "#d4f7e5" },
      { id: "whatsapp_channel", label: "WA Channel", icon: WhatsAppChannelIcon, bg: "#e8faf2", text: "#25D366", border: "#ccf5e4" },
      { id: "behance", label: "Behance", icon: BehanceIcon, bg: "#ebf3ff", text: "#1769FF", border: "#d4e5ff" },
      { id: "dribbble", label: "Dribbble", icon: DribbbleIcon, bg: "#fdf0f6", text: "#EA4C89", border: "#fbdaed" },
    ];

    for (const p of platforms) {
      const isExplicitOn = iconToggles[p.id as keyof typeof iconToggles] === true;
      const isExplicitOff = iconToggles[p.id as keyof typeof iconToggles] === false;
      const url = getSocialUrl(p.id);

      if (!isExplicitOff && (isExplicitOn || Boolean(url))) {
        list.push({
          platform: p.id,
          label: p.label,
          url: url || ("https://" + (p.id === "twitter" ? "x.com" : p.id + ".com") + "/" + profile.username),
          icon: p.icon,
          bgColor: p.bg,
          textColor: p.text,
          borderColor: p.border,
        });
      }
    }

    return list;
  }, [iconToggles, getSocialUrl, profile.username]);


  // QR Code Image URL
  const profileUrl = typeof window !== "undefined" ? window.location.href : `https://Digicardo.app/${profile.username}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&margin=10`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(displayName)}&cu=INR`)}&margin=10`;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start py-0 sm:py-6 md:py-10 px-0 sm:px-4"
      style={{
        backgroundColor: canvasBg,
        color: textPrimary,
        fontFamily: fontFamilyCss,
        // Inject CSS custom properties for dark-mode adaptive colors
        ["--vcard-modal-bg" as string]: modalBg,
        ["--vcard-modal-border" as string]: modalBorder,
        ["--vcard-card-bg" as string]: cardItemBg,
        ["--vcard-card-border" as string]: cardItemBorder,
        ["--vcard-input-bg" as string]: inputBg,
        ["--vcard-input-border" as string]: inputBorder,
        ["--vcard-text" as string]: textPrimary,
        ["--vcard-text-sub" as string]: textSecondary,
        ["--vcard-divider" as string]: dividerColor,
      } as React.CSSProperties}
    >
      {/* Scoped adaptive styles for modals and hardcoded-color elements */}
      <style>{`
        .vcard-modal-inner { background-color: var(--vcard-modal-bg) !important; border-color: var(--vcard-modal-border) !important; color: var(--vcard-text) !important; }
        .vcard-modal-inner .border-b { border-color: var(--vcard-divider) !important; }
        .vcard-modal-inner .border { border-color: var(--vcard-card-border) !important; }
        .vcard-card-item { background-color: var(--vcard-card-bg) !important; border-color: var(--vcard-card-border) !important; }
        .vcard-input-field { background-color: var(--vcard-input-bg) !important; border-color: var(--vcard-input-border) !important; color: var(--vcard-text) !important; }
        .vcard-text-primary { color: var(--vcard-text) !important; }
        .vcard-text-sub { color: var(--vcard-text-sub) !important; }
        .vcard-copy-btn { background-color: var(--vcard-input-bg) !important; border-color: var(--vcard-input-border) !important; color: var(--vcard-text) !important; }
      `}</style>

      {/* ── Main Phone Card Container (Strict 440px Max Width on Desktop, Responsive on Mobile) ── */}
      <div
        className="w-full max-w-[440px] mx-auto sm:rounded-[36px] overflow-hidden sm:shadow-[0px_10px_35px_rgba(0,0,0,0.08)] sm:border sm:border-[#e6eff8] pb-8 animate-in fade-in-50 duration-300"
        style={{ backgroundColor: surfaceBg, borderColor: modalBorder, maxWidth: "440px" }}
      >

        {/* ── 1. Top Banner & Logo Badge ── */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
          {bannerImages.map((imgUrl, idx) => (
            <div
              key={imgUrl + idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBannerIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}


          {/* Top Right Floating Share & QR Trigger icons */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => setActiveModal("share")}
              aria-label="Share card"
              className="w-8 h-8 rounded-full border text-white flex items-center justify-center transition-colors shadow-sm active:scale-95"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.45)", borderColor: "rgba(255, 255, 255, 0.25)" }}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("qr")}
              aria-label="QR code"
              className="w-8 h-8 rounded-full border text-white flex items-center justify-center transition-colors shadow-sm active:scale-95"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.45)", borderColor: "rgba(255, 255, 255, 0.25)" }}
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── 2. Profile Identity (Avatar Overlap & Headings) ── */}
        <div className="px-5 pt-0 pb-2 text-center space-y-2 relative">

          {/* Circular Overlapping Avatar with Double Border */}
          <div className="relative -mt-14 sm:-mt-16 inline-block">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 border-4 shadow-[0px_8px_25px_rgba(0,0,0,0.12)] mx-auto flex items-center justify-center"
              style={{ backgroundColor: surfaceBg, borderColor: surfaceBg }}
            >
              {avatarUrl ? (
                <div
                  className="w-full h-full rounded-full bg-cover bg-center border border-[#e6eff8]"
                  style={{ backgroundImage: `url(${avatarUrl})` }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white shadow-inner"
                  style={{ backgroundColor: primaryBtnColor }}
                >
                  {/* Academic / Enterprise Cap Icon */}
                  <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Business Display Name */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h1
                className="text-xl sm:text-[22px] font-extrabold tracking-tight uppercase"
                style={{ color: textPrimary }}
              >
                {displayName}
              </h1>
              {showMetaVerified && (
                <div
                  className="inline-flex items-center"
                  style={{ color: primaryBtnColor }}
                  title="Verified Business"
                >
                  <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Tagline / Subtitle */}
            <p
              className="text-xs sm:text-[13px] font-medium leading-relaxed"
              style={{ color: textSecondary }}
            >
              {bio}
            </p>

            {/* Category / Sub-Pill Badge */}
            <div className="pt-0.5">
              <span
                className="inline-block px-3.5 py-1 text-[11px] font-extrabold tracking-wide uppercase shadow-2xs"
                style={{
                  backgroundColor: "#d0f5e5",
                  color: "#00613e",
                  borderRadius: btnRadiusStyle,
                }}
              >
                {categoryText}
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. Primary & Secondary CTA Buttons Row ── */}
        <div className="px-5 space-y-2.5 pt-3">

          {/* ── Services + Products Row: responsive — 2-col when both on, full-width when solo ── */}
          {(viewServiceBtnEnabled || viewProductsBtnEnabled) && (
            <div
              className={`${viewServiceBtnEnabled && viewProductsBtnEnabled
                  ? "grid grid-cols-2 gap-2.5"
                  : "flex"
                }`}
            >
              {/* View Services Button */}
              {viewServiceBtnEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    trackInteraction("action", "cta_click");
                    setCatalogTab("services");
                    setActiveModal("services");
                  }}
                  className={`py-3.5 px-5 font-bold text-sm text-white flex items-center justify-between transition-all active:scale-[0.98] vcard-shimmer-overlay ${viewServiceBtnEnabled && viewProductsBtnEnabled ? "" : "w-full"
                    }`}
                  style={primaryGradientStyle}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{servicesBtnText}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 relative z-10" />
                </button>
              )}

              {/* View Products Button */}
              {viewProductsBtnEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    trackInteraction("action", "cta_click");
                    if (productsUrl) {
                      window.open(productsUrl, "_blank");
                    } else {
                      setCatalogTab("products");
                      setActiveModal("services");
                    }
                  }}
                  className={`py-3.5 px-5 font-bold text-sm text-white flex items-center justify-between transition-all active:scale-[0.98] ${viewServiceBtnEnabled && viewProductsBtnEnabled ? "" : "w-full"
                    }`}
                  style={productsGradientStyle}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <Package className="w-4 h-4" />
                    <span>
                      {viewServiceBtnEnabled && viewProductsBtnEnabled
                        ? productsBtnText
                        : productsBtnText}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 relative z-10" />
                </button>
              )}
            </div>
          )}

          {/* 2-Column Button Row: Pay Now & My Location — responsive based on which are enabled */}
          {(payNowBtnEnabled || locationBtnEnabled) && (
            <div className={payNowBtnEnabled && locationBtnEnabled ? "grid grid-cols-2 gap-2.5" : "flex"}>
              {payNowBtnEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    trackInteraction("action", "cta_click");
                    if (payNowEnabled) setActiveModal("pay");
                  }}
                  className={`py-3 px-3 font-bold text-xs sm:text-sm text-white shadow-[0px_3px_10px_rgba(245,158,11,0.3)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] vcard-shimmer-overlay ${payNowBtnEnabled && locationBtnEnabled ? "" : "w-full"
                    }`}
                  style={payGradientStyle}
                >
                  <CreditCard className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Pay Now</span>
                </button>
              )}
              {locationBtnEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    trackInteraction("action", "cta_click");
                    setActiveModal("address");
                  }}
                  className={`py-3 px-3 font-bold text-xs sm:text-sm text-white shadow-[0px_3px_10px_rgba(107,123,112,0.25)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${payNowBtnEnabled && locationBtnEnabled ? "" : "w-full"
                    }`}
                  style={locationGradientStyle}
                >
                  <MapPin className="w-4 h-4" />
                  <span>My Location</span>
                </button>
              )}
            </div>
          )}

          {/* 24x7 Always Open Status Bar */}
          <div
            className="mt-2 py-2 px-4 border flex items-center justify-between text-xs font-semibold"
            style={{
              backgroundColor: statusBarBg,
              borderColor: statusBarBorder,
              color: textPrimary,
              borderRadius: btnRadiusStyle,
            }}
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: textSecondary }} />
              <span>24×7 Always Open</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold" style={{ color: primaryBtnColor }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryBtnColor }} />
              <span>Open Now</span>
            </div>
          </div>
        </div>

        {/* ── 4. Quick Action Icons Grid (4 Columns, Soft Pastel Rings) ── */}
        {visibleActionIcons.length > 0 && (
          <div className="px-4 pt-5 pb-2">
            <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              {visibleActionIcons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="flex flex-col items-center justify-center gap-1.5 p-1 rounded-2xl transition-all select-none group active:scale-90"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 border shadow-2xs"
                      style={{
                        backgroundColor: isDark
                          ? `${item.bgColor}22`
                          : item.bgColor,
                        color: isDark ? item.textColor : item.textColor,
                        borderColor: isDark ? `${item.textColor}30` : item.borderColor,
                      }}
                    >
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-semibold truncate max-w-[76px] text-center" style={{ color: textPrimary }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="px-5 py-3">
          <div className="h-[1px] w-full" style={{ backgroundColor: dividerColor }} />
        </div>

        {/* ── 5. Share This Digital Card Section ── */}
        <div className="px-5 space-y-2.5">
          <h2 className="text-sm font-extrabold text-left" style={{ color: textPrimary }}>
            Share This Digital Card
          </h2>

          <form onSubmit={handleShareToWhatsApp} className="space-y-2.5">
            <input
              type="tel"
              placeholder="Enter WhatsApp Number (Optional)"
              value={sharePhone}
              onChange={(e) => setSharePhone(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00c853]/40"
              style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
            />

            <button
              type="submit"
              className="w-full py-3.5 px-4 font-bold text-xs sm:text-sm text-white shadow-[0px_4px_14px_rgba(0,200,83,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] vcard-shimmer-overlay"
              style={primaryGradientStyle}
            >
              <MessageCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Share on WhatsApp</span>
            </button>
          </form>
        </div>

        {/* ── 6. Live Metrics Footer Bar ── */}
        <div
          className="mt-6 mx-4 p-4 rounded-2xl border text-center space-y-3"
          style={{ backgroundColor: cardItemBg, borderColor: cardItemBorder }}
        >
          <div
            className="w-full"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              borderColor: dividerColor,
            }}
          >
            {[
              { icon: Eye, color: textSecondary, val: liveStats.views.toLocaleString(), label: "Views" },
              { icon: MousePointerClick, color: textSecondary, val: liveStats.clicks.toLocaleString(), label: "Clicks" },
              { icon: Zap, color: "#f59e0b", val: liveStats.actions.toLocaleString(), label: "Actions" },
              { icon: Calendar, color: "#e04f44", val: liveStats.days_live.toLocaleString(), label: "Days Live" },
              { icon: BarChart3, color: primaryBtnColor, val: liveStats.engage.toLocaleString(), label: "Engage" },
            ].map(({ icon: Ic, color, val, label }, i) => (
              <div key={i} className="px-0.5 text-center">
                <Ic className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
                <div className="text-sm font-black" style={{ color: textPrimary }}>{val}</div>
                <div className="text-[9px] uppercase font-bold" style={{ color: textSecondary }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              suppressHydrationWarning
              className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
              style={{ color: primaryBtnColor }}
            >
              <div className="w-3.5 h-3.5 rounded-xs overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                <Image src="/logo.png" alt="Digicardo" width={14} height={14} className="w-full h-full object-contain" />
              </div>
              <span suppressHydrationWarning>Powered by Digicardo</span>
            </a>
          </div>
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════════════
          INTERACTIVE MODALS & POPUPS
      ═══════════════════════════════════════════════════════════════════════════ */}

      {/* ── MODAL 1: Products & Services Catalogue (Tabbed) ── */}
      {activeModal === "services" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "82vh" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 pb-3 border-b" style={{ borderColor: "var(--vcard-divider)" }}>
              <div>
                <h3 className="text-base font-extrabold vcard-text-primary">
                  Our Services &amp; Products
                </h3>
                <p className="vcard-text-sub text-xs mt-0.5">
                  Tap any item to enquire directly on WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b" style={{ borderColor: "var(--vcard-divider)" }}>
              {(["services", "products"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCatalogTab(tab)}
                  className="flex-1 py-2.5 text-xs font-extrabold capitalize transition-colors"
                  style={{
                    color: catalogTab === tab ? primaryBtnColor : textSecondary,
                    borderBottom: catalogTab === tab ? `2px solid ${primaryBtnColor}` : "2px solid transparent",
                    backgroundColor: "transparent",
                  }}
                >
                  {tab === "services" ? "🛠️ Services" : "📦 Products"}
                </button>
              ))}
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3">

              {/* ── SERVICES TAB ── */}
              {catalogTab === "services" && (() => {
                const serviceList = customOpts.services || [];
                if (serviceList.length > 0) {
                  return serviceList.map((svc: VCardService) => (
                    <div
                      key={svc.id}
                      className="vcard-card-item rounded-2xl border p-3.5 flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="vcard-text-primary font-bold text-xs truncate">{svc.name || "Service"}</h4>
                        {svc.description && (
                          <p className="vcard-text-sub text-[11px] truncate mt-0.5">{svc.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {svc.price && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold" style={{ backgroundColor: "#d0f5e5", color: "#00613e" }}>
                              {svc.price}
                            </span>
                          )}
                          {svc.duration && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}>
                              {svc.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEnquireService(svc.name || "Service")}
                        className="py-1.5 px-3 rounded-xl text-white text-[11px] font-bold flex items-center gap-1 flex-shrink-0 shadow-2xs active:scale-95"
                        style={{ backgroundColor: svcEnquiryBtnColor }}
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{svcEnquiryBtnText}</span>
                      </button>
                    </div>
                  ));
                }
                // Fallback to link blocks
                if (linkBlocks.length > 0) {
                  return linkBlocks.map((block, idx) => {
                    const cfg = block.config as LinkBlockConfig;
                    return (
                      <div
                        key={block.id}
                        className="p-3.5 vcard-card-item rounded-2xl border flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div
                            className="w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#ecf5fe", color: "#006c46" }}
                          >
                            {idx + 1}
                          </div>
                          <div className="truncate">
                            <h4 className="vcard-text-primary font-bold text-xs truncate">{cfg.title || "Service"}</h4>
                            <p className="vcard-text-sub text-[11px] truncate">Verified Business Service</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEnquireService(cfg.title || "Business Service")}
                          className="py-1.5 px-3 rounded-xl text-white text-[11px] font-bold flex items-center gap-1 flex-shrink-0 shadow-2xs active:scale-95"
                          style={{ backgroundColor: svcEnquiryBtnColor }}
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{svcEnquiryBtnText}</span>
                        </button>
                      </div>
                    );
                  });
                }
                // Default placeholder
                return (
                  <div className="py-10 text-center space-y-2">
                    <div className="text-3xl">🛠️</div>
                    <p className="text-xs font-bold vcard-text-sub">No services added yet</p>
                    <p className="text-[11px] vcard-text-sub">Services will appear here once added in settings.</p>
                  </div>
                );
              })()}

              {/* ── PRODUCTS TAB ── */}
              {catalogTab === "products" && (() => {
                const productList = customOpts.products || [];
                if (productList.length > 0) {
                  return productList.map((product: VCardProduct) => (
                    <div
                      key={product.id}
                      className="vcard-card-item rounded-2xl border overflow-hidden hover:border-purple-300 transition-colors"
                    >
                      {product.image_url && (
                        <div className="w-full h-36 bg-[#f0f4f8] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="vcard-text-primary font-bold text-xs truncate">{product.name || "Product"}</h4>
                          {product.description && (
                            <p className="vcard-text-sub text-[11px] truncate mt-0.5">{product.description}</p>
                          )}
                          {product.price && (
                            <span
                              className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                              style={{ backgroundColor: "#ede9fe", color: "#7c3aed" }}
                            >
                              {product.price}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          {product.buy_url && (
                            <button
                              type="button"
                              onClick={() => window.open(product.buy_url!, "_blank")}
                              className="py-1.5 px-3 rounded-xl text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95"
                              style={{ backgroundColor: productsBtnColor }}
                            >
                              <Package className="w-3 h-3" />
                              <span>Buy</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEnquireProduct(product.name || "Product")}
                            className="py-1.5 px-3 rounded-xl text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95"
                            style={{ backgroundColor: prodEnquiryBtnColor }}
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{prodEnquiryBtnText}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ));
                }
                return (
                  <div className="py-10 text-center space-y-2">
                    <div className="text-3xl">📦</div>
                    <p className="text-xs font-bold vcard-text-sub">No products added yet</p>
                    <p className="text-[11px] vcard-text-sub">Products will appear here once added in settings.</p>
                  </div>
                );
              })()}

            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Pay Now (UPI & QR Code) ── */}
      {activeModal === "pay" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#00c853]" />
                <h3 className="vcard-text-primary text-base font-extrabold">
                  UPI &amp; Digital Payment
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scannable UPI QR */}
            <div className="p-4 vcard-card-item rounded-2xl border inline-block space-y-2">
              <div className="w-44 h-44 mx-auto bg-white p-2 rounded-xl border shadow-2xs flex items-center justify-center">
                <Image
                  src={upiQrCodeUrl}
                  alt="UPI QR Code"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="vcard-text-sub text-[11px] font-bold">
                Scan with Google Pay, PhonePe, Paytm, or BHIM UPI
              </p>
            </div>

            {/* Copyable Details */}
            <div className="space-y-2 text-left">
              <div className="p-3 vcard-card-item rounded-xl border flex items-center justify-between">
                <div>
                  <span className="vcard-text-sub block text-[10px] uppercase font-bold">
                    UPI ID
                  </span>
                  <span className="vcard-text-primary text-xs font-mono font-bold">{upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(upiId, "upi_id")}
                  className="p-2 vcard-card-item rounded-xl border border-[#e0e9f2] text-xs font-bold hover:bg-[#f6faff]"
                >
                  {copiedKey === "upi_id" ? <Check className="w-3.5 h-3.5 text-[#00c853]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {upiNumber && (
                <div className="p-3 vcard-card-item rounded-xl border flex items-center justify-between">
                  <div>
                    <span className="vcard-text-sub block text-[10px] uppercase font-bold">
                      UPI Number / Direct Pay
                    </span>
                    <span className="vcard-text-primary text-xs font-mono font-bold">{upiNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(upiNumber, "upi_num")}
                    className="p-2 vcard-card-item rounded-xl border border-[#e0e9f2] text-xs font-bold hover:bg-[#f6faff]"
                  >
                    {copiedKey === "upi_num" ? <Check className="w-3.5 h-3.5 text-[#00c853]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              <div className="p-3 vcard-card-item rounded-xl border flex items-center justify-between">
                <div>
                  <span className="vcard-text-sub block text-[10px] uppercase font-bold">
                    Payment Phone No. (GPay / PhonePe)
                  </span>
                  <span className="vcard-text-primary text-xs font-mono font-bold">{paymentPhone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(paymentPhone, "pay_phone")}
                  className="p-2 vcard-card-item rounded-xl border border-[#e0e9f2] text-xs font-bold hover:bg-[#f6faff]"
                >
                  {copiedKey === "pay_phone" ? <Check className="w-3.5 h-3.5 text-[#00c853]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Bank Account Details ── */}
      {activeModal === "bank" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#f59e0b]" />
                <h3 className="vcard-text-primary text-base font-extrabold">
                  Bank Account Information
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { label: "Bank Name", value: bankName, key: "bank_name" },
                { label: "Account Holder", value: bankHolder, key: "holder" },
                { label: "Account Number", value: bankAccNumber, key: "acc_num" },
                { label: "IFSC Code", value: bankIfsc, key: "ifsc" },
              ].map((field) => (
                <div
                  key={field.key}
                  className="p-3 vcard-card-item rounded-xl border flex items-center justify-between"
                >
                  <div>
                    <span className="vcard-text-sub block text-[10px] uppercase font-bold">
                      {field.label}
                    </span>
                    <span className="vcard-text-primary text-xs font-mono font-bold">{field.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(field.value, field.key)}
                    className="p-2 vcard-card-item rounded-xl border border-[#e0e9f2] text-xs font-bold hover:bg-[#f6faff]"
                  >
                    {copiedKey === field.key ? <Check className="w-3.5 h-3.5 text-[#00c853]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Location & Address ── */}
      {activeModal === "address" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#e04f44]" />
                <h3 className="vcard-text-primary text-base font-extrabold">
                  Our Location &amp; Directions
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 vcard-card-item rounded-2xl border text-left space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#e04f44] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-[#141d23]">{displayName}</h4>
                  <p className="vcard-text-sub text-xs font-medium leading-relaxed">
                    {primaryAddress}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const url = customOpts.map_url?.trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryAddress)}`;
                window.open(url, "_blank");
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
              style={{ backgroundColor: "#00c853", color: "#ffffff" }}
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 5: Book Slot / Appointment ── */}
      {activeModal === "booking" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#4f46e5]" />
                <h3 className="vcard-text-primary text-base font-extrabold">
                  Book Slot / Appointment
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="vcard-input-field w-full h-10 px-3 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={bookPhone}
                  onChange={(e) => setBookPhone(e.target.value)}
                  className="vcard-input-field w-full h-10 px-3 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Preferred Date &amp; Time
                </label>
                <input
                  type="date"
                  required
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="vcard-input-field w-full h-10 px-3 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Service / Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Consultation / Application"
                  value={bookService}
                  onChange={(e) => setBookService(e.target.value)}
                  className="vcard-input-field w-full h-10 px-3 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific requirement or preference..."
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  className="vcard-input-field w-full p-2.5 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
                style={{ backgroundColor: "#00c853", color: "#ffffff" }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm &amp; Send on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: Contact / Inquiry Form ── */}
      {activeModal === "contact_form" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#059669]" />
                <h3 className="vcard-text-primary text-base font-extrabold">
                  Send Inquiry Message
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="vcard-input-field w-full h-10 px-3 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Your Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="vcard-input-field w-full h-10 px-3 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#141d23] mb-1">
                  Your Message / Requirement
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what you need help with..."
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  className="vcard-input-field w-full p-2.5 rounded-xl border border-[#e0e9f2] bg-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
                style={{ backgroundColor: "#00c853", color: "#ffffff" }}
              >
                <Send className="w-4 h-4" />
                <span>Send to WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 7: QR Code Sharing Modal ── */}
      {activeModal === "qr" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#0284c7]" />
                <h3 className="vcard-text-primary text-base font-extrabold">Digital Card QR Code</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 vcard-card-item rounded-2xl border inline-block space-y-2">
              <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border shadow-2xs flex items-center justify-center">
                <Image
                  src={qrCodeUrl}
                  alt="Profile QR Code"
                  width={180}
                  height={180}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-[#141d23] font-bold">{displayName}</p>
              <p className="vcard-text-sub text-[11px] font-mono">{profileUrl}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(profileUrl, "profile_url")}
                className="flex-1 py-3 rounded-xl border border-[#e0e9f2] bg-white text-xs font-bold hover:bg-[#f6faff] flex items-center justify-center gap-1.5"
              >
                {copiedKey === "profile_url" ? <Check className="w-4 h-4 text-[#00c853]" /> : <Copy className="w-4 h-4" />}
                <span>Copy Link</span>
              </button>

              <a
                href={qrCodeUrl}
                download={`${displayName.replace(/\s+/g, "_")}_QR.png`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                style={{ backgroundColor: "#00c853", color: "#ffffff" }}
              >
                <Download className="w-4 h-4" />
                <span>Download QR</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 8: PWA Install Modal ── */}
      {activeModal === "install" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#006c46]" />
                <h3 className="vcard-text-primary text-base font-extrabold">Install on Home Screen</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-left">
              <div className="p-3.5 vcard-card-item rounded-2xl border space-y-1">
                <span className="vcard-text-primary text-xs font-bold block">
                  📱 For iPhone (Safari):
                </span>
                <p className="vcard-text-sub text-[11px] leading-relaxed">
                  Tap the <strong>Share</strong> icon in the bottom menu bar, then scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
                </p>
              </div>

              <div className="p-3.5 vcard-card-item rounded-2xl border space-y-1">
                <span className="vcard-text-primary text-xs font-bold block">
                  🤖 For Android (Chrome):
                </span>
                <p className="vcard-text-sub text-[11px] leading-relaxed">
                  Tap the <strong>Three Dots (⋮)</strong> icon at the top right, then select <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install app&quot;</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl text-white text-xs font-bold"
              style={{ backgroundColor: "#00c853", color: "#ffffff" }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 9: Share Sheet ── */}
      {activeModal === "share" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="vcard-modal-inner w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6eff8]">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#006c46]" />
                <h3 className="vcard-text-primary text-base font-extrabold">Share Digital Card</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-[#f6faff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const profileUrl = typeof window !== "undefined" ? window.location.href : `https://Digicardo.app/${profile.username}`;
                  const text = `Check out ${displayName}'s card: ${profileUrl}`;
                  // Use business WhatsApp number so it goes to the right contact
                  const clean = primaryWhatsapp.replace(/[^0-9+]/g, "");
                  const url = clean
                    ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
                    : `https://wa.me/?text=${encodeURIComponent(text)}`;
                  window.open(url, "_blank");
                }}
                className="p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 hover:brightness-95"
                style={{ backgroundColor: "#e6fbf2", borderColor: "#ccf6e4", color: "#00a86b" }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
                  window.open(url, "_blank");
                }}
                className="p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 hover:brightness-95"
                style={{ backgroundColor: "#ebf2fc", borderColor: "#d6e4f9", color: "#1877f2" }}
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(profileUrl, "modal_share_url")}
                className="p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 hover:brightness-95"
                style={{ backgroundColor: "#f1f4f8", borderColor: "#e2e8f0", color: "#475569" }}
              >
                {copiedKey === "modal_share_url" ? (
                  <Check className="w-5 h-5 text-[#00c853]" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
