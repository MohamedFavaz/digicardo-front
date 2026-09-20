"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  Calendar,
  Building2,
  Rocket,
  ArrowRight,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonaData {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  title: string;
  desc: string;
  tags: string[];
  mockup: {
    name: string;
    role: string;
    avatarUrl: string;
    coverUrl: string;
    themeBg: string;
    cardBorder: string;
    textColor: string;
    links: { label: string; icon: string; highlight?: boolean }[];
  };
}

const personas: PersonaData[] = [
  {
    id: "creator",
    label: "Creator",
    icon: Sparkles,
    tagline: "FOR INFLUENCERS & ARTISTS",
    title: "Unify your audience across every platform.",
    desc: "Direct followers to your latest drops, YouTube videos, podcast episodes, Patreon, and brand sponsorships from one memorable link.",
    tags: ["YouTubers", "Podcasters", "Streamers", "Artists", "Writers"],
    mockup: {
      name: "Maya Rivera",
      role: "Digital Creator & Podcaster",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      coverUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
      themeBg: "bg-gradient-to-b from-[#f3effe] via-[#fff0f5] to-[#f5f2fe]",
      cardBorder: "border-purple-200",
      textColor: "text-slate-900",
      links: [
        { label: "Twitch Live Stream", icon: "🔴", highlight: true },
        { label: "Digital Print Shop", icon: "🎨" },
        { label: "Patreon Community", icon: "⭐" },
        { label: "Brand Partnerships", icon: "💼" },
      ],
    },
  },
  {
    id: "luxury",
    label: "Resort & Luxury",
    icon: Building2,
    tagline: "FOR RETREATS, HOTELS & SPAS",
    title: "A luxury digital concierge for discerning guests.",
    desc: "Showcase signature suites, Ayurvedic treatments, instant WhatsApp concierge booking, and downloadable phone contact cards inspired by Alpha Wellness Resort.",
    tags: ["Wellness Resorts", "Boutique Hotels", "Ayurveda Spas", "Private Villas", "Eco Lodges"],
    mockup: {
      name: "Alpha Sanctuary Resort",
      role: "Holistic Health & Spa",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      coverUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      themeBg: "bg-[#faf6f0]",
      cardBorder: "border-[#e6d3c3]",
      textColor: "text-[#2d1e14]",
      links: [
        { label: "Save Contact to Phone (.vcf)", icon: "📇", highlight: true },
        { label: "WhatsApp Direct Concierge", icon: "💬" },
        { label: "Ayurveda & Epigenetics Menu", icon: "🌿" },
        { label: "Google Maps Directions", icon: "📍" },
      ],
    },
  },
  {
    id: "professional",
    label: "Professional",
    icon: Briefcase,
    tagline: "FOR EXECUTIVES & CONSULTANTS",
    title: "Your modern interactive digital business card.",
    desc: "Showcase your portfolio, LinkedIn, downloadable resume, client testimonials, and 1-on-1 Calendly booking link with contactless NFC tap.",
    tags: ["Designers", "Developers", "Consultants", "Founders", "Lawyers"],
    mockup: {
      name: "Dr. Marcus Vance",
      role: "Partner · Strategic Advisory",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      themeBg: "bg-white",
      cardBorder: "border-slate-200",
      textColor: "text-slate-900",
      links: [
        { label: "Book Strategy Session", icon: "📅", highlight: true },
        { label: "Selected Case Studies", icon: "📊" },
        { label: "Executive Wire & Bank Info", icon: "💳" },
        { label: "Connect on LinkedIn", icon: "💼" },
      ],
    },
  },
  {
    id: "business",
    label: "Local Business",
    icon: Calendar,
    tagline: "FOR CAFES, SHOPS & BOUTIQUES",
    title: "Turn social visitors into loyal foot traffic.",
    desc: "Feature your store catalog, WhatsApp ordering, Google Maps location, opening hours, and seasonal discounts directly in bio.",
    tags: ["Cafes & Bakeries", "Boutiques", "Salons", "Studios", "Restaurants"],
    mockup: {
      name: "Nordic Roast Cafe",
      role: "Specialty Roastery & Bakery",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      coverUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
      themeBg: "bg-gradient-to-b from-[#fff8eb] to-[#fef3c7]",
      cardBorder: "border-amber-200",
      textColor: "text-slate-900",
      links: [
        { label: "Order on WhatsApp", icon: "☕", highlight: true },
        { label: "Seasonal Drink Menu", icon: "🥐" },
        { label: "Google Maps Directions", icon: "📍" },
        { label: "Reserve Table Online", icon: "🍴" },
      ],
    },
  },
  {
    id: "agency",
    label: "Agency & Studio",
    icon: Rocket,
    tagline: "FOR DIGITAL STUDIOS & MANAGERS",
    title: "Manage multiple client profiles under one roof.",
    desc: "Build branded link experiences for roster clients, manage custom domains, and access enterprise-grade traffic attribution.",
    tags: ["Talent Agencies", "Marketing Studios", "PR Firms", "Record Labels"],
    mockup: {
      name: "Apex Studio Lab",
      role: "Global Creative Collective",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      themeBg: "bg-slate-950",
      cardBorder: "border-slate-800",
      textColor: "text-white",
      links: [
        { label: "Client Roster (2026)", icon: "🏆", highlight: true },
        { label: "Press & Media Kit", icon: "📰" },
        { label: "Submit Representation", icon: "🚀" },
        { label: "Brand Partnerships", icon: "🤝" },
      ],
    },
  },
];

export function UseCases() {
  const [activeTab, setActiveTab] = React.useState<string>("creator");

  const currentPersona = personas.find((p) => p.id === activeTab) ?? personas[0];

  return (
    <section id="use-cases" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge variant="amber" size="default" className="gap-1.5 shadow-2xs">
            <Users className="w-3.5 h-3.5" />
            <span>VERSATILE USE CASES</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Tailored for <span className="lf-gradient-brand">every profession.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            From solo artists to luxury wellness retreats and global executives, Digicardo turns taps and visitors into lifelong relationships.
          </p>
        </div>

        {/* ── 5 Tab Buttons ── */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive = activeTab === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 select-none shadow-xs",
                  isActive
                    ? "bg-brand-600 text-white shadow-cta scale-105"
                    : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Active Tab Content Card ── */}
        <div className="rounded-[40px] border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Persona Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-black tracking-widest uppercase text-brand-600">
                {currentPersona.tagline}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
                {currentPersona.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                {currentPersona.desc}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                {currentPersona.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted/60 text-[11px] font-bold text-muted-foreground border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "pill", size: "default" }),
                    "gap-2 bg-brand-600 text-white font-bold shadow-cta inline-flex items-center cursor-pointer"
                  )}
                >
                  <span>Create your {currentPersona.label} page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Persona Mini Profile Mockup with Real Photo & Cover */}
            <div className="lg:col-span-5 flex justify-center">
              <div className={cn(
                "w-72 sm:w-80 rounded-[36px] p-4 shadow-float border-2 transition-all duration-300 overflow-hidden select-none",
                currentPersona.mockup.themeBg,
                currentPersona.mockup.cardBorder
              )}>
                {/* Cover Banner */}
                <div className="relative h-24 w-full rounded-2xl overflow-hidden mb-2 shadow-inner">
                  <img
                    src={currentPersona.mockup.coverUrl}
                    alt={currentPersona.mockup.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="text-center space-y-2.5 -mt-8 relative z-10 px-2">
                  <img
                    src={currentPersona.mockup.avatarUrl}
                    alt={currentPersona.mockup.name}
                    className="w-16 h-16 rounded-full mx-auto border-2 border-white object-cover shadow-lg"
                  />
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <h4 className={cn("font-black text-sm leading-tight", currentPersona.mockup.textColor)}>
                        {currentPersona.mockup.name}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 fill-brand-100" />
                    </div>
                    <p className="text-[11px] opacity-75 font-medium mt-0.5 text-muted-foreground">
                      {currentPersona.mockup.role}
                    </p>
                  </div>

                  {/* Links with real icons */}
                  <div className="space-y-2 pt-1 text-left">
                    {currentPersona.mockup.links.map((link) => (
                      <div
                        key={link.label}
                        className={cn(
                          "w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between shadow-2xs",
                          link.highlight
                            ? "bg-brand-600 text-white font-extrabold shadow-sm"
                            : "bg-white/90 text-slate-800 border border-slate-200/80 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm">{link.icon}</span>
                          <span className="truncate">{link.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                      </div>
                    ))}
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
