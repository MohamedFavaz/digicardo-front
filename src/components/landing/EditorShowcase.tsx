"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Palette,
  Share2,
  BarChart3,
  Plus,
  Layers,
  Link2,
  Instagram,
  Video,
  Image as ImageIcon,
  Mail,
  CheckCircle2,
  ChevronRight,
  Twitter,
  Linkedin,
  Eye,
  Smartphone,
  Tablet,
  Laptop,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function EditorShowcase() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [openInNewTab, setOpenInNewTab] = React.useState(true);
  const [showIcon, setShowIcon] = React.useState(true);
  const [linkTitle, setLinkTitle] = React.useState("My Portfolio");
  const [linkUrl, setLinkUrl] = React.useState("https://favaz.design");
  const [activeStyle, setActiveStyle] = React.useState<"pill" | "rounded" | "outline" | "solid">("pill");

  const steps = [
    {
      label: "CREATE",
      title: "Add your content",
      desc: "Add links, social icons, videos, images, and contact buttons in seconds.",
      icon: Zap,
      color: "text-brand-600",
      bg: "bg-brand-50 border-brand-200",
    },
    {
      label: "CUSTOMIZE",
      title: "Style your identity",
      desc: "Pick a template, colors, fonts, and animation styles to match your brand.",
      icon: Palette,
      color: "text-mint-600",
      bg: "bg-mint-50 border-mint-200",
    },
    {
      label: "SHARE",
      title: "Distribute everywhere",
      desc: "Share your short link, QR code, or tap instantly with your NFC smart card.",
      icon: Share2,
      color: "text-coral",
      bg: "bg-coral-50 border-coral/20",
    },
    {
      label: "TRACK",
      title: "Grow with insights",
      desc: "See real-time visitors, link clicks, CTR, and traffic sources at a glance.",
      icon: BarChart3,
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber/30",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="purple" size="default" className="gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CREATIVE STUDIO</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Build it <span className="lf-gradient-brand">your way.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            An intuitive drag-and-drop studio that gives you complete creative freedom. No code required.
          </p>
        </div>

        {/* ── 2-Column Split: Interactive Steps vs Studio Editor Mockup ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: 4 Vertical Interactive Step Cards */}
          <div className="lg:col-span-4 space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;

              return (
                <div
                  key={step.label}
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    "p-5 rounded-3xl border transition-all duration-300 cursor-pointer select-none",
                    isActive
                      ? "bg-card border-brand-200 shadow-hover -translate-y-0.5"
                      : "bg-card/50 border-border/70 hover:bg-card hover:border-border shadow-xs"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-2xs transition-transform",
                        step.bg,
                        isActive && "scale-105"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", step.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn("text-[10px] font-black uppercase tracking-wider", step.color)}>
                        {step.label}
                      </span>
                      <h3 className="text-base font-extrabold text-foreground leading-tight mt-0.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Realistic Studio Editor Interface Mockup */}
          <div className="lg:col-span-8 rounded-[36px] bg-card border-2 border-border/80 shadow-float overflow-hidden">
            
            {/* Editor Window Top Bar */}
            <div className="h-14 bg-muted/40 border-b border-border/70 px-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-border shadow-xs flex items-center justify-center">
                  <Image src="/logo.png" alt="Digicardo" width={22} height={22} className="w-full h-full object-contain" />
                </div>
                <span className="font-extrabold text-sm text-foreground">Digicardo Studio</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-card border border-border/80 rounded-xl p-1 shadow-2xs">
                  <button className="p-1 rounded-lg bg-brand-50 text-brand-600">
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold rounded-xl gap-1">
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </Button>

                <Button variant="pill" size="sm" className="h-8 px-4 text-xs font-extrabold bg-brand-600 text-white shadow-cta">
                  <span>Publish</span>
                </Button>
              </div>
            </div>

            {/* Editor Body Grid: Blocks List + Edit Form + Live Mini Phone */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/60">
              
              {/* Sub-col 1: Blocks List */}
              <div className="md:col-span-3 p-4 space-y-3 bg-muted/20">
                <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase px-1">
                  Blocks
                </span>
                
                <div className="space-y-1.5 text-xs font-bold">
                  <div className="p-2 rounded-xl bg-card border border-border/70 text-foreground flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Profile Info</span>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center gap-2 shadow-2xs">
                    <Link2 className="w-3.5 h-3.5 text-brand-600" />
                    <span>Links (Active)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/70 text-foreground flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Social Icons</span>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/70 text-foreground flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Video Embed</span>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/70 text-foreground flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Photo Gallery</span>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/70 text-foreground flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Contact Form</span>
                  </div>
                </div>

                <button className="w-full py-2 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 text-brand-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-brand-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Block</span>
                </button>
              </div>

              {/* Sub-col 2: Edit Form Panel */}
              <div className="md:col-span-5 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-foreground">Edit Link</h4>
                  <Badge variant="purple" size="sm">Primary</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-foreground">Title</label>
                    <input
                      type="text"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      className="mt-1 w-full h-9 rounded-xl border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground">URL</label>
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="mt-1 w-full h-9 rounded-xl border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="pt-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Open in new tab</span>
                      <button
                        onClick={() => setOpenInNewTab(!openInNewTab)}
                        className={cn(
                          "w-9 h-5 rounded-full p-0.5 transition-colors",
                          openInNewTab ? "bg-brand-600" : "bg-muted"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full bg-white transition-transform",
                            openInNewTab ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Show icon</span>
                      <button
                        onClick={() => setShowIcon(!showIcon)}
                        className={cn(
                          "w-9 h-5 rounded-full p-0.5 transition-colors",
                          showIcon ? "bg-brand-600" : "bg-muted"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full bg-white transition-transform",
                            showIcon ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Style Presets */}
                  <div>
                    <label className="font-bold text-foreground block mb-1.5">Style</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["pill", "rounded", "outline", "solid"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setActiveStyle(style)}
                          className={cn(
                            "py-1 px-2 rounded-lg text-[10px] font-bold capitalize border transition-all",
                            activeStyle === style
                              ? "bg-brand-50 border-brand-500 text-brand-700 shadow-2xs"
                              : "border-border/80 text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview Text */}
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/70">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Button Preview</span>
                    <div className={cn(
                      "mt-1.5 py-2 px-3 bg-brand-600 text-white font-extrabold text-xs flex items-center justify-between shadow-xs",
                      activeStyle === "pill" && "rounded-full",
                      activeStyle === "rounded" && "rounded-xl",
                      activeStyle === "outline" && "bg-transparent border border-brand-600 text-brand-600",
                      activeStyle === "solid" && "rounded-none"
                    )}>
                      <span>{linkTitle || "Button"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-col 3: Synced Live Mini Phone Preview */}
              <div className="md:col-span-4 p-5 bg-gradient-to-b from-brand-50/50 via-card to-card flex items-center justify-center">
                <div className="w-56 rounded-[36px] bg-card p-3.5 border-2 border-slate-900 shadow-xl space-y-2.5 text-center select-none overflow-hidden relative">
                  {/* Notch */}
                  <div className="w-14 h-3 bg-slate-950 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  </div>

                  {/* Cover Banner */}
                  <div className="relative h-14 w-full rounded-xl overflow-hidden -mt-1 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {/* Avatar */}
                  <div className="-mt-8 relative z-10 flex justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Elena Vance"
                      className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-extrabold text-xs text-foreground">Elena Vance</span>
                      <CheckCircle2 className="w-3 h-3 text-brand-600 fill-brand-100" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">Product &amp; Brand Studio</span>
                  </div>

                  {/* Socials */}
                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[9px]">
                      <Twitter className="w-2.5 h-2.5" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[9px]">
                      <Linkedin className="w-2.5 h-2.5" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[9px]">
                      <Globe className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Live Synced Links */}
                  <div className="space-y-1.5 pt-1">
                    <div className={cn(
                      "py-2 px-3 bg-brand-600 text-white font-extrabold text-[10px] flex items-center justify-between shadow-xs transition-all",
                      activeStyle === "pill" && "rounded-full",
                      activeStyle === "rounded" && "rounded-xl",
                      activeStyle === "outline" && "bg-transparent border border-brand-600 text-brand-600",
                      activeStyle === "solid" && "rounded-none"
                    )}>
                      <span className="truncate">{linkTitle || "My Portfolio"}</span>
                      <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    </div>
                    <div className="py-2 px-3 bg-card border border-border/80 text-foreground font-bold text-[10px] rounded-full flex items-center justify-between shadow-xs">
                      <span>Case Studies (2026)</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="py-2 px-3 bg-card border border-border/80 text-foreground font-bold text-[10px] rounded-full flex items-center justify-between shadow-xs">
                      <span>Reserve Consultation</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
