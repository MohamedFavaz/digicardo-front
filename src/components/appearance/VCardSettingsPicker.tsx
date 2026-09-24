"use client";

import * as React from "react";
import Image from "next/image";
import {
  Sparkles,
  Briefcase,
  CreditCard,
  Landmark,
  Calendar,
  Star,
  Layers,
  Sliders,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Send,
  Share2,
  QrCode,
  UserPlus,
  Smartphone,
  Palette,
  Image as ImageIcon,
  Check,
  Upload,
  Camera,
  Loader2,
  Trash2,
  Zap,
  Crop,
  Plus,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Navigation,
  ShoppingBag,
  Package,
} from "lucide-react";

// ── Inline SVG brand icons not available in lucide-react ──
const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.344 4.208-.01.04-.023.066-.03.098-.05.197-.076.349-.076.46 0 .51.36.985.858.985.146 0 .333-.04.513-.076.208-.044.42-.076.637-.076.397 0 .762.112 1.016.429.244.306.414.785.3 1.41-.255 1.349-1.483 1.799-1.994 1.965l-.241.085c-.47.2-.81.51-1.07.862-.228.306-.365.648-.386.963a.416.416 0 0 1-.065.193c-.07.11-.19.17-.36.17-.17 0-.36-.05-.56-.1-.47-.12-.995-.25-1.548-.25-.38 0-.726.064-1.057.193-.385.15-.75.4-1.13.685-.455.336-.933.689-1.54.689-.608 0-1.086-.353-1.54-.69-.38-.284-.747-.534-1.13-.684-.33-.13-.676-.194-1.057-.194-.553 0-1.079.13-1.548.25-.2.05-.39.1-.56.1-.17 0-.29-.06-.36-.17a.42.42 0 0 1-.065-.193c-.02-.315-.158-.657-.386-.963-.26-.352-.6-.662-1.07-.862l-.24-.085C2.907 14.016 1.68 13.566 1.424 12.217c-.115-.625.056-1.104.3-1.41.254-.317.62-.43 1.016-.429.216 0 .43.032.637.076.18.037.367.076.513.076.497 0 .858-.476.858-.984 0-.112-.027-.264-.076-.461-.007-.032-.02-.058-.03-.098-.058-.99-.185-3.015.344-4.208C6.573 1.069 9.916.793 12.206.793z"/>
  </svg>
);
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.27a8.23 8.23 0 0 0 4.82 1.55V7.38a4.85 4.85 0 0 1-1.05-.69z"/>
  </svg>
);
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.371-.885h-.048c-.beverage.726.23 1.283.679 1.657 1.14l-1.224 1.6c-.828-.637-1.857-.96-3.057-.96h-.035c-1.974.013-3.241.924-3.293 2.393-.027.756.27 1.395.887 1.851.643.47 1.567.707 2.747.742.84.022 1.617-.109 2.309-.39.697-.283 1.236-.71 1.608-1.273.267-.399.454-.852.566-1.353a11.882 11.882 0 0 0-2.782-.002c-.468.038-.89.11-1.261.216l-.527-1.934c.52-.141 1.09-.232 1.7-.27.76-.048 1.55-.018 2.354.088-.02-.136-.047-.267-.082-.39z"/>
  </svg>
);
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
const TwitchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
  </svg>
);
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);
const WhatsAppChannelIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const BehanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-.16 1.34-.49.34-1.055.59-1.69.74-.625.16-1.275.23-1.95.23H0V4.51h6.938zm-.34 4.87c.585 0 1.05-.14 1.405-.41.35-.28.525-.7.525-1.26 0-.31-.057-.57-.17-.78-.115-.21-.27-.38-.462-.5-.196-.12-.42-.2-.67-.24-.26-.04-.53-.06-.81-.06H3.24v3.25h3.357zm.16 5.1c.32 0 .616-.03.89-.09.275-.06.512-.16.712-.3.2-.14.36-.33.475-.57.115-.24.172-.54.172-.91 0-.73-.196-1.25-.588-1.54-.39-.3-.916-.44-1.574-.44H3.24v3.86H6.76zm10.25-3.85c-.14.2-.28.36-.42.46-.14.09-.31.14-.52.14-.19 0-.37-.05-.55-.15-.17-.1-.33-.24-.46-.43-.13-.19-.22-.41-.29-.65-.07-.25-.1-.51-.1-.79 0-.53.1-.99.3-1.38.2-.39.52-.58.97-.58.49 0 .84.17 1.06.5.22.34.33.8.33 1.38 0 .37-.1.7-.3.99l-.02.03zm3.44-6.27H13.8v1.42h5.65V4.35zm1.57 8.6c-.22-.66-.54-1.23-.96-1.71-.42-.48-.94-.86-1.55-1.14-.61-.28-1.3-.42-2.07-.42-.78 0-1.47.14-2.09.41-.62.28-1.15.67-1.59 1.17-.44.5-.78 1.1-1.01 1.78-.24.68-.36 1.43-.36 2.23 0 .82.12 1.58.36 2.27.24.7.58 1.3 1.02 1.8.44.5.97.9 1.59 1.17.62.28 1.31.41 2.09.41.78 0 1.48-.14 2.09-.41.62-.27 1.14-.65 1.57-1.13.43-.48.77-1.07 1.01-1.76.24-.69.36-1.45.36-2.28 0-.79-.11-1.52-.33-2.18z"/>
  </svg>
);
const DribbbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.048 6.39 1.73 1.358 3.92 2.166 6.298 2.166 1.42 0 2.77-.29 4.006-.806zm-9.88-2.65c.25-.47 3.22-5.79 8.5-7.503.18-.058.36-.108.54-.153a33.76 33.76 0 0 0-.422-1.034c-5.194 1.552-10.24 1.49-10.72 1.484a10.057 10.057 0 0 0-.006.5c0 2.68 1.01 5.127 2.665 6.957zm-2.428-8.61c.49.01 4.81.062 9.688-1.28-1.74-3.09-3.61-5.69-3.88-6.066-2.914 1.376-5.044 4.076-5.808 7.345zm7.56-8.05c.28.39 2.18 2.99 3.9 6.16 3.72-1.393 5.29-3.513 5.477-3.8-1.7-1.513-3.932-2.43-6.384-2.43-.35 0-.694.024-1.033.066zm9.133 4.7c-.22.307-1.95 2.55-5.818 4.1.245.5.47 1.016.68 1.53.07.18.143.36.21.542 3.41-.43 6.8.26 7.14.328-.024-2.42-.88-4.645-2.28-6.5z"/>
  </svg>
);


import { Input } from "@/components/ui/input";
import { mediaApi } from "@/lib/api/media";
import type { Profile, ThemeTokens, VCardCustomOptions, VCardActionIconToggles, VCardProduct, VCardService } from "@/types/profile";
import { cn, resolveMediaUrl } from "@/lib/utils";

export interface VCardSettingsPickerProps {
  profile?: Profile | null;
  themeTokens: ThemeTokens;
  onChangeTheme: (updated: Partial<ThemeTokens>) => void;
  stepNumber?: number;
  defaultOpen?: boolean;
  onUpdateProfile?: (updated: Partial<Profile>) => void;
}

const BANNER_PRESETS = [
  {
    name: "Modern Corporate",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Architectural Glass",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Creative Studio",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Dark Tech Mesh",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  },
];

const PRIMARY_COLOR_SWATCHES = [
  { label: "Emerald Green (Default)", color: "#00c853" },
  { label: "Deep Forest", color: "#006c46" },
  { label: "Royal Blue", color: "#0284c7" },
  { label: "Vibrant Violet", color: "#7047eb" },
  { label: "Rose Coral", color: "#e11d48" },
  { label: "Golden Amber", color: "#f59e0b" },
  { label: "Dark Slate", color: "#0f172a" },
];

const PAY_COLOR_SWATCHES = [
  { label: "Golden Amber (Default)", color: "#f59e0b" },
  { label: "Emerald Mint", color: "#10b981" },
  { label: "Sky Blue", color: "#0ea5e9" },
  { label: "Royal Indigo", color: "#6366f1" },
  { label: "Crimson Red", color: "#dc2626" },
];

const LOCATION_COLOR_SWATCHES = [
  { label: "Muted Charcoal (Default)", color: "#6b7b70" },
  { label: "Deep Slate", color: "#1e293b" },
  { label: "Ocean Teal", color: "#0f766e" },
  { label: "Midnight Blue", color: "#1e3a8a" },
  { label: "Neutral Gray", color: "#4b5563" },
];


// ─── ProductEditor: per-product card with image upload ───────────────────────
interface ProductEditorProps {
  product: VCardProduct;
  index: number;
  onUpdate: (updated: VCardProduct) => void;
  onRemove: () => void;
}

function ProductEditor({ product, index, onUpdate, onRemove }: ProductEditorProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setUploadErr("Only JPEG, PNG, WebP, or GIF images are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadErr("Image must be under 10 MB.");
      return;
    }
    setUploadErr(null);
    setIsUploading(true);
    try {
      // Use uploadImage (permanent media storage) — NOT uploadCover which
      // overwrites the single profile cover_url slot and returns a non-permanent URL.
      const media = await mediaApi.uploadImage(file);
      onUpdate({ ...product, image_url: media.url });
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 space-y-3 relative">
      {/* Product number badge + remove */}
      <div className="flex items-center justify-between">
        <span className="w-6 h-6 rounded-lg bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Remove product"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image Upload Area */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold text-foreground">Product Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageUpload}
          className="hidden"
          id={`product-img-${product.id}`}
        />
        {product.image_url ? (
          <div className="relative group w-full h-28 rounded-xl overflow-hidden border border-border/70 bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name || "Product"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-lg bg-white text-[11px] font-bold text-foreground flex items-center gap-1 shadow-sm"
              >
                <Camera className="w-3 h-3" />
                <span>Change</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ ...product, image_url: "" })}
                className="px-3 py-1.5 rounded-lg bg-white text-[11px] font-bold text-destructive flex items-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-24 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 hover:bg-muted/50 hover:border-brand-400 transition-all flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-[11px] font-bold">Upload Product Image</span>
                <span className="text-[10px]">JPEG, PNG, WebP, GIF</span>
              </>
            )}
          </button>
        )}
        {uploadErr && <p className="text-[11px] text-destructive font-bold">{uploadErr}</p>}
      </div>

      {/* Product Name */}
      <div className="space-y-1">
        <label className="block text-[11px] font-extrabold text-foreground">Product Name *</label>
        <Input
          type="text"
          placeholder="e.g. Pancard Service, Premium Package"
          value={product.name}
          onChange={(e) => onUpdate({ ...product, name: e.target.value })}
          className="h-9 text-xs"
        />
      </div>

      {/* Price + Description row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold text-foreground">Price</label>
          <Input
            type="text"
            placeholder="₹499 / Free"
            value={product.price || ""}
            onChange={(e) => onUpdate({ ...product, price: e.target.value })}
            className="h-9 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold text-foreground">Short Description</label>
          <Input
            type="text"
            placeholder="Quick processing"
            value={product.description || ""}
            onChange={(e) => onUpdate({ ...product, description: e.target.value })}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export function VCardSettingsPicker({
  profile,
  themeTokens,
  onChangeTheme,
  stepNumber = 4,
  defaultOpen = false,
  onUpdateProfile,
}: VCardSettingsPickerProps) {
  const [isCardOpen, setIsCardOpen] = React.useState(defaultOpen);
  const [openSection, setOpenSection] = React.useState<
    "branding" | "colors" | "services" | "payments" | "bank" | "booking" | "icons" | "social" | null
  >("branding");

  const [isUploadingBanner, setIsUploadingBanner] = React.useState(false);
  const [bannerUploadProgress, setBannerUploadProgress] = React.useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  // Guard: prevents a second upload from starting while one is already in flight
  const uploadInProgressRef = React.useRef(false);

  // Avatar Crop Modal State
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [cropZoom, setCropZoom] = React.useState(1);
  const [cropPan, setCropPan] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  const bannerFileInputRef = React.useRef<HTMLInputElement>(null);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);
  const cropCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const cropImageRef = React.useRef<HTMLImageElement | null>(null);

  const opts: VCardCustomOptions = themeTokens.custom_options || {};

  const updateCustomOptions = (partialOpts: Partial<VCardCustomOptions>) => {
    const updatedCustom = { ...opts, ...partialOpts };
    onChangeTheme({
      custom_options: updatedCustom,
    });
  };

  const updateActionIcon = (iconKey: keyof VCardActionIconToggles, value: boolean) => {
    const currentIcons = opts.active_action_icons || {};
    updateCustomOptions({
      active_action_icons: {
        ...currentIcons,
        [iconKey]: value,
      },
    });
  };

    const updateSocialUrl = (platform: string, url: string) => {
    const currentUrls = opts.social_urls || {};
    const updatedUrls = { ...currentUrls, [platform]: url };
    const currentIcons = opts.active_action_icons || {};
    const isNowActive = url.trim().length > 0 ? true : currentIcons[platform as keyof VCardActionIconToggles];

    updateCustomOptions({
      social_urls: updatedUrls,
      active_action_icons: {
        ...currentIcons,
        [platform]: isNowActive,
      },
    });
  };

  const socialUrls = opts.social_urls || {};

  const activeIcons = opts.active_action_icons || {};

  /**
   * Icons that are ENABLED by default (backward-compatible with existing profiles).
   * New/additional social platforms must be explicitly selected to show.
   */
  const DEFAULT_ENABLED_ICON_IDS = new Set([
    "call", "email", "website", "bank", "address",
    "booking", "form", "review", "qr", "save_contact", "install",
    "facebook", "instagram", "youtube", "twitter", "linkedin", "telegram", "github",
  ]);

  /** Returns true if the icon should be shown on the card */
  const isIconActive = (id: string): boolean => {
    const stored = activeIcons[id as keyof VCardActionIconToggles];
    if (stored === true) return true;
    if (stored === false) return false;
    // undefined → use default
    return DEFAULT_ENABLED_ICON_IDS.has(id);
  };

  // List of active banner images
  const currentBannerImages = React.useMemo(() => {
    const list: string[] = [];
    if (opts.banner_images && opts.banner_images.length > 0) {
      list.push(...opts.banner_images.filter(Boolean));
    } else if (opts.banner_image_url) {
      list.push(opts.banner_image_url);
    }
    return list;
  }, [opts.banner_images, opts.banner_image_url]);

  const toggleSection = (
    sec: "branding" | "colors" | "services" | "payments" | "bank" | "booking" | "icons" | "social"
  ) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  // ── Cover Banner Multi-Image Upload ──
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Snapshot file list immediately while e.target.files is intact
    const fileList = Array.from(files);
    const total = fileList.length;

    // Prevent a second upload from starting if one is already in flight
    if (uploadInProgressRef.current) return;
    uploadInProgressRef.current = true;

    // Clear previous error and prepare upload state
    setUploadError(null);
    setBannerUploadProgress(null);
    setIsUploadingBanner(true);

    try {
      const newUrls: string[] = [];
      const errors: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // Update progress indicator
        setBannerUploadProgress(
          total > 1 ? `Uploading ${i + 1} of ${total}...` : "Uploading photo..."
        );

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          errors.push(`"${file.name}" is not supported. Please upload JPEG, PNG, or WebP.`);
          continue;
        }
        if (file.size > 8 * 1024 * 1024) {
          errors.push(`"${file.name}" exceeds the 8 MB limit.`);
          continue;
        }
        try {
          // Use uploadImage (generic media storage) — saves to permanent media library
          const media = await mediaApi.uploadImage(file);
          if (media && media.url) {
            newUrls.push(media.url);
          }
        } catch (err) {
          const msg =
            err instanceof Error
              ? err.message
              : "Upload failed. Check your connection and try again.";
          errors.push(`"${file.name}": ${msg}`);
        }
      }

      if (errors.length > 0) {
        setUploadError(errors.join(" | "));
      }

      if (newUrls.length > 0) {
        const existing =
          opts.banner_images && opts.banner_images.length > 0
            ? opts.banner_images
            : opts.banner_image_url
            ? [opts.banner_image_url]
            : [];
        const merged = Array.from(new Set([...existing, ...newUrls]));
        const primaryBanner = merged[0] || "";
        updateCustomOptions({
          banner_images: merged,
          banner_image_url: primaryBanner,
        });

        if (onUpdateProfile && primaryBanner) {
          onUpdateProfile({
            cover_url: primaryBanner,
          });
        }
      }
    } finally {
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = "";
      }
      uploadInProgressRef.current = false;
      setIsUploadingBanner(false);
      setBannerUploadProgress(null);
    }
  };

  // Remove specific banner image from list
  const handleRemoveBannerImage = (urlToRemove: string) => {
    const existing = currentBannerImages.filter((u) => u !== urlToRemove);
    const primaryBanner = existing[0] || "";
    updateCustomOptions({
      banner_images: existing,
      banner_image_url: primaryBanner,
    });
    if (onUpdateProfile) {
      onUpdateProfile({
        cover_url: primaryBanner,
      });
    }
  };

  const [customBannerInputUrl, setCustomBannerInputUrl] = React.useState("");

  // Add preset banner image (toggle)
  const handleTogglePresetBanner = (presetUrl: string) => {
    const existing = currentBannerImages;
    let updated: string[];
    if (existing.includes(presetUrl)) {
      updated = existing.filter((u) => u !== presetUrl);
    } else {
      updated = [...existing, presetUrl];
    }
    const primaryBanner = updated[0] || "";
    updateCustomOptions({
      banner_images: updated,
      banner_image_url: primaryBanner,
    });
    if (onUpdateProfile) {
      onUpdateProfile({
        cover_url: primaryBanner,
      });
    }
  };

  // Add custom URL to banner slideshow
  const handleAddCustomUrlBanner = () => {
    if (!customBannerInputUrl.trim()) return;
    const url = customBannerInputUrl.trim();
    const existing = currentBannerImages;
    if (!existing.includes(url)) {
      const updated = [...existing, url];
      const primaryBanner = updated[0] || "";
      updateCustomOptions({
        banner_images: updated,
        banner_image_url: primaryBanner,
      });
      if (onUpdateProfile) {
        onUpdateProfile({
          cover_url: primaryBanner,
        });
      }
    }
    setCustomBannerInputUrl("");
  };

  // ── Profile Photo File Selected -> Open Crop Modal ──
  const handleAvatarFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Profile photo must be a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Profile photo must not exceed 10 MB.");
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

    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.value = "";
    }
  };

  // Render crop preview on canvas
  React.useEffect(() => {
    if (!cropImageSrc) return;

    const img = new window.Image();
    img.src = cropImageSrc;
    img.onload = () => {
      cropImageRef.current = img;
      drawCropCanvas();
    };
  }, [cropImageSrc, cropZoom, cropPan]);

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

    // Draw circular clip
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

    // Draw circular border ring
    ctx.strokeStyle = "#00c853";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();
  };

  // Confirm Crop & Upload
  const handleApplyCroppedAvatar = async () => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return;

    setIsUploadingAvatar(true);
    setUploadError(null);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsUploadingAvatar(false);
        setCropImageSrc(null);
        return;
      }

      const croppedFile = new File([blob], "avatar_cropped.png", { type: "image/png" });
      const localDataUrl = canvas.toDataURL("image/png");

      // Set immediately in custom options so Live Preview updates instantly
      updateCustomOptions({ custom_avatar_url: localDataUrl });

      try {
        const media = await mediaApi.uploadAvatar(croppedFile);
        updateCustomOptions({ custom_avatar_url: media.url, profile_image_url: media.url });
        onUpdateProfile?.({
          avatar_url: media.url,
          version: (profile?.version ?? 0) + 1,
        });
      } catch (err: unknown) {
        setUploadError(err instanceof Error ? err.message : "Failed to upload avatar");
      } finally {
        setIsUploadingAvatar(false);
        setCropImageSrc(null);
      }
    }, "image/png");
  };

  // Remove Avatar
  const handleRemoveAvatar = async () => {
    updateCustomOptions({ custom_avatar_url: "", profile_image_url: "" });
    onUpdateProfile?.({ avatar_url: undefined });
    try {
      await mediaApi.deleteAvatar();
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all">
      {/* ── Collapsible Header Button ── */}
      <button
        type="button"
        onClick={() => setIsCardOpen(!isCardOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors select-none group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-black text-xs flex-shrink-0">
            {stepNumber}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base text-foreground tracking-tight group-hover:text-brand-600 transition-colors">
                Business Card Settings
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-brand-600" />
                <span>VCard Options</span>
              </span>
              <span className="text-[11px] text-brand-700 font-bold bg-brand-50 border border-brand-200/70 px-2 py-0.5 rounded-md">
                Active: VCard Studio
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1">
              Upload multi-banner cover slideshows, crop profile avatar photos, customize action buttons, and configure verified business credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="hidden sm:inline text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
            {isCardOpen ? "Collapse" : "Customize"}
          </span>
          <div className="w-7 h-7 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-muted transition-all">
            {isCardOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* ── Collapsible Content Body ── */}
      {isCardOpen && (
        <div className="p-6 sm:p-7 pt-4 space-y-6 border-t border-border/60 animate-in fade-in duration-200">

      {uploadError && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-start gap-2">
          <span className="flex-1">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="flex-shrink-0 text-destructive/70 hover:text-destructive transition-colors"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}


      {/* ── Group 1: Business Identity, Media & Action Buttons ── */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("branding")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-black text-foreground">1. Business Identity, Banners &amp; Action Buttons</span>
              <span className="text-[10px] text-muted-foreground font-medium">Company name, cover slideshow, verified badge, avatar crop &amp; CTAs</span>
            </div>
          </div>
          {openSection === "branding" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {openSection === "branding" && (
          <div className="p-5 space-y-6 border-t border-border/60 animate-in fade-in duration-200">
            
            {/* ── Sub-Section A: Business Identity ── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                    Business Identity &amp; Badges
                  </h4>
                </div>
                {opts.display_name_override && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    Custom Name Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company / Business Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">
                    Company / Business Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. CSC Janaseva Kendram"
                    value={opts.display_name_override || ""}
                    onChange={(e) => updateCustomOptions({ display_name_override: e.target.value })}
                    className="h-10 text-xs font-bold"
                  />
                  <p className="text-[10px] text-muted-foreground">Overrides the profile display name on the card</p>
                </div>

                {/* Tagline / Sub-Heading */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">
                    Tagline / Sub-Heading
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Akshaya services and sales"
                    value={opts.tagline_override || ""}
                    onChange={(e) => updateCustomOptions({ tagline_override: e.target.value })}
                    className="h-10 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Text shown below your business name on the card</p>
                </div>
              </div>

              {/* Category Pill & Verified Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Category Pill */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold text-foreground">
                      Category Pill Badge Text
                    </label>
                    {opts.category_badge_text && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                        {opts.category_badge_text}
                      </span>
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="e.g. Services & Sales / Official Agency"
                    value={opts.category_badge_text || ""}
                    onChange={(e) => updateCustomOptions({ category_badge_text: e.target.value })}
                    className="h-10 text-xs"
                  />
                </div>

                {/* Meta-Verified Badge Toggle */}
                <div className="p-3 rounded-2xl bg-card border border-border/80 flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-foreground">
                        Meta-Verified Badge
                      </span>
                      <svg className="w-3.5 h-3.5 text-[#1D9BF0] fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Displays verified blue badge next to your business name
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={opts.show_meta_verified !== false}
                    onClick={() => updateCustomOptions({ show_meta_verified: opts.show_meta_verified === false })}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      opts.show_meta_verified !== false ? "bg-brand-600" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        opts.show_meta_verified !== false ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Address & Google Maps Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>Business Address</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 12, Main Street, Central Junction, City Center, State - 600001"
                    value={opts.address_text || ""}
                    onChange={(e) => updateCustomOptions({ address_text: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-brand-600" />
                    <span>Google Maps Link</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://maps.google.com/?q=your+business"
                    value={opts.map_url || ""}
                    onChange={(e) => updateCustomOptions({ map_url: e.target.value })}
                    className="h-10 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Paste your exact Google Maps pin or location URL</p>
                </div>
              </div>

              {/* Business WhatsApp Hotline */}
              <div className="p-3.5 rounded-2xl bg-card border border-green-200/80 dark:border-green-900/40 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-foreground block">
                        Business WhatsApp Number
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Always active: Share button, booking, service enquiry &amp; contact forms
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#25D366] bg-green-50 dark:bg-green-950/40 border border-green-200 px-2 py-0.5 rounded-full font-black">
                    Always Active
                  </span>
                </div>
                <Input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={opts.whatsapp_number || ""}
                  onChange={(e) => updateCustomOptions({ whatsapp_number: e.target.value })}
                  className="h-10 text-xs font-mono font-bold bg-background"
                />
              </div>
            </div>

            {/* ── Sub-Section B: CTA Button Visibility ── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                    CTA Button Visibility &amp; Grid
                  </h4>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  When disabled, remaining buttons expand full-width automatically
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: "view_service_btn_enabled" as const,
                    label: "View Services Button",
                    desc: "Main primary action on card",
                    icon: ShoppingBag,
                    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
                  },
                  {
                    key: "pay_now_btn_enabled" as const,
                    label: "Pay Now Button",
                    desc: "Quick payment modal trigger",
                    icon: CreditCard,
                    color: "text-amber-600 bg-amber-50 border-amber-200",
                  },
                  {
                    key: "location_btn_enabled" as const,
                    label: "My Location Button",
                    desc: "Opens direct Google Maps route",
                    icon: MapPin,
                    color: "text-sky-600 bg-sky-50 border-sky-200",
                  },
                  {
                    key: "view_products_btn_enabled" as const,
                    label: "View Products Button",
                    desc: "Adds dedicated catalog CTA next to services",
                    icon: Package,
                    color: "text-purple-600 bg-purple-50 border-purple-200",
                    isProduct: true,
                  },
                ].map(({ key, label, desc, icon: Icon, color, isProduct }) => {
                  const isChecked = isProduct
                    ? opts.view_products_btn_enabled === true
                    : opts[key] !== false;

                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-2xl border transition-all shadow-2xs",
                        isChecked
                          ? "bg-card border-border/90"
                          : "bg-muted/40 border-border/50 opacity-70"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border", color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-foreground block">
                            {label}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {desc}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={isChecked}
                        onClick={() => {
                          if (isProduct) {
                            updateCustomOptions({ view_products_btn_enabled: !isChecked });
                          } else {
                            updateCustomOptions({ [key]: !isChecked });
                          }
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          isChecked ? "bg-brand-600" : "bg-muted-foreground/30"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            isChecked ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Sub-Section C: Cover Banner Slideshow ── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                    Cover Banner Slideshow ({currentBannerImages.length} Active)
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-foreground">
                    Auto-Cycle Slideshow
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={opts.banner_transition !== false}
                    onClick={() => updateCustomOptions({ banner_transition: opts.banner_transition === false })}
                    className={cn(
                      "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      opts.banner_transition !== false ? "bg-brand-600" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        opts.banner_transition !== false ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center justify-between gap-2">
                  <span className="font-semibold">{uploadError}</span>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="p-1 hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Active Banner Thumbnails Grid */}
              {currentBannerImages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-foreground block">
                    Active Banner Slides ({currentBannerImages.length}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentBannerImages.map((imgUrl, idx) => (
                      <div
                        key={imgUrl + idx}
                        className="relative h-24 rounded-2xl overflow-hidden border border-border group shadow-2xs bg-slate-900"
                      >
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundImage: `url(${resolveMediaUrl(imgUrl)})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        <button
                          type="button"
                          onClick={() => handleRemoveBannerImage(imgUrl)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-destructive text-white transition-colors shadow-sm"
                          title="Delete this banner image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-2 left-2 text-[10px] font-black text-white bg-black/70 px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Dropzone & Add by URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Upload Local Photos */}
                <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-foreground block">Upload Banner Photos</span>
                    <span className="text-[10px] text-muted-foreground">JPEG, PNG, WebP (Max 8MB)</span>
                  </div>
                  <input
                    ref={bannerFileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleBannerUpload}
                    className="hidden"
                    id="vcard-banner-multi-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!isUploadingBanner) bannerFileInputRef.current?.click();
                    }}
                    disabled={isUploadingBanner}
                    className="py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0 min-w-[100px] justify-center"
                  >
                    {isUploadingBanner ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                        <span className="truncate max-w-[80px]">
                          {bannerUploadProgress ?? "Uploading..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Add Photos</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Add Image by URL */}
                <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1.5">
                  <span className="text-xs font-bold text-foreground block">Add via Image URL</span>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={customBannerInputUrl}
                      onChange={(e) => setCustomBannerInputUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomUrlBanner();
                        }
                      }}
                      className="h-9 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrlBanner}
                      className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Curated Banners Picker with Photo Previews */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-extrabold text-foreground block">
                  Or Pick Curated Aesthetic Banners:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BANNER_PRESETS.map((preset) => {
                    const isAdded = currentBannerImages.includes(preset.url);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleTogglePresetBanner(preset.url)}
                        className={cn(
                          "relative h-16 rounded-xl overflow-hidden border p-2 text-left flex flex-col justify-end transition-all shadow-2xs group hover:scale-[1.02]",
                          isAdded
                            ? "border-brand-500 ring-2 ring-brand-500/25"
                            : "border-border/70 hover:border-brand-300"
                        )}
                        style={{
                          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%), url(${preset.url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-black text-white truncate drop-shadow-sm">
                            {preset.name}
                          </span>
                          <span
                            className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white",
                              isAdded ? "bg-brand-600" : "bg-black/60 group-hover:bg-brand-500"
                            )}
                          >
                            {isAdded ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Sub-Section D: Profile Avatar Photo & Circular Crop Studio ── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                    Profile Avatar Photo Studio
                  </h4>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Interactive circular crop with live zoom &amp; rotate
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Circular Avatar Preview with Status Ring */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-500 shadow-md bg-muted flex items-center justify-center flex-shrink-0">
                  {opts.custom_avatar_url ? (
                    <Image
                      src={opts.custom_avatar_url}
                      alt="Avatar Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-muted-foreground/60" />
                  )}
                  {opts.show_meta_verified !== false && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                      <svg className="w-3.5 h-3.5 text-[#1D9BF0] fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Upload & Crop Action Buttons */}
                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarFileSelected}
                      className="hidden"
                      id="vcard-avatar-crop-input"
                    />

                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Crop className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload &amp; Crop Avatar</span>
                    </button>

                    {opts.custom_avatar_url && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="py-2 px-3 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-destructive text-xs font-bold transition-all flex items-center gap-1.5"
                        title="Remove custom avatar photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Supported: JPEG, PNG, WebP. Opens precision circular crop tool before saving.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Group 2: Action Icons Visibility Matrix (moved to top for discoverability) ── */}
      <div className="rounded-2xl border border-brand-200/60 bg-gradient-to-br from-violet-50/40 to-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("icons")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-violet-600" />
            <span>2. Action Icons — Choose What Appears on Card</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-violet-600 font-bold bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
              {Object.values(activeIcons).filter(v => v !== false).length + (Object.keys(activeIcons).length === 0 ? 19 : 0)} active
            </span>
            {openSection === "icons" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>

        {openSection === "icons" && (
          <div className="p-4 space-y-3 border-t border-border/60 animate-in fade-in">
            <div className="p-3 rounded-xl bg-violet-50 border border-violet-200/80 text-[11px] text-violet-800 font-medium">
              ✅ Select icons to show on card. Social media icons you enable here will reveal their URL input in the <strong>Social Media Links</strong> section below.
            </div>

            {/* Non-social icons */}
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider pt-1">Contact &amp; Features</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: "call" as const, label: "Call", icon: Phone },
                { id: "email" as const, label: "Email", icon: Mail },
                { id: "website" as const, label: "Website", icon: Globe },
                { id: "bank" as const, label: "Bank Details", icon: Landmark },
                { id: "address" as const, label: "Address &amp; Map", icon: MapPin },
                { id: "booking" as const, label: "Book Now", icon: Calendar },
                { id: "form" as const, label: "Inquiry Form", icon: FileText },
                { id: "review" as const, label: "Google Review", icon: Star },
                { id: "qr" as const, label: "QR Code", icon: QrCode },
                { id: "save_contact" as const, label: "Save Contact", icon: UserPlus },
                { id: "install" as const, label: "Install App", icon: Smartphone },
              ].map((item) => {
                const Icon = item.icon;
                const isEnabled = isIconActive(item.id);
                return (
                  <label
                    key={item.id}
                    className={cn(
                      "p-3 rounded-2xl border transition-all flex items-center justify-between select-none cursor-pointer",
                      isEnabled
                        ? "bg-card border-brand-300 text-foreground shadow-2xs"
                        : "bg-muted/30 border-border/60 text-muted-foreground opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0 text-brand-600" />
                      <span className="text-xs font-bold truncate">{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => updateActionIcon(item.id, e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 cursor-pointer ml-1"
                    />
                  </label>
                );
              })}
            </div>

            {/* Social media icons — selecting here shows URL input below */}
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider pt-2 border-t border-border/60">Social Media Icons</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: "facebook" as const, label: "Facebook", icon: Facebook, color: "text-[#1877f2]" },
                { id: "instagram" as const, label: "Instagram", icon: Instagram, color: "text-[#e1306c]" },
                { id: "youtube" as const, label: "YouTube", icon: Youtube, color: "text-[#dc2626]" },
                { id: "twitter" as const, label: "X / Twitter", icon: Twitter, color: "text-[#0f172a]" },
                { id: "linkedin" as const, label: "LinkedIn", icon: Linkedin, color: "text-[#0284c7]" },
                { id: "telegram" as const, label: "Telegram", icon: Send, color: "text-[#0369a1]" },
                { id: "github" as const, label: "GitHub", icon: Github, color: "text-[#1e293b]" },
                { id: "snapchat" as const, label: "Snapchat", icon: SnapchatIcon, color: "text-[#FFFC00]" },
                { id: "tiktok" as const, label: "TikTok", icon: TikTokIcon, color: "text-[#010101]" },
                { id: "pinterest" as const, label: "Pinterest", icon: PinterestIcon, color: "text-[#E60023]" },
                { id: "threads" as const, label: "Threads", icon: ThreadsIcon, color: "text-[#000000]" },
                { id: "discord" as const, label: "Discord", icon: DiscordIcon, color: "text-[#5865F2]" },
                { id: "twitch" as const, label: "Twitch", icon: TwitchIcon, color: "text-[#9146FF]" },
                { id: "spotify" as const, label: "Spotify", icon: SpotifyIcon, color: "text-[#1DB954]" },
                { id: "whatsapp_channel" as const, label: "WhatsApp", icon: WhatsAppChannelIcon, color: "text-[#25D366]" },
                { id: "behance" as const, label: "Behance", icon: BehanceIcon, color: "text-[#1769FF]" },
                { id: "dribbble" as const, label: "Dribbble", icon: DribbbleIcon, color: "text-[#EA4C89]" },
              ].map((item) => {
                const Icon = item.icon;
                const isEnabled = isIconActive(item.id);
                return (
                  <label
                    key={item.id}
                    className={cn(
                      "p-3 rounded-2xl border transition-all flex items-center justify-between select-none cursor-pointer",
                      isEnabled
                        ? "bg-card border-blue-300 text-foreground shadow-2xs"
                        : "bg-muted/30 border-border/60 text-muted-foreground opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", item.color)} />
                      <span className="text-xs font-bold truncate">{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => updateActionIcon(item.id, e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 cursor-pointer ml-1"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Group 3: CTA Button Colors &amp; Gradient Animation ── */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("colors")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>3. Button Colors &amp; Gradient Animation</span>
          </div>
          {openSection === "colors" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {openSection === "colors" && (
          <div className="p-4 space-y-4 border-t border-border/60 animate-in fade-in">
            
            {/* Animated Button Gradient Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-emerald-500/10 border border-emerald-300/40">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                  <span className="text-xs font-extrabold text-foreground block">
                    Button Gradient Animation
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Flowing multi-color animated gradient glow and glossy shimmer on action buttons.
                </span>
              </div>
              <input
                type="checkbox"
                checked={opts.button_gradient_animation !== false}
                onChange={(e) => updateCustomOptions({ button_gradient_animation: e.target.checked })}
                className="w-5 h-5 rounded-lg text-emerald-600 cursor-pointer flex-shrink-0"
              />
            </div>

            {/* Primary Action Button Color */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-foreground">
                Primary CTA Color (&quot;View Service&quot; &amp; WhatsApp Share)
              </label>
              <div className="flex flex-wrap gap-2">
                {PRIMARY_COLOR_SWATCHES.map((swatch) => {
                  const isSelected = (opts.primary_button_color || "#00c853").toLowerCase() === swatch.color.toLowerCase();
                  return (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => updateCustomOptions({ primary_button_color: swatch.color })}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center shadow-2xs",
                        isSelected ? "scale-110 border-foreground shadow-md ring-2 ring-brand-500/40" : "border-white hover:scale-105"
                      )}
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={opts.primary_button_color || "#00c853"}
                  onChange={(e) => updateCustomOptions({ primary_button_color: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-border p-0.5"
                />
                <Input
                  type="text"
                  placeholder="#00c853"
                  value={opts.primary_button_color || "#00c853"}
                  onChange={(e) => updateCustomOptions({ primary_button_color: e.target.value })}
                  className="h-9 font-mono text-xs max-w-[130px]"
                />
              </div>
            </div>

            {/* Pay Now Button Color */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="block text-xs font-extrabold text-foreground">
                &quot;Pay Now&quot; Button Color
              </label>
              <div className="flex flex-wrap gap-2">
                {PAY_COLOR_SWATCHES.map((swatch) => {
                  const isSelected = (opts.pay_button_color || "#f59e0b").toLowerCase() === swatch.color.toLowerCase();
                  return (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => updateCustomOptions({ pay_button_color: swatch.color })}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center shadow-2xs",
                        isSelected ? "scale-110 border-foreground shadow-md ring-2 ring-brand-500/40" : "border-white hover:scale-105"
                      )}
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
              {/* Custom color picker for Pay Now */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={opts.pay_button_color || "#f59e0b"}
                  onChange={(e) => updateCustomOptions({ pay_button_color: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-border p-0.5"
                  title="Pick any custom color"
                />
                <Input
                  type="text"
                  placeholder="#f59e0b"
                  value={opts.pay_button_color || "#f59e0b"}
                  onChange={(e) => updateCustomOptions({ pay_button_color: e.target.value })}
                  className="h-9 font-mono text-xs max-w-[130px]"
                />
                <span className="text-[10px] text-muted-foreground">Any hex color</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="block text-xs font-extrabold text-foreground">
                &quot;My Location&quot; Button Color
              </label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_COLOR_SWATCHES.map((swatch) => {
                  const isSelected = (opts.location_button_color || "#6b7b70").toLowerCase() === swatch.color.toLowerCase();
                  return (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => updateCustomOptions({ location_button_color: swatch.color })}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center shadow-2xs",
                        isSelected ? "scale-110 border-foreground shadow-md ring-2 ring-brand-500/40" : "border-white hover:scale-105"
                      )}
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
              {/* Custom color picker for My Location */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={opts.location_button_color || "#6b7b70"}
                  onChange={(e) => updateCustomOptions({ location_button_color: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-border p-0.5"
                  title="Pick any custom color"
                />
                <Input
                  type="text"
                  placeholder="#6b7b70"
                  value={opts.location_button_color || "#6b7b70"}
                  onChange={(e) => updateCustomOptions({ location_button_color: e.target.value })}
                  className="h-9 font-mono text-xs max-w-[130px]"
                />
                <span className="text-[10px] text-muted-foreground">Any hex color</span>
              </div>
            </div>

            {/* ── "View Products" Button Settings ── */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="block text-xs font-extrabold text-foreground">
                &quot;View Products&quot; Button Color
              </label>
              <p className="text-[10px] text-muted-foreground">Only applies when the View Products button is enabled above.</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { color: "#7c3aed", label: "Purple" },
                  { color: "#6366f1", label: "Indigo" },
                  { color: "#0ea5e9", label: "Sky Blue" },
                  { color: "#ec4899", label: "Pink" },
                  { color: "#f97316", label: "Orange" },
                  { color: "#10b981", label: "Emerald" },
                  { color: "#ef4444", label: "Red" },
                  { color: "#1d4ed8", label: "Blue" },
                ].map((swatch) => {
                  const isSelected = (opts.products_button_color || "#7c3aed").toLowerCase() === swatch.color.toLowerCase();
                  return (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => updateCustomOptions({ products_button_color: swatch.color })}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center shadow-2xs",
                        isSelected ? "scale-110 border-foreground shadow-md ring-2 ring-purple-500/40" : "border-white hover:scale-105"
                      )}
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={opts.products_button_color || "#7c3aed"}
                  onChange={(e) => updateCustomOptions({ products_button_color: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-border p-0.5"
                  title="Pick any custom color"
                />
                <Input
                  type="text"
                  placeholder="#7c3aed"
                  value={opts.products_button_color || "#7c3aed"}
                  onChange={(e) => updateCustomOptions({ products_button_color: e.target.value })}
                  className="h-9 font-mono text-xs max-w-[130px]"
                />
                <span className="text-[10px] text-muted-foreground">Any hex color</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Group 3: Products & Services CTA ── */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("services")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            <span>4. Products &amp; Services CTA</span>
          </div>
          {openSection === "services" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {openSection === "services" && (
          <div className="p-4 space-y-4 border-t border-border/60 animate-in fade-in">

            {/* Button Label */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-foreground">
                Services Button Label
              </label>
              <Input
                type="text"
                placeholder="e.g. View Service / Our Products"
                value={opts.services_button_text || ""}
                onChange={(e) => updateCustomOptions({ services_button_text: e.target.value })}
                className="h-10"
              />
            </div>

            {/* Products Button Settings (shown only when View Products button is enabled) */}
            {opts.view_products_btn_enabled && (
              <div className="space-y-2 p-3 rounded-2xl bg-purple-50 border border-purple-200 dark:bg-purple-950/20 dark:border-purple-800/40">
                <p className="text-[10px] font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3 h-3" /> Products Button Settings
                </p>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">Button Label</label>
                  <Input
                    type="text"
                    placeholder="View Products"
                    value={opts.products_button_text || ""}
                    onChange={(e) => updateCustomOptions({ products_button_text: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">
                    External Link <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://your-products-page.com"
                    value={opts.products_url || ""}
                    onChange={(e) => updateCustomOptions({ products_url: e.target.value })}
                    className="h-9 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Leave blank → opens Products tab in modal. Enter a URL → opens external page directly.</p>
                </div>
              </div>
            )}

            {/* ── Services Enquiry Button Settings ── */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40 space-y-3">
              <p className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3" /> Services Tab — Enquire Button
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">Button Label</label>
                  <Input
                    type="text"
                    placeholder="Enquire"
                    value={opts.services_enquiry_btn_text || ""}
                    onChange={(e) => updateCustomOptions({ services_enquiry_btn_text: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">Button Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={opts.services_enquiry_btn_color || "#00c853"}
                      onChange={(e) => updateCustomOptions({ services_enquiry_btn_color: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-border p-0.5"
                    />
                    <Input
                      type="text"
                      placeholder="#00c853"
                      value={opts.services_enquiry_btn_color || ""}
                      onChange={(e) => updateCustomOptions({ services_enquiry_btn_color: e.target.value })}
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">
                  WhatsApp Message Template
                </label>
                <Input
                  type="text"
                  placeholder="Hello! I am interested in your service: {service}. Please provide more information."
                  value={opts.services_enquiry_template || ""}
                  onChange={(e) => updateCustomOptions({ services_enquiry_template: e.target.value })}
                  className="h-9 text-xs"
                />
                <p className="text-[10px] text-muted-foreground">
                  Use <code className="bg-muted px-1 rounded">{'{service}'}</code> — it auto-fills with the clicked service name.
                  <br />Default: <em>Hello! I am interested in your service: {'{service}'}. Please provide more information.</em>
                </p>
              </div>
            </div>

            {/* ── Service Catalog ── */}
            <div className="pt-2 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-foreground block">Service Catalog</span>
                  <span className="text-[11px] text-muted-foreground">
                    Add individual services with name, price &amp; duration. Shown in the 🛠️ Services tab.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newService: VCardService = {
                      id: `svc_${Date.now()}`,
                      name: "",
                      description: "",
                      price: "",
                      duration: "",
                    };
                    const existing = opts.services || [];
                    updateCustomOptions({ services: [...existing, newService] });
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95 flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              {/* Service Cards */}
              {(opts.services || []).length === 0 ? (
                <div className="py-8 text-center rounded-2xl border border-dashed border-border/70 bg-muted/20 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">No services yet</p>
                  <p className="text-[11px] text-muted-foreground">Click &quot;Add Service&quot; to add your first service.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(opts.services || []).map((svc, idx) => (
                    <div key={svc.id} className="border border-border/80 rounded-2xl p-3.5 space-y-2.5 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Service {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const list = (opts.services || []).filter((_, i) => i !== idx);
                            updateCustomOptions({ services: list });
                          }}
                          className="text-destructive hover:bg-destructive/10 p-1 rounded-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Input
                        type="text"
                        placeholder="Service Name (e.g. Aadhaar Update)"
                        value={svc.name}
                        onChange={(e) => {
                          const list = [...(opts.services || [])];
                          list[idx] = { ...list[idx], name: e.target.value };
                          updateCustomOptions({ services: list });
                        }}
                        className="h-9 text-xs"
                      />
                      <Input
                        type="text"
                        placeholder="Short Description (optional)"
                        value={svc.description || ""}
                        onChange={(e) => {
                          const list = [...(opts.services || [])];
                          list[idx] = { ...list[idx], description: e.target.value };
                          updateCustomOptions({ services: list });
                        }}
                        className="h-9 text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="text"
                          placeholder="Price (e.g. ₹99)"
                          value={svc.price || ""}
                          onChange={(e) => {
                            const list = [...(opts.services || [])];
                            list[idx] = { ...list[idx], price: e.target.value };
                            updateCustomOptions({ services: list });
                          }}
                          className="h-9 text-xs"
                        />
                        <Input
                          type="text"
                          placeholder="Duration (e.g. Same day)"
                          value={svc.duration || ""}
                          onChange={(e) => {
                            const list = [...(opts.services || [])];
                            list[idx] = { ...list[idx], duration: e.target.value };
                            updateCustomOptions({ services: list });
                          }}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Products Enquiry Button Settings ── */}
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 dark:bg-purple-950/20 dark:border-purple-800/40 space-y-3">
              <p className="text-[10px] font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3" /> Products Tab — Enquire Button
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">Button Label</label>
                  <Input
                    type="text"
                    placeholder="Enquire"
                    value={opts.products_enquiry_btn_text || ""}
                    onChange={(e) => updateCustomOptions({ products_enquiry_btn_text: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">Button Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={opts.products_enquiry_btn_color || "#7c3aed"}
                      onChange={(e) => updateCustomOptions({ products_enquiry_btn_color: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-border p-0.5"
                    />
                    <Input
                      type="text"
                      placeholder="#7c3aed"
                      value={opts.products_enquiry_btn_color || ""}
                      onChange={(e) => updateCustomOptions({ products_enquiry_btn_color: e.target.value })}
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">
                  WhatsApp Message Template
                </label>
                <Input
                  type="text"
                  placeholder="Hello! I am interested in your product: {product}. Please share more details and pricing."
                  value={opts.products_enquiry_template || ""}
                  onChange={(e) => updateCustomOptions({ products_enquiry_template: e.target.value })}
                  className="h-9 text-xs"
                />
                <p className="text-[10px] text-muted-foreground">
                  Use <code className="bg-muted px-1 rounded">{'{product}'}</code> — it auto-fills with the clicked product name.
                  <br />Default: <em>Hello! I am interested in your product: {'{product}'}. Please share more details and pricing.</em>
                </p>
              </div>
            </div>

            {/* ── Product Catalog ── */}
            <div className="pt-2 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-foreground block">Product Catalog</span>
                  <span className="text-[11px] text-muted-foreground">
                    Add products with image, name, price. Each shows in the Services modal with Enquire button.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProduct: VCardProduct = {
                      id: `prod_${Date.now()}`,
                      name: "",
                      description: "",
                      price: "",
                      image_url: "",
                    };
                    const existing = opts.products || [];
                    updateCustomOptions({ products: [...existing, newProduct] });
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95 flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Product Cards */}
              {(opts.products || []).length === 0 ? (
                <div className="py-8 text-center rounded-2xl border border-dashed border-border/70 bg-muted/20 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">No products yet</p>
                  <p className="text-[11px] text-muted-foreground">Click &quot;Add Product&quot; to create your first listing.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(opts.products || []).map((product, idx) => (
                    <ProductEditor
                      key={product.id}
                      product={product}
                      index={idx}
                      onUpdate={(updated) => {
                        const list = [...(opts.products || [])];
                        list[idx] = updated;
                        updateCustomOptions({ products: list });
                      }}
                      onRemove={() => {
                        const list = (opts.products || []).filter((_, i) => i !== idx);
                        updateCustomOptions({ products: list });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* ── Group 4: Pay Now (UPI & QR) ── */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("payments")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>5. Pay Now (UPI &amp; QR Code)</span>
          </div>
          {openSection === "payments" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {openSection === "payments" && (
          <div className="p-4 space-y-3.5 border-t border-border/60 animate-in fade-in">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/70">
              <div>
                <span className="text-xs font-extrabold text-foreground block">
                  Enable &quot;Pay Now (UPI)&quot; Button
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Displays instant payment button and scannable UPI QR.
                </span>
              </div>
              <input
                type="checkbox"
                checked={opts.pay_now_enabled !== false}
                onChange={(e) => updateCustomOptions({ pay_now_enabled: e.target.checked })}
                className="w-5 h-5 rounded-lg text-emerald-600 cursor-pointer"
              />
            </div>

            {opts.pay_now_enabled !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">
                    UPI ID (VPA)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. janaseva@okaxis"
                    value={opts.upi_id || ""}
                    onChange={(e) => updateCustomOptions({ upi_id: e.target.value })}
                    className="h-10 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">
                    Payment Phone No. (GPay / PhonePe)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={opts.payment_phone || ""}
                    onChange={(e) => updateCustomOptions({ payment_phone: e.target.value })}
                    className="h-10 font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Group 5: Bank Account Details — gated by Bank icon ── */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("bank")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-600" />
            <span>6. Bank Account Details</span>
            {!isIconActive("bank") && (
              <span className="ml-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">🔒 Icon Off</span>
            )}
          </div>
          {openSection === "bank" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {openSection === "bank" && (
          <div className="p-4 space-y-3 border-t border-border/60 animate-in fade-in">
            {!isIconActive("bank") ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-xs font-bold text-muted-foreground">Bank icon not enabled</p>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  Enable the <strong>Bank Details</strong> icon in <strong>Group 2 — Action Icons</strong> to activate this section.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">Bank Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. State Bank of India"
                    value={opts.bank_name || ""}
                    onChange={(e) => updateCustomOptions({ bank_name: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">Account Holder</label>
                  <Input
                    type="text"
                    placeholder="e.g. Business Name Pvt Ltd"
                    value={opts.bank_holder_name || ""}
                    onChange={(e) => updateCustomOptions({ bank_holder_name: e.target.value })}
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">Account Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. 987654321001"
                    value={opts.bank_account_number || ""}
                    onChange={(e) => updateCustomOptions({ bank_account_number: e.target.value })}
                    className="h-10 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-foreground">IFSC Code</label>
                  <Input
                    type="text"
                    placeholder="e.g. SBIN0001234"
                    value={opts.bank_ifsc || ""}
                    onChange={(e) => updateCustomOptions({ bank_ifsc: e.target.value.toUpperCase() })}
                    className="h-10 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Group 6: Slot Booking & Google Reviews ── */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("booking")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>7. Slot Booking &amp; Google Reviews</span>
          </div>
          {openSection === "booking" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {openSection === "booking" && (
          <div className="p-4 space-y-3.5 border-t border-border/60 animate-in fade-in">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/70">
              <div>
                <span className="text-xs font-extrabold text-foreground block">
                  Enable &quot;Book Slot&quot; Button
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Opens appointment booking popup and forwards to WhatsApp.
                </span>
              </div>
              <input
                type="checkbox"
                checked={opts.booking_enabled !== false}
                onChange={(e) => updateCustomOptions({ booking_enabled: e.target.checked })}
                className="w-5 h-5 rounded-lg text-indigo-600 cursor-pointer"
              />
            </div>

            {/* Google Review URL — gated by review icon */}
            {isIconActive("review") ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Google Review / Feedback URL</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://g.page/r/yourbusiness/review"
                  value={opts.google_review_url || ""}
                  onChange={(e) => updateCustomOptions({ google_review_url: e.target.value })}
                  className="h-10 text-xs"
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <p className="text-[11px] text-amber-800 font-medium">
                  Enable the <strong>Review</strong> icon in <strong>Group 2 — Action Icons</strong> to add your Google Review URL.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Group 8: Social Media Links & Profiles — URL inputs gated by icon selection ── */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("social")}
          className="w-full p-4 flex items-center justify-between font-extrabold text-xs text-foreground bg-muted/20 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>8. Social Media Links &amp; Profiles</span>
          </div>
          {openSection === "social" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {openSection === "social" && (
          <div className="p-4 space-y-4 border-t border-border/60 animate-in fade-in">

            {/* Check how many social icons are enabled */}
            {(() => {
              const socialIds = ["facebook", "instagram", "youtube", "twitter", "linkedin", "telegram", "github", "snapchat", "tiktok", "pinterest", "threads", "discord", "twitch", "spotify", "whatsapp_channel", "behance", "dribbble"] as const;
              const enabledSocials = socialIds.filter(id => isIconActive(id));
              const allEnabled = socialIds.every(id => isIconActive(id));

              if (enabledSocials.length === 0) {
                return (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">No social icons selected</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                      Go to <strong>Group 2 — Action Icons</strong> and enable the social media icons you want. Their URL inputs will appear here.
                    </p>
                  </div>
                );
              }

              return (
                <>
                  {!allEnabled && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-[11px] text-blue-800 font-medium">
                      💡 Only showing URL fields for social icons enabled in <strong>Group 2 — Action Icons</strong>. Enable more icons there to see their URL inputs here.
                    </div>
                  )}
                  <div className="space-y-3">
                    {([
                      { id: "facebook" as const, label: "Facebook", placeholder: "https://facebook.com/yourpage", icon: Facebook, color: "text-[#1877f2]" },
                      { id: "instagram" as const, label: "Instagram", placeholder: "https://instagram.com/yourhandle", icon: Instagram, color: "text-[#e1306c]" },
                      { id: "youtube" as const, label: "YouTube", placeholder: "https://youtube.com/@yourchannel", icon: Youtube, color: "text-[#dc2626]" },
                      { id: "twitter" as const, label: "X / Twitter", placeholder: "https://x.com/yourhandle", icon: Twitter, color: "text-[#0f172a]" },
                      { id: "linkedin" as const, label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile", icon: Linkedin, color: "text-[#0284c7]" },
                      { id: "telegram" as const, label: "Telegram", placeholder: "https://t.me/yourusername", icon: Send, color: "text-[#0369a1]" },
                      { id: "github" as const, label: "GitHub", placeholder: "https://github.com/yourusername", icon: Github, color: "text-[#1e293b]" },
                      { id: "snapchat" as const, label: "Snapchat", placeholder: "https://snapchat.com/add/yourusername", icon: SnapchatIcon, color: "text-[#FFFC00]" },
                      { id: "tiktok" as const, label: "TikTok", placeholder: "https://tiktok.com/@yourusername", icon: TikTokIcon, color: "text-[#010101]" },
                      { id: "pinterest" as const, label: "Pinterest", placeholder: "https://pinterest.com/yourprofile", icon: PinterestIcon, color: "text-[#E60023]" },
                      { id: "threads" as const, label: "Threads", placeholder: "https://threads.net/@yourusername", icon: ThreadsIcon, color: "text-[#000000]" },
                      { id: "discord" as const, label: "Discord", placeholder: "https://discord.gg/yourinvite", icon: DiscordIcon, color: "text-[#5865F2]" },
                      { id: "twitch" as const, label: "Twitch", placeholder: "https://twitch.tv/yourusername", icon: TwitchIcon, color: "text-[#9146FF]" },
                      { id: "spotify" as const, label: "Spotify", placeholder: "https://open.spotify.com/artist/yourprofile", icon: SpotifyIcon, color: "text-[#1DB954]" },
                      { id: "whatsapp_channel" as const, label: "WhatsApp Channel", placeholder: "https://whatsapp.com/channel/yourlink", icon: WhatsAppChannelIcon, color: "text-[#25D366]" },
                      { id: "behance" as const, label: "Behance", placeholder: "https://behance.net/yourprofile", icon: BehanceIcon, color: "text-[#1769FF]" },
                      { id: "dribbble" as const, label: "Dribbble", placeholder: "https://dribbble.com/yourprofile", icon: DribbbleIcon, color: "text-[#EA4C89]" },
                    ] as const).filter(soc => isIconActive(soc.id)).map((soc) => {
                      const Icon = soc.icon;
                      const currentVal = (socialUrls as Record<string, string | undefined>)[soc.id] || "";
                      return (
                        <div
                          key={soc.id}
                          className="p-3 rounded-2xl border bg-card border-blue-200/60 shadow-2xs space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={cn("w-4 h-4 flex-shrink-0", soc.color)} />
                            <span className="text-xs font-bold text-foreground">{soc.label}</span>
                          </div>
                          <Input
                            type="url"
                            placeholder={soc.placeholder}
                            value={currentVal}
                            onChange={(e) => updateSocialUrl(soc.id, e.target.value)}
                            className="h-9 text-xs font-mono"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
        </div>
      )}

      {/* ── INTERACTIVE CIRCULAR AVATAR CROP MODAL ── */}
      {cropImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-card rounded-[32px] border border-border p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-brand-600" />
                <h3 className="text-sm font-extrabold text-foreground">Crop Profile Avatar</h3>
              </div>
              <button
                type="button"
                onClick={() => setCropImageSrc(null)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              Drag to reposition your photo and use the slider to zoom.
            </p>

            {/* Crop Interactive Canvas */}
            <div
              className="relative w-[320px] h-[320px] mx-auto rounded-full overflow-hidden bg-slate-900 border-4 border-emerald-500 shadow-inner cursor-move select-none"
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
                <span className="flex items-center gap-1"><ZoomOut className="w-3.5 h-3.5" /> Zoom</span>
                <span>{Math.round(cropZoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={cropZoom}
                onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCropImageSrc(null)}
                className="flex-1 py-3 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyCroppedAvatar}
                disabled={isUploadingAvatar}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Apply &amp; Save Avatar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
