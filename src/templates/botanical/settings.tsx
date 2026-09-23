"use client";

import React, { useState, useRef, useMemo } from "react";
import type { TemplateSettingsProps } from "../types";
import type {
  SocialLink,
  ContentLink,
  DocumentBlock,
  DriveBlock,
  QuickActionConfig,
  TemplateAppearanceOptions,
} from "@/types/profile";
import { BOTANICAL_PALETTES } from "./constants";
import { mediaApi } from "@/lib/api/media";
import { resolveMediaUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Palette,
  User,
  Share2,
  Link2,
  FileText,
  HardDrive,
  QrCode,
  Upload,
  Trash2,
  Plus,
  Copy,
  ChevronUp,
  ChevronDown,
  Loader2,
  Check,
  Building2,
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Star,
  ShieldCheck,
  Eye,
  EyeOff,
  Crop,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";

const BACKGROUND_OPTIONS = [
  { id: "botanical", name: "Botanical", icon: "🌿", desc: "Dual leaf branches & organic fluid shapes" },
  { id: "geometric", name: "Geometric", icon: "📐", desc: "Architectural grid & corner bands" },
  { id: "topo", name: "Contours", icon: "🌊", desc: "Executive topographic contour waves" },
  { id: "aura", name: "Ambient", icon: "🌌", desc: "Soft ambient glowing mesh aura" },
  { id: "minimal", name: "Minimal", icon: "💎", desc: "Clean executive gradient accent bar" },
  { id: "marble", name: "Marble", icon: "🏛️", desc: "Luxury marble veining & veins" },
  { id: "tech", name: "Tech", icon: "🌐", desc: "Constellation nodes & matrix lines" },
  { id: "frosted", name: "Frosted", icon: "🪟", desc: "Glass prisms with backdrop blur" },
  { id: "silk", name: "Silk Wave", icon: "🎗️", desc: "Smooth fluid gradient wave ribbons" },
  { id: "bauhaus", name: "Bauhaus", icon: "🏛️", desc: "Modernist geometric composition" },
];

const SOCIAL_PLATFORMS = [
  "linkedin",
  "x",
  "whatsapp",
  "instagram",
  "google_business",
  "youtube",
  "facebook",
  "github",
  "telegram",
  "tiktok",
  "threads",
  "snapchat",
  "pinterest",
  "behance",
  "dribbble",
  "reddit",
  "discord",
  "twitch",
  "medium",
  "quora",
  "spotify",
  "apple_music",
  "google_maps",
  "email",
  "phone",
  "custom",
];

const renderLinkIconPreview = (icon?: string) => {
  const norm = (icon || "services").toLowerCase().trim();
  switch (norm) {
    case "whatsapp":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.06c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31c-.84-1.33-1.28-2.88-1.28-4.47 0-4.44 3.61-8.05 8.05-8.05 2.15 0 4.17.84 5.69 2.36 1.52 1.52 2.36 3.54 2.36 5.69 0 4.44-3.61 8.05-8.09 8.05zm4.42-6.04c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.17.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
        </svg>
      );
    case "instagram":
    case "insta":
    case "ig":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <defs>
            <radialGradient id="settings-ig-grad-icon" r="150%" cx="30%" cy="107%">
              <stop stopColor="#fdf497" offset="0%" />
              <stop stopColor="#fdf497" offset="5%" />
              <stop stopColor="#fd5949" offset="45%" />
              <stop stopColor="#d6249f" offset="60%" />
              <stop stopColor="#285AEB" offset="90%" />
            </radialGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#settings-ig-grad-icon)" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="4.5" stroke="url(#settings-ig-grad-icon)" strokeWidth="2.2" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="url(#settings-ig-grad-icon)" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case "x":
    case "twitter":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#111827">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
    case "yt":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "facebook":
    case "fb":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="#010101">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.62a8.28 8.28 0 0 0 5.17 1.83V7a4.82 4.82 0 0 1-1.27-.31z" />
        </svg>
      );
    case "telegram":
    case "tg":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#229ED9">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.194 1.006.131.832.942z"/>
        </svg>
      );
    case "threads":
      return (
        <svg width="19" height="19" viewBox="0 0 192 192" fill="#000000">
          <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.745C75.2974 44.745 58.7423 58.0772 58.7423 85.045C58.7423 111.445 74.0044 125.745 96.222 125.745C108.647 125.745 119.52 120.916 126.792 112.186L113.882 101.428C108.435 107.579 101.534 110.021 95.8443 110.021C83.826 110.021 75.3371 100.999 75.0592 85.8753H141.62C141.691 84.4533 141.727 83.0039 141.727 81.5273C141.727 50.852 123.633 29.5 96.7963 29.5C66.1957 29.5 42.5 52.8808 42.5 86.8524C42.5 120.824 66.1957 144.205 96.7963 144.205C114.776 144.205 130.639 135.539 140.233 121.725L140.407 121.465L153.255 131.815L153.076 132.083C140.678 150.405 119.98 162.205 96.7963 162.205C54.4988 162.205 20.5 128.433 20.5 86.8524C20.5 45.2718 54.4988 11.5 96.7963 11.5C136.654 11.5 163.727 38.8687 163.727 81.5273C163.727 84.0538 163.637 86.5513 163.46 89.0189L141.537 88.9883ZM75.2917 72.8252C76.4385 61.2755 84.8143 57.545 96.5372 57.545C108.646 57.545 117.151 61.3276 118.067 72.8252H75.2917Z" />
        </svg>
      );
    case "snapchat":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFC00" stroke="#000000" strokeWidth="1.2">
          <path d="M12.002 2.5c-3.666 0-5.999 2.531-5.999 5.86 0 1.096.34 2.45.698 3.197.14.292.054.437-.183.585-.689.43-1.636.853-2.062 1.488-.344.512-.132 1.05.517 1.156.914.15 1.83.18 2.378.694.343.323.332.748.243 1.258-.09.516-.27 1.549.49 1.954.58.309 1.41-.09 2.228-.621.503-.327.971-.242 1.69-.242s1.187-.085 1.69.242c.818.531 1.648.93 2.228.621.76-.405.58-1.438.49-1.954-.089-.51-.1-.935.243-1.258.548-.514 1.464-.544 2.378-.694.649-.106.861-.644.517-1.156-.426-.635-1.373-1.058-2.062-1.488-.237-.148-.323-.293-.183-.585.358-.747.698-2.101.698-3.197 0-3.329-2.333-5.86-5.999-5.86z"/>
        </svg>
      );
    case "pinterest":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#E60023">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.62-5.373-11.987-11.983-11.987z"/>
        </svg>
      );
    case "spotify":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1ED760">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.352-.676.463-1.028.248-2.857-1.745-6.452-2.14-10.686-1.173-.404.092-.807-.16-.899-.564-.092-.403.16-.807.564-.899 4.636-1.06 8.608-.616 11.799 1.332.354.215.465.676.25 1.056zm1.464-3.256c-.27.44-.848.577-1.288.307-3.27-2.01-8.254-2.593-12.122-1.418-.496.15-1.022-.136-1.173-.632-.15-.496.136-1.022.632-1.173 4.417-1.341 9.907-.692 13.644 1.604.44.27.577.848.307 1.312zm.126-3.393c-3.921-2.328-10.38-2.543-14.127-1.405-.6.182-1.237-.164-1.42-.764-.182-.6.164-1.237.764-1.42 4.305-1.307 11.432-1.056 15.938 1.619.539.32.716 1.02.396 1.559-.32.539-1.02.716-1.551.411z"/>
        </svg>
      );
    case "apple_music":
    case "apple":
    case "itunes":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FA243C">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.79 1.43-.58.68-1.1 1.74-1.03 2.8 1.07.08 2.18-.55 2.81-1.36z"/>
        </svg>
      );
    case "github":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#24292F">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case "discord":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      );
    case "reddit":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4500">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      );
    case "twitch":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#9146FF">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      );
    case "behance":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1769FF">
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.401 0-5.755-2.168-5.755-5.999 0-3.964 2.48-6.001 5.677-6.001 3.52 0 5.324 2.378 4.976 6.329h-7.618c.084 1.776 1.348 2.651 2.822 2.651 1.277 0 2.108-.609 2.502-1.393l2.367 1.413zm-7.666-4.999h4.743c-.11-1.428-.908-2.033-2.315-2.033-1.429 0-2.281.696-2.428 2.033zm-9.06-8.001h-7v16h7.027c3.961 0 6.007-1.97 6.007-5.008 0-1.895-.97-3.42-2.585-4.048 1.264-.593 1.954-1.849 1.954-3.321 0-2.585-1.921-3.623-5.403-3.623zm-4 3h3.044c1.464 0 2.456.49 2.456 1.748 0 1.27-.992 1.752-2.456 1.752h-3.044v-3.5zm0 6h3.407c1.699 0 2.836.568 2.836 2.052 0 1.545-1.137 2.048-2.836 2.048h-3.407v-4.1z"/>
        </svg>
      );
    case "dribbble":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#EA4C89">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.18 10.428c-.244-.047-2.373-.448-4.739-.089.444-1.229.805-2.483 1.077-3.738 2.072 1.036 3.398 2.377 3.662 3.827zm-5.751-4.764c-.266 1.205-.618 2.413-1.047 3.593-2.613-.865-5.592-1.332-8.818-1.397.949-1.748 2.417-3.155 4.22-3.992 2.052.413 4.025 1.032 5.645 1.796zm-11.874 3.731c3.15.064 6.06.52 8.625 1.368-.45 1.229-.982 2.42-1.597 3.551-3.619-1.157-7.238-.854-10.74.871.299-2.227 1.681-4.168 3.712-5.79zm-.654 7.747c3.4-.1.749 6.84-.969 10.435.152.492.894.945 1.802 1.344 2.632-1.686 4.385-4.52 4.49-7.781-5.323-.105-10.518 1.488-14.737 4.542.42 1.353 1.272 2.493 2.414 3.253zm9.645 5.097c-1.872.934-4.004 1.461-6.262 1.461-.418 0-.832-.018-1.242-.054 3.876-2.825 8.697-4.296 13.626-4.202-.676 1.246-1.596 2.336-2.697 3.208-1.078.683-2.26 1.189-3.425-1.587zm2.441-2.909c-4.593-.086-9.102 1.289-12.74 3.914-.522-.962-.871-2.029-.993-3.161 3.238-1.611 6.579-1.895 9.923-.812.569-1.05 1.063-2.155 1.482-3.292 2.193-.332 4.168.04 4.394.086.014.152.021.306.021.462 0 1.037-.193 2.028-.548 2.936-.462-.059-.979-.115-1.539-.133z"/>
        </svg>
      );
    case "medium":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      );
    case "quora":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#B92B27">
          <path d="M12.015 0C5.378 0 0 5.378 0 12.015c0 5.093 3.176 9.445 7.668 11.192.176-.569.362-1.395.409-1.921-2.915-1.466-4.838-4.502-4.838-8.04 0-5.074 3.93-9.191 8.776-9.191 4.846 0 8.776 4.117 8.776 9.191 0 4.636-3.284 8.487-7.618 9.102l1.603 2.825c.196.347.534.568.932.568.049 0 .099-.004.148-.011C18.995 24.375 24 18.784 24 12.015 24 5.378 18.622 0 12.015 0z"/>
        </svg>
      );
    case "google_business":
    case "google":
    case "google_reviews":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
        </svg>
      );
    case "google_maps":
    case "maps":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      );
    case "bank":
    case "payment":
    case "finance":
    case "upi":
      return <span className="text-base leading-none">🏦</span>;
    case "meeting":
    case "calendar":
    case "booking":
    case "consultation":
    case "schedule":
      return <span className="text-base leading-none">📅</span>;
    case "location":
    case "map":
    case "office":
    case "headquarters":
    case "address":
      return <span className="text-base leading-none">📍</span>;
    case "brochure":
    case "file":
    case "pdf":
    case "download":
    case "document":
    case "doc":
      return <span className="text-base leading-none">📄</span>;
    case "drive":
    case "vault":
    case "cloud":
      return <span className="text-base leading-none">☁️</span>;
    case "globe":
    case "website":
    case "portal":
    case "web":
      return <span className="text-base leading-none">🌐</span>;
    case "email":
    case "mail":
      return <span className="text-base leading-none">✉️</span>;
    case "phone":
    case "tel":
    case "call":
      return <span className="text-base leading-none">📞</span>;
    case "services":
    case "briefcase":
    case "portfolio":
    case "corporate":
    default:
      return <span className="text-base leading-none">💼</span>;
  }
};

export function BotanicalSettings({
  profile,
  themeTokens,
  onChangeTheme,
  onSave,
  isSaving,
}: TemplateSettingsProps) {
  const custom: TemplateAppearanceOptions = themeTokens.custom_options || {};

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<
    "theme" | "profile" | "socials" | "quickActions" | "links" | "document" | "drive" | "utilities"
  >("theme");

  // Helper to update custom_options safely
  const updateCustom = (updates: Partial<TemplateAppearanceOptions>) => {
    onChangeTheme({
      custom_options: {
        ...custom,
        ...updates,
      },
    });
  };

  // ── Upload states ──
  const [uploadingProfileImg, setUploadingProfileImg] = useState(false);
  const [uploadingCompanyLogo, setUploadingCompanyLogo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  // ── Avatar Crop Modal State ──
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);

  // Handle Profile Photo Selection -> opens Crop Modal
  const handleProfilePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Profile photo must be a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Profile photo must not exceed 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropImageSrc(event.target.result as string);
        setCropZoom(1);
        setCropPan({ x: 0, y: 0 });
      }
    };
    reader.readAsDataURL(file);

    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = "";
    }
  };

  // Allow re-cropping current avatar
  const handleOpenExistingCrop = () => {
    const currentUrl = resolveMediaUrl(custom.profile_image_url || custom.custom_avatar_url || profile?.avatar_url);
    if (!currentUrl) return;
    setCropImageSrc(currentUrl);
    setCropZoom(1);
    setCropPan({ x: 0, y: 0 });
  };

  // Render crop preview on canvas
  const drawCropCanvas = () => {
    const canvas = cropCanvasRef.current;
    const img = cropImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.clip();

    // Scale and center image
    const minScale = Math.max(size / img.width, size / img.height);
    const scale = minScale * cropZoom;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w) / 2 + cropPan.x;
    const y = (size - h) / 2 + cropPan.y;

    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    // Circular border ring
    ctx.strokeStyle = "#2d6a4f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();
  };

  React.useEffect(() => {
    if (!cropImageSrc) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = cropImageSrc;
    img.onload = () => {
      cropImageRef.current = img;
      drawCropCanvas();
    };
  }, [cropImageSrc, cropZoom, cropPan]);

  // Apply Cropped Avatar and Upload
  const handleApplyCroppedAvatar = async () => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return;

    setUploadingProfileImg(true);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setUploadingProfileImg(false);
        setCropImageSrc(null);
        return;
      }

      const croppedFile = new File([blob], "avatar_cropped.png", { type: "image/png" });
      const localDataUrl = canvas.toDataURL("image/png");

      // Set immediately in custom options so Live Preview updates instantly
      updateCustom({
        profile_image_url: localDataUrl,
        custom_avatar_url: localDataUrl,
      });

      try {
        let remoteUrl = "";
        try {
          // 1. Primary: upload as profile avatar so database row is updated
          const media = await mediaApi.uploadAvatar(croppedFile);
          remoteUrl = resolveMediaUrl(media.url);
        } catch {
          // 2. Fallback: upload as generic media image
          const media = await mediaApi.uploadImage(croppedFile, "Profile Avatar");
          remoteUrl = resolveMediaUrl(media.url);
        }

        if (remoteUrl) {
          updateCustom({
            profile_image_url: remoteUrl,
            custom_avatar_url: remoteUrl,
          });
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to upload cropped photo");
      } finally {
        setUploadingProfileImg(false);
        setCropImageSrc(null);
      }
    }, "image/png");
  };

  // Handle Company Logo Upload
  const handleCompanyLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCompanyLogo(true);
    try {
      const media = await mediaApi.uploadImage(file, "Company Logo");
      updateCustom({ company_logo_url: media.url });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload company logo");
    } finally {
      setUploadingCompanyLogo(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = "";
    }
  };

  // Handle PDF Upload
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setPdfError("Only PDF documents are allowed (.pdf).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setPdfError("PDF file size must not exceed 20 MB.");
      return;
    }

    setPdfError(null);
    setUploadingPdf(true);
    try {
      const currentDoc = custom.document_block || {
        title: "Company Profile",
        description: "Download corporate brochure (PDF)",
        file_url: "",
        enabled: true,
      };

      const media = await mediaApi.uploadDocument(file, currentDoc.title || file.name);
      updateCustom({
        document_block: {
          ...currentDoc,
          file_url: media.url,
          file_name: file.name,
          file_size: file.size,
          enabled: true,
        },
      });
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploadingPdf(false);
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = "";
    }
  };

  // ── Social Media Management ──
  const socialLinks: SocialLink[] = useMemo(() => {
    const raw = custom.social_links && Array.isArray(custom.social_links) && custom.social_links.length > 0
      ? custom.social_links
      : [
          { id: "1", platform: "linkedin", url: "https://linkedin.com", enabled: true, is_active: true, order: 1 },
          { id: "2", platform: "x", url: "https://x.com", enabled: true, is_active: true, order: 2 },
          { id: "3", platform: "google_business", url: "https://google.com", enabled: true, is_active: true, order: 3 },
          { id: "4", platform: "youtube", url: "https://youtube.com", enabled: true, is_active: true, order: 4 },
          { id: "5", platform: "instagram", url: "https://instagram.com", enabled: true, is_active: true, order: 5 },
          { id: "6", platform: "website", url: "https://example.com", enabled: true, is_active: true, order: 6 },
        ];
    return raw.map((s: any, idx: number) => ({
      id: s.id || `social_${s.platform || idx}_${idx}`,
      platform: s.platform || "custom",
      name: s.name || (s.platform ? s.platform.replace("_", " ").toUpperCase() : "Link"),
      url: s.url || "",
      enabled: s.enabled !== undefined ? Boolean(s.enabled) : (s.is_active !== undefined ? Boolean(s.is_active) : true),
      is_active: s.is_active !== undefined ? Boolean(s.is_active) : (s.enabled !== undefined ? Boolean(s.enabled) : true),
      order: s.order ?? idx + 1,
    }));
  }, [custom.social_links]);

  const handleAddSocial = (platform: string) => {
    const newId = `social_${platform}_${Date.now()}`;
    const newLink: SocialLink = {
      id: newId,
      platform,
      name: platform === "custom" ? "Custom Link" : platform.replace("_", " ").toUpperCase(),
      url: "",
      enabled: true,
      is_active: true,
      order: socialLinks.length + 1,
    };
    updateCustom({ social_links: [...socialLinks, newLink] });
  };

  const handleUpdateSocial = (id: string | undefined, field: keyof SocialLink, val: any) => {
    if (!id) return;
    const updated = socialLinks.map((s) => {
      if (s.id === id) {
        const next = { ...s, [field]: val };
        if (field === "enabled") next.is_active = val;
        if (field === "is_active") next.enabled = val;
        return next;
      }
      return s;
    });
    updateCustom({ social_links: updated });
  };

  const handleDeleteSocial = (id: string | undefined) => {
    if (!id) return;
    updateCustom({ social_links: socialLinks.filter((s) => s.id !== id) });
  };

  // ── Content Links Management ──
  const rawContentLinks: any[] = custom.content_links || [];
  const contentLinks: ContentLink[] = (rawContentLinks.length > 0
    ? rawContentLinks
    : [
        {
          id: "1",
          headline: "Corporate Services & Solutions",
          description: "Explore enterprise offerings & portfolio",
          url: "https://example.com/services",
          icon: "services",
          featured: true,
          enabled: true,
          order: 1,
        },
        {
          id: "2",
          headline: "Bank & Payment Details",
          description: "Account, IFSC, UPI & billing info",
          url: "https://example.com/payment",
          icon: "bank",
          featured: false,
          enabled: true,
          order: 2,
        },
        {
          id: "3",
          headline: "Schedule Consultation",
          description: "Book a 30-min executive strategy call",
          url: "https://calendly.com",
          icon: "meeting",
          featured: false,
          enabled: true,
          order: 3,
        },
        {
          id: "4",
          headline: "Download Company Profile",
          description: "Corporate brochure & credentials (PDF)",
          url: "https://example.com/brochure.pdf",
          icon: "brochure",
          featured: false,
          enabled: true,
          order: 4,
        },
        {
          id: "5",
          headline: "Corporate Headquarters",
          description: "Business Park, Tower B, Level 8",
          url: "https://maps.google.com",
          icon: "location",
          featured: false,
          enabled: true,
          order: 5,
        },
      ]
  ).map((l: any, idx: number) => ({
    id: l.id || `link_${idx + 1}`,
    headline: l.headline || l.title || "",
    description: l.description || "",
    url: l.url || "",
    icon: l.icon || "services",
    featured: l.featured !== undefined ? l.featured : (l.is_featured !== undefined ? l.is_featured : false),
    enabled: l.enabled !== undefined ? l.enabled : (l.is_active !== undefined ? l.is_active : true),
    order: l.order || idx + 1,
  }));

  const handleAddLink = () => {
    const newId = `link_${Date.now()}`;
    const newLink = {
      id: newId,
      headline: "New Content Headline",
      title: "New Content Headline",
      description: "Optional description or subtitle",
      url: "https://",
      icon: "services",
      featured: false,
      is_featured: false,
      enabled: true,
      is_active: true,
      order: contentLinks.length + 1,
    };
    updateCustom({ content_links: [...contentLinks, newLink] });
  };

  const handleUpdateLink = (id: string | undefined, updates: Partial<ContentLink>) => {
    if (!id) return;
    const updated = contentLinks.map((l) => {
      if (l.id !== id) return l;
      const merged = { ...l, ...updates };
      return {
        ...merged,
        title: merged.headline,
        is_featured: merged.featured,
        is_active: merged.enabled,
      };
    });
    updateCustom({ content_links: updated });
  };

  const handleDuplicateLink = (id: string | undefined) => {
    if (!id) return;
    const target = contentLinks.find((l) => l.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `link_${Date.now()}`,
      headline: `${target.headline} (Copy)`,
      title: `${target.headline} (Copy)`,
      order: contentLinks.length + 1,
    };
    updateCustom({ content_links: [...contentLinks, duplicated] });
  };

  const handleDeleteLink = (id: string | undefined) => {
    if (!id) return;
    updateCustom({ content_links: contentLinks.filter((l) => l.id !== id) });
  };

  const handleMoveLink = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contentLinks.length) return;
    const newLinks = [...contentLinks];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;
    // update order
    const ordered = newLinks.map((l, idx) => ({ ...l, order: idx + 1 }));
    updateCustom({ content_links: ordered });
  };

  return (
    <div className="rounded-[32px] border border-border/80 bg-card p-6 shadow-card space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <h2 className="text-lg font-black text-foreground tracking-tight">
              Botanical Corporate Studio
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Customize backgrounds, branding, social placements, documents, and cards
          </p>
        </div>

        {onSave && (
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-full font-bold px-4 gap-1.5 shadow-sm bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border/60 no-scrollbar">
        {[
          { id: "theme", label: "Style & Colors", icon: Palette },
          { id: "profile", label: "Branding & Bio", icon: User },
          { id: "socials", label: "Social Media", icon: Share2 },
          { id: "quickActions", label: "Quick Actions", icon: Phone },
          { id: "links", label: "Content Links", icon: Link2 },
          { id: "document", label: "PDF Brochure", icon: FileText },
          { id: "drive", label: "Google Drive", icon: HardDrive },
          { id: "utilities", label: "CTA & QR Code", icon: QrCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                isActive
                  ? "bg-brand-50 text-brand-700 border border-brand-200/90 shadow-2xs dark:bg-brand-950/50 dark:text-brand-300"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: STYLE & COLOR PALETTES
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "theme" && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Background Style Picker */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>1. Background Style (10 Layer Designs)</span>
              <span className="text-brand-600 font-bold normal-case text-xs">
                Active: {((custom.bg_style as string) || "botanical").replace(/^bg-/, "")}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {BACKGROUND_OPTIONS.map((bg) => {
                const currentBg = ((custom.bg_style as string) || "botanical").replace(/^bg-/, "");
                const isActive = currentBg === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => updateCustom({ bg_style: bg.id })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? "border-brand-500 bg-brand-50/50 shadow-xs ring-2 ring-brand-400/20"
                        : "border-border bg-card hover:bg-muted/50 hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="text-xl">{bg.icon}</span>
                    <span className="text-xs font-bold text-foreground leading-tight">{bg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Switcher */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              2. Corporate Color Palette
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {Object.values(BOTANICAL_PALETTES).map((pal) => {
                const PALETTE_ALIAS: Record<string, string> = {
                  "executive-forest": "sage",
                  "enterprise-navy": "navy",
                  "noir-gold": "gold",
                  "terracotta-clay": "terracotta",
                  "charcoal-minimal": "charcoal",
                };
                const currentPalette =
                  PALETTE_ALIAS[(custom.color_palette || custom.palette) as string] ||
                  (custom.color_palette || custom.palette) ||
                  "sage";
                const isActive = currentPalette === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => updateCustom({ color_palette: pal.id, custom_colors: {} })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "border-brand-500 bg-brand-50/50 shadow-xs ring-2 ring-brand-400/20"
                        : "border-border bg-card hover:bg-muted/50 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full border border-black/10 shadow-xs" style={{ background: pal.primary }} />
                      <span className="w-5 h-5 rounded-full border border-black/10 shadow-xs" style={{ background: pal.secondary }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">{pal.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Overrides */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                3. Custom Color Overrides (Optional)
              </label>
              {(custom.custom_colors?.primary || custom.custom_colors?.secondary || custom.custom_colors?.background) && (
                <button
                  type="button"
                  onClick={() => updateCustom({ custom_colors: {} })}
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-700 underline cursor-pointer"
                >
                  Reset to Palette Defaults
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Primary Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={custom.custom_colors?.primary || "#2D4A3E"}
                    onChange={(e) =>
                      updateCustom({
                        custom_colors: { ...custom.custom_colors, primary: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-xl border border-border cursor-pointer p-0.5"
                  />
                  <Input
                    value={custom.custom_colors?.primary || ""}
                    placeholder="#2D4A3E"
                    onChange={(e) =>
                      updateCustom({
                        custom_colors: { ...custom.custom_colors, primary: e.target.value },
                      })
                    }
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Secondary / Shape Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={custom.custom_colors?.secondary || "#7B9487"}
                    onChange={(e) =>
                      updateCustom({
                        custom_colors: { ...custom.custom_colors, secondary: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-xl border border-border cursor-pointer p-0.5"
                  />
                  <Input
                    value={custom.custom_colors?.secondary || ""}
                    placeholder="#7B9487"
                    onChange={(e) =>
                      updateCustom({
                        custom_colors: { ...custom.custom_colors, secondary: e.target.value },
                      })
                    }
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Canvas Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={custom.custom_colors?.background || "#F4EFEB"}
                    onChange={(e) =>
                      updateCustom({
                        custom_colors: { ...custom.custom_colors, background: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-xl border border-border cursor-pointer p-0.5"
                  />
                  <Input
                    value={custom.custom_colors?.background || ""}
                    placeholder="#F4EFEB"
                    onChange={(e) =>
                      updateCustom({
                        custom_colors: { ...custom.custom_colors, background: e.target.value },
                      })
                    }
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: BRANDING & PROFILE DETAILS
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "profile" && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Distinct Assets: Profile Photo vs Company Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Profile Photo */}
            <div className="p-4 rounded-2xl border border-border/80 bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-foreground">Profile Photo / Avatar</span>
                </div>
                {(custom.profile_image_url || profile?.avatar_url) && (
                  <button
                    type="button"
                    onClick={handleOpenExistingCrop}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer select-none"
                  >
                    <Crop className="w-3 h-3" />
                    <span>Crop / Adjust</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="relative group w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-emerald-600/60 shadow-xs flex-shrink-0 cursor-pointer"
                  onClick={() => profileFileInputRef.current?.click()}
                  title="Click to change and crop profile photo"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      resolveMediaUrl(
                        custom.profile_image_url ||
                        custom.custom_avatar_url ||
                        profile?.avatar_url
                      ) || "/placeholder-avatar.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("placeholder-avatar.png")) {
                        target.src = "/placeholder-avatar.png";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                    <Crop className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <input
                    type="file"
                    ref={profileFileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfilePhotoSelected}
                    className="hidden"
                  />
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => profileFileInputRef.current?.click()}
                      disabled={uploadingProfileImg}
                      className="rounded-xl text-xs font-bold gap-1 cursor-pointer flex-1"
                    >
                      {uploadingProfileImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingProfileImg ? "Uploading..." : "Upload & Crop"}</span>
                    </Button>
                    {(custom.profile_image_url || profile?.avatar_url) && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleOpenExistingCrop}
                        disabled={uploadingProfileImg}
                        className="rounded-xl text-xs font-bold gap-1 cursor-pointer px-2.5"
                        title="Crop or adjust current photo"
                      >
                        <Crop className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Crop</span>
                      </Button>
                    )}
                  </div>
                  {custom.profile_image_url && (
                    <button
                      type="button"
                      onClick={() => updateCustom({ profile_image_url: undefined })}
                      className="text-[11px] text-red-600 hover:underline text-left cursor-pointer font-medium"
                    >
                      Remove custom photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Company Logo */}
            <div className="p-4 rounded-2xl border border-border/80 bg-muted/30 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-foreground">Company Logo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={custom.company_logo_url || "/logo.png"}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo.png";
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleCompanyLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => logoFileInputRef.current?.click()}
                    disabled={uploadingCompanyLogo}
                    className="rounded-xl text-xs font-bold gap-1 cursor-pointer"
                  >
                    {uploadingCompanyLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploadingCompanyLogo ? "Uploading..." : "Upload Logo"}</span>
                  </Button>
                  {custom.company_logo_url && (
                    <button
                      type="button"
                      onClick={() => updateCustom({ company_logo_url: undefined })}
                      className="text-[11px] text-red-600 hover:underline text-left cursor-pointer"
                    >
                      Remove custom logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Text Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Full Name / Display Name
              </label>
              <Input
                value={custom.display_name_override || profile?.display_name || ""}
                placeholder="e.g. Alex Morgan"
                onChange={(e) => updateCustom({ display_name_override: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Company Name</span>
                </label>
                <div className="inline-flex items-center rounded-lg bg-muted/80 p-0.5 border border-border select-none">
                  <button
                    type="button"
                    onClick={() => updateCustom({ show_company_name: true })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      custom.show_company_name !== false && custom.show_company_name !== "false"
                        ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Show</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCustom({ show_company_name: false })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      custom.show_company_name === false || custom.show_company_name === "false"
                        ? "bg-red-600 text-white shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Hide</span>
                  </button>
                </div>
              </div>
              <Input
                value={custom.company_name !== undefined ? custom.company_name : ""}
                placeholder={custom.show_company_name === false || custom.show_company_name === "false" ? "[Hidden from card] e.g. Nexus Global Solutions Ltd." : "e.g. Nexus Global Solutions Ltd."}
                onChange={(e) => updateCustom({ company_name: e.target.value })}
                disabled={custom.show_company_name === false || custom.show_company_name === "false"}
                className={`text-xs transition-all ${
                  custom.show_company_name === false || custom.show_company_name === "false"
                    ? "opacity-50 bg-muted/40 cursor-not-allowed line-through"
                    : ""
                }`}
              />
              <div className="flex items-center justify-between text-[11px] mt-1.5">
                <span className={custom.show_company_name === false || custom.show_company_name === "false" ? "text-red-600 dark:text-red-400 font-bold" : "text-muted-foreground"}>
                  {custom.show_company_name === false || custom.show_company_name === "false"
                    ? "🚫 Hidden from digital card & live preview"
                    : "✓ Visible on digital card (under profile name)"}
                </span>
                <button
                  type="button"
                  onClick={() => updateCustom({ show_company_name: custom.show_company_name === false || custom.show_company_name === "false" ? true : false })}
                  className="text-brand-600 hover:underline cursor-pointer font-bold select-none text-[11px]"
                >
                  {custom.show_company_name === false || custom.show_company_name === "false" ? "Switch to Show" : "Switch to Hide"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Executive Role / Designation</span>
                </label>
                <div className="inline-flex items-center rounded-lg bg-muted/80 p-0.5 border border-border select-none">
                  <button
                    type="button"
                    onClick={() => updateCustom({ show_executive_role: true })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      custom.show_executive_role !== false && custom.show_executive_role !== "false"
                        ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Show</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCustom({ show_executive_role: false })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      custom.show_executive_role === false || custom.show_executive_role === "false"
                        ? "bg-red-600 text-white shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Hide</span>
                  </button>
                </div>
              </div>
              <Input
                value={custom.executive_role !== undefined ? custom.executive_role : ""}
                placeholder={custom.show_executive_role === false || custom.show_executive_role === "false" ? "[Hidden from card] e.g. Managing Director · Founder" : "e.g. Managing Director · Founder"}
                onChange={(e) => updateCustom({ executive_role: e.target.value })}
                disabled={custom.show_executive_role === false || custom.show_executive_role === "false"}
                className={`text-xs transition-all ${
                  custom.show_executive_role === false || custom.show_executive_role === "false"
                    ? "opacity-50 bg-muted/40 cursor-not-allowed line-through"
                    : ""
                }`}
              />
              <div className="flex items-center justify-between text-[11px] mt-1.5">
                <span className={custom.show_executive_role === false || custom.show_executive_role === "false" ? "text-red-600 dark:text-red-400 font-bold" : "text-muted-foreground"}>
                  {custom.show_executive_role === false || custom.show_executive_role === "false"
                    ? "🚫 Hidden from digital card & live preview"
                    : "✓ Visible as elegant title divider"}
                </span>
                <button
                  type="button"
                  onClick={() => updateCustom({ show_executive_role: custom.show_executive_role === false || custom.show_executive_role === "false" ? true : false })}
                  className="text-brand-600 hover:underline cursor-pointer font-bold select-none text-[11px]"
                >
                  {custom.show_executive_role === false || custom.show_executive_role === "false" ? "Switch to Show" : "Switch to Hide"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={custom.verified_badge !== false}
                  onChange={(e) => updateCustom({ verified_badge: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Show Verified Badge
                </span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-foreground">
                Professional Bio / Tagline
              </label>
              <div className="inline-flex items-center rounded-lg bg-muted/80 p-0.5 border border-border select-none">
                <button
                  type="button"
                  onClick={() => updateCustom({ show_bio: true })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    custom.show_bio !== false && custom.show_bio !== "false"
                      ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Show</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateCustom({ show_bio: false })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    custom.show_bio === false || custom.show_bio === "false"
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <EyeOff className="w-3 h-3" />
                  <span>Hide</span>
                </button>
              </div>
            </div>
            <textarea
              rows={2}
              value={custom.bio_override || profile?.bio || ""}
              placeholder={custom.show_bio === false || custom.show_bio === "false" ? "[Hidden from card]" : "e.g. Enterprise digital solutions & strategic consulting."}
              onChange={(e) => updateCustom({ bio_override: e.target.value })}
              disabled={custom.show_bio === false || custom.show_bio === "false"}
              className={`w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all ${
                custom.show_bio === false || custom.show_bio === "false" ? "opacity-50 bg-muted/40 cursor-not-allowed line-through" : ""
              }`}
            />
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className={custom.show_bio === false || custom.show_bio === "false" ? "text-red-600 dark:text-red-400 font-bold" : "text-muted-foreground"}>
                {custom.show_bio === false || custom.show_bio === "false" ? "🚫 Hidden from digital card & live preview" : "✓ Visible professional bio"}
              </span>
              <button
                type="button"
                onClick={() => updateCustom({ show_bio: custom.show_bio === false || custom.show_bio === "false" ? true : false })}
                className="text-brand-600 hover:underline cursor-pointer font-bold select-none text-[11px]"
              >
                {custom.show_bio === false || custom.show_bio === "false" ? "Switch to Show" : "Switch to Hide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: SOCIAL MEDIA LINKS
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "socials" && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Social Links List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Configured Platforms ({socialLinks.length})
              </label>

              {/* Add Platform Dropdown */}
              <div className="flex items-center gap-1.5">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddSocial(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="rounded-xl border border-input bg-card px-2.5 py-1 text-xs font-bold text-foreground cursor-pointer"
                >
                  <option value="">+ Add Platform...</option>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {socialLinks.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 p-3 rounded-2xl border border-border bg-card shadow-xs"
                >
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={(e) => handleUpdateSocial(s.id, "enabled", e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 cursor-pointer"
                    title="Enable / Disable"
                  />
                  <div className="w-24 text-xs font-extrabold uppercase text-foreground truncate">
                    {s.name || s.platform}
                  </div>
                  <Input
                    value={s.url}
                    placeholder={
                      s.platform === "email" ? "mailto:name@domain.com" :
                      s.platform === "phone" ? "tel:+1234567890" :
                      s.platform === "whatsapp" ? "https://wa.me/..." :
                      s.platform === "custom" ? "https://..." :
                      `https://${s.platform}.com/...`
                    }
                    onChange={(e) => handleUpdateSocial(s.id, "url", e.target.value)}
                    className="text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSocial(s.id)}
                    className="text-muted-foreground hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Delete Platform"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: 4 QUICK ACTION BUTTONS
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "quickActions" && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              4 Circular Quick Action Buttons
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
              <input
                type="checkbox"
                checked={custom.quick_actions?.enabled !== false}
                onChange={(e) =>
                  updateCustom({
                    quick_actions: { ...custom.quick_actions, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-brand-600"
              />
              <span>Enable Quick Actions Bar</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. Office Phone</span>
              </div>
              <Input
                value={custom.quick_actions?.phone?.number || ""}
                placeholder="+91 8593048536"
                onChange={(e) =>
                  updateCustom({
                    quick_actions: {
                      ...custom.quick_actions,
                      phone: { ...custom.quick_actions?.phone, number: e.target.value, enabled: true },
                    },
                  })
                }
                className="text-xs"
              />
            </div>

            {/* WhatsApp */}
            <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. WhatsApp Number & Greeting</span>
              </div>
              <Input
                value={custom.quick_actions?.whatsapp?.number || ""}
                placeholder="+91 8593048536"
                onChange={(e) =>
                  updateCustom({
                    quick_actions: {
                      ...custom.quick_actions,
                      whatsapp: { ...custom.quick_actions?.whatsapp, number: e.target.value, enabled: true },
                    },
                  })
                }
                className="text-xs"
              />
              <Input
                value={custom.quick_actions?.whatsapp?.message || ""}
                placeholder="Hello, I would like to enquire..."
                onChange={(e) =>
                  updateCustom({
                    quick_actions: {
                      ...custom.quick_actions,
                      whatsapp: { ...custom.quick_actions?.whatsapp, message: e.target.value },
                    },
                  })
                }
                className="text-xs"
              />
            </div>

            {/* Email */}
            <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>3. Email Address</span>
              </div>
              <Input
                value={custom.quick_actions?.email?.address || ""}
                placeholder="contact@company.com"
                onChange={(e) =>
                  updateCustom({
                    quick_actions: {
                      ...custom.quick_actions,
                      email: { ...custom.quick_actions?.email, address: e.target.value, enabled: true },
                    },
                  })
                }
                className="text-xs"
              />
            </div>

            {/* Website */}
            <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>4. Website URL</span>
              </div>
              <Input
                value={custom.quick_actions?.website?.url || ""}
                placeholder="https://company.com"
                onChange={(e) =>
                  updateCustom({
                    quick_actions: {
                      ...custom.quick_actions,
                      website: { ...custom.quick_actions?.website, url: e.target.value, enabled: true },
                    },
                  })
                }
                className="text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 5: CONTENT LINK CARDS
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "links" && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Content Link Cards ({contentLinks.length})
            </label>
            <Button
              type="button"
              size="sm"
              onClick={handleAddLink}
              className="rounded-full text-xs font-bold gap-1 bg-brand-600 text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </Button>
          </div>

          <div className="space-y-3">
            {contentLinks.map((link, idx) => (
              <div
                key={link.id}
                className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-muted-foreground">#{idx + 1}</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={link.featured || false}
                        onChange={(e) => handleUpdateLink(link.id, { featured: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-brand-600"
                      />
                      <span className="text-brand-600 font-bold">★ Featured / Highlighted Card</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveLink(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveLink(idx, "down")}
                      disabled={idx === contentLinks.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateLink(link.id)}
                      className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1 text-muted-foreground hover:text-red-600 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Headline / Title
                    </label>
                    <Input
                      value={link.headline}
                      placeholder="e.g. Corporate Services & Solutions"
                      onChange={(e) => handleUpdateLink(link.id, { headline: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Description / Subtitle
                    </label>
                    <Input
                      value={link.description || ""}
                      placeholder="e.g. Explore enterprise offerings & portfolio"
                      onChange={(e) => handleUpdateLink(link.id, { description: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Target URL
                    </label>
                    <Input
                      value={link.url}
                      placeholder="https://example.com"
                      onChange={(e) => handleUpdateLink(link.id, { url: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Icon Style
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl border border-input bg-muted/40 flex items-center justify-center shrink-0 shadow-xs" title="Icon Preview">
                        {renderLinkIconPreview(link.icon)}
                      </div>
                      <select
                        value={
                          link.icon === "meeting" ? "calendar" :
                          (link.icon === "briefcase" || link.icon === "corporate" || link.icon === "portfolio") ? "services" :
                          (link.icon === "file" || link.icon === "pdf" || link.icon === "doc" || link.icon === "download") ? "brochure" :
                          (link.icon === "map" || link.icon === "office" || link.icon === "headquarters" || link.icon === "address") ? "location" :
                          (link.icon === "vault" || link.icon === "cloud") ? "drive" :
                          (link.icon === "website" || link.icon === "portal" || link.icon === "web") ? "globe" :
                          (link.icon === "mail") ? "email" :
                          (link.icon === "tel" || link.icon === "call") ? "phone" :
                          (link.icon === "twitter") ? "x" :
                          (link.icon === "insta" || link.icon === "ig") ? "instagram" :
                          (link.icon === "yt") ? "youtube" :
                          (link.icon === "fb") ? "facebook" :
                          (link.icon === "tg") ? "telegram" :
                          (link.icon === "apple" || link.icon === "itunes") ? "apple_music" :
                          (link.icon === "maps") ? "google_maps" :
                          (link.icon === "google" || link.icon === "google_reviews") ? "google_business" :
                          (link.icon || "services")
                        }
                        onChange={(e) => handleUpdateLink(link.id, { icon: e.target.value })}
                        className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs font-bold text-foreground cursor-pointer"
                      >
                        <optgroup label="🏢 Business & Professional">
                          <option value="services">💼 Briefcase / Services</option>
                          <option value="bank">🏦 Bank / Payment</option>
                          <option value="calendar">📅 Calendar / Consultation</option>
                          <option value="location">📍 Map / Headquarters</option>
                          <option value="brochure">📄 Document / Brochure</option>
                          <option value="drive">☁️ Cloud / Google Drive</option>
                          <option value="globe">🌐 Globe / Website</option>
                          <option value="email">✉️ Email / Contact</option>
                          <option value="phone">📞 Phone / Call</option>
                        </optgroup>
                        <optgroup label="🌐 Social Media & Platforms">
                          <option value="whatsapp">🟢 WhatsApp</option>
                          <option value="instagram">📸 Instagram</option>
                          <option value="linkedin">💼 LinkedIn</option>
                          <option value="x">𝕏 X (Twitter)</option>
                          <option value="youtube">▶️ YouTube</option>
                          <option value="facebook">👥 Facebook</option>
                          <option value="tiktok">🎵 TikTok</option>
                          <option value="telegram">✈️ Telegram</option>
                          <option value="threads">🧵 Threads</option>
                          <option value="snapchat">👻 Snapchat</option>
                          <option value="pinterest">📌 Pinterest</option>
                          <option value="spotify">🎧 Spotify</option>
                          <option value="apple_music">🍎 Apple Music</option>
                          <option value="github">🐙 GitHub</option>
                          <option value="discord">💬 Discord</option>
                          <option value="reddit">🤖 Reddit</option>
                          <option value="twitch">🎮 Twitch</option>
                          <option value="behance">🎨 Behance</option>
                          <option value="dribbble">🏀 Dribbble</option>
                          <option value="medium">✍️ Medium</option>
                          <option value="quora">❓ Quora</option>
                          <option value="google_business">⭐ Google Reviews</option>
                          <option value="google_maps">🗺️ Google Maps</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 6: PDF DOCUMENT SHOWCASE
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "document" && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Corporate Brochure / PDF Document
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
              <input
                type="checkbox"
                checked={custom.document_block?.enabled !== false}
                onChange={(e) =>
                  updateCustom({
                    document_block: {
                      title: custom.document_block?.title || "Corporate Brochure",
                      description: custom.document_block?.description || "Download credentials (PDF)",
                      file_url: custom.document_block?.file_url || "",
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-brand-600"
              />
              <span>Enable Document Card</span>
            </label>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  Document Title
                </label>
                <Input
                  value={custom.document_block?.title || ""}
                  placeholder="e.g. Corporate Brochure"
                  onChange={(e) =>
                    updateCustom({
                      document_block: {
                        ...custom.document_block,
                        title: e.target.value,
                        file_url: custom.document_block?.file_url || "",
                        enabled: true,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  Description / Subtitle
                </label>
                <Input
                  value={custom.document_block?.description || ""}
                  placeholder="e.g. Download credentials & company profile (PDF)"
                  onChange={(e) =>
                    updateCustom({
                      document_block: {
                        ...custom.document_block,
                        description: e.target.value,
                        file_url: custom.document_block?.file_url || "",
                        enabled: true,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>
            </div>

            {/* PDF File Upload or URL */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Upload PDF File (Max 20 MB)</span>
                {custom.document_block?.file_url && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> PDF Attached
                  </span>
                )}
              </div>

              <input
                type="file"
                ref={pdfFileInputRef}
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => pdfFileInputRef.current?.click()}
                  disabled={uploadingPdf}
                  className="rounded-xl text-xs font-bold gap-1 cursor-pointer"
                >
                  {uploadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploadingPdf ? "Uploading PDF..." : "Choose PDF File"}</span>
                </Button>

                {custom.document_block?.file_url && (
                  <a
                    href={custom.document_block.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Document</span>
                  </a>
                )}
              </div>

              {pdfError && <div className="text-xs text-red-600 font-semibold">{pdfError}</div>}

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mt-2 mb-1">
                  Or Direct PDF URL
                </label>
                <Input
                  value={custom.document_block?.file_url || ""}
                  placeholder="https://example.com/company-brochure.pdf"
                  onChange={(e) =>
                    updateCustom({
                      document_block: {
                        ...custom.document_block,
                        title: custom.document_block?.title || "Corporate Brochure",
                        file_url: e.target.value,
                        enabled: true,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 7: GOOGLE DRIVE REPOSITORY
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "drive" && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Google Drive Resource Block
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
              <input
                type="checkbox"
                checked={custom.drive_block?.enabled !== false}
                onChange={(e) =>
                  updateCustom({
                    drive_block: {
                      title: custom.drive_block?.title || "Google Drive Repository",
                      description: custom.drive_block?.description || "Client presentations, media kit & assets",
                      url: custom.drive_block?.url || "",
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-brand-600"
              />
              <span>Enable Drive Card</span>
            </label>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  Title
                </label>
                <Input
                  value={custom.drive_block?.title || ""}
                  placeholder="e.g. Google Drive Repository"
                  onChange={(e) =>
                    updateCustom({
                      drive_block: {
                        ...custom.drive_block,
                        title: e.target.value,
                        url: custom.drive_block?.url || "",
                        enabled: true,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  Description
                </label>
                <Input
                  value={custom.drive_block?.description || ""}
                  placeholder="e.g. Media kit, presentations & resources"
                  onChange={(e) =>
                    updateCustom({
                      drive_block: {
                        ...custom.drive_block,
                        description: e.target.value,
                        url: custom.drive_block?.url || "",
                        enabled: true,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                Shareable Google Drive Link
              </label>
              <Input
                value={custom.drive_block?.url || ""}
                placeholder="https://drive.google.com/drive/folders/..."
                onChange={(e) =>
                  updateCustom({
                    drive_block: {
                      ...custom.drive_block,
                      title: custom.drive_block?.title || "Google Drive Repository",
                      url: e.target.value,
                      enabled: true,
                    },
                  })
                }
                className="text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 8: CTA BUTTONS & QR CODE
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "utilities" && (
        <div className="space-y-4 animate-in fade-in-50">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
            Actions, Save Contact &amp; QR Code
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={custom.save_contact_enabled !== false}
                  onChange={(e) => updateCustom({ save_contact_enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <span>Enable &quot;Save Business Card&quot; (vCard)</span>
              </label>
              <p className="text-[11px] text-muted-foreground">
                Generates and downloads an instant .vcf contact card on user devices.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={custom.share_profile_enabled !== false}
                  onChange={(e) => updateCustom({ share_profile_enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <span>Enable &quot;Share Profile&quot; Button</span>
              </label>
              <p className="text-[11px] text-muted-foreground">
                Invokes native mobile share or copies the profile link to the clipboard.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-brand-600" />
                <span>Live Scannable QR Code</span>
              </span>
              <input
                type="checkbox"
                checked={custom.qr_code_enabled !== false}
                onChange={(e) => updateCustom({ qr_code_enabled: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  QR Title
                </label>
                <Input
                  value={custom.qr_title || "Scan Business Card"}
                  onChange={(e) => updateCustom({ qr_title: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                  QR Subtitle
                </label>
                <Input
                  value={custom.qr_desc || "Instant corporate contact save & vCard"}
                  onChange={(e) => updateCustom({ qr_desc: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                Target URL (Optional · Defaults to your live profile)
              </label>
              <Input
                placeholder="https://digicardo.app/username (Leave empty for default profile)"
                value={custom.qr_target_url || ""}
                onChange={(e) => updateCustom({ qr_target_url: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="pt-2 border-t border-border flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-border bg-white p-1.5 shadow-2xs flex-shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(custom.qr_target_url || "https://digicardo.app")}&margin=2`}
                  alt="Live QR Preview"
                  className="w-full h-full object-contain"
                  suppressHydrationWarning
                />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real Scannable QR Code Active</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Smartphone cameras can directly scan this code to load your profile, or click the card to expand and download.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── INTERACTIVE CIRCULAR AVATAR CROP MODAL ── */}
      {cropImageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-card rounded-[28px] sm:rounded-[32px] border border-border p-4 sm:p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-extrabold text-foreground">Crop &amp; Position Avatar</h3>
              </div>
              <button
                type="button"
                onClick={() => setCropImageSrc(null)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              Drag photo to reposition inside the circle. Adjust slider to zoom.
            </p>

            {/* Crop Interactive Canvas */}
            <div
              className="relative w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] max-w-[calc(100vw-64px)] max-h-[calc(100vw-64px)] mx-auto rounded-full overflow-hidden bg-slate-900 border-4 border-emerald-600/90 shadow-2xl cursor-grab active:cursor-grabbing select-none touch-none"
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - cropPan.x, y: e.clientY - cropPan.y });
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                setCropPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setIsDragging(true);
                setDragStart({ x: touch.clientX - cropPan.x, y: touch.clientY - cropPan.y });
              }}
              onTouchMove={(e) => {
                if (!isDragging) return;
                const touch = e.touches[0];
                setCropPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
              }}
              onTouchEnd={() => setIsDragging(false)}
            >
              <canvas ref={cropCanvasRef} className="w-full h-full" />
            </div>

            {/* Zoom Slider Controls */}
            <div className="space-y-1.5 px-4 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Zoom</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold">{Math.round(cropZoom * 100)}%</span>
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={cropZoom}
                onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-muted rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCropImageSrc(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyCroppedAvatar}
                disabled={uploadingProfileImg}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {uploadingProfileImg ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{uploadingProfileImg ? "Saving..." : "Apply & Crop"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
