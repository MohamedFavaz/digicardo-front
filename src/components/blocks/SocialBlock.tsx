import React from "react";
import type { SocialBlockConfig } from "@/types/blocks";
import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Twitter,
  Video,
} from "lucide-react";

interface SocialBlockProps {
  config: SocialBlockConfig;
}

export function SocialBlock({ config }: SocialBlockProps) {
  const getIcon = () => {
    switch (config.platform) {
      case "github":
        return <Github className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "x":
        return <Twitter className="h-5 w-5" />;
      case "tiktok":
        return <Video className="h-5 w-5" />;
      case "website":
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (config.platform) {
      case "github":
        return "GitHub";
      case "instagram":
        return "Instagram";
      case "linkedin":
        return "LinkedIn";
      case "youtube":
        return "YouTube";
      case "facebook":
        return "Facebook";
      case "x":
        return "X (Twitter)";
      case "tiktok":
        return "TikTok";
      case "website":
      default:
        return "Website";
    }
  };

  return (
    <a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow on ${getLabel()}`}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white hover:shadow-indigo-500/10 active:translate-y-0"
    >
      <span className="text-indigo-400">{getIcon()}</span>
      <span>{getLabel()}</span>
    </a>
  );
}
