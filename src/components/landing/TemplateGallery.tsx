"use client";

import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Phone,
  CreditCard,
  QrCode,
  Radio,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Share2,
} from "lucide-react";
import { RequestAccessModal } from "@/components/landing/RequestAccessModal";

export function TemplateGallery() {
  const [modalOpen, setModalOpen] = React.useState(false);

  const features = [
    {
      icon: Radio,
      title: "NFC Smart Card Ready",
      description: "Tap your custom physical NFC card to any smartphone to share your entire digital profile instantly.",
    },
    {
      icon: QrCode,
      title: "Dynamic High-Res QR Code",
      description: "Scannable on printed banners, booth badges, menus, and marketing collateral with real-time analytics.",
    },
    {
      icon: Phone,
      title: "1-Tap Direct Action Modals",
      description: "Allow clients to call your direct line, message on WhatsApp, or save your contact vCard with one touch.",
    },
    {
      icon: CreditCard,
      title: "Bank & Wire Transfer Card",
      description: "Display bank account details, routing numbers, and payment handles securely with quick-copy buttons.",
    },
  ];

  return (
    <>
      <RequestAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
      
      <section id="templates" className="py-20 md:py-28 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIGITAL VCARD ARCHITECTURE</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Engineered for modern professionals.
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              One unified profile architecture with interactive direct action modals, scannable QR codes, contactless NFC smart card integration, and banking details.
            </p>
          </div>

          {/* 2-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Feature Pillars (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.title}
                      className="p-5 rounded-xl border border-border bg-slate-50/50 hover:bg-white hover:border-primary/30 transition-all space-y-2.5 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {feat.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <Button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-5 rounded-lg gap-2 shadow-sm"
                >
                  <span>Request Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-xs font-semibold h-10 px-5 rounded-lg border-border hover:bg-muted inline-flex items-center justify-center cursor-pointer"
                  )}
                >
                  <span>Sign in to Digicardo</span>
                </Link>
              </div>
            </div>

            {/* Right: Phone Mockup Demonstration (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] rounded-[36px] border-[5px] border-slate-900 bg-black p-2.5 shadow-2xl overflow-hidden ring-1 ring-slate-800">
                {/* Status Bar Indicator */}
                <div className="h-5 w-24 rounded-full bg-slate-900 mx-auto mb-2" />
                
                {/* Inner Card Screen */}
                <div className="rounded-[26px] bg-[#0b1118] text-white p-5 space-y-4 text-center overflow-hidden border border-white/10">
                  {/* Verified Avatar */}
                  <div className="relative w-16 h-16 mx-auto">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Profile Avatar"
                      className="w-16 h-16 rounded-full border-2 border-primary object-cover shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full ring-2 ring-[#0b1118]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="space-y-0.5">
                    <h4 className="text-base font-bold text-white tracking-tight">
                      Elena Vance
                    </h4>
                    <p className="text-xs text-emerald-400 font-medium">
                      Managing Partner · Vantage Capital
                    </p>
                  </div>

                  {/* Quick Action Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                      <Phone className="w-4 h-4 mx-auto text-emerald-400" />
                      <span className="text-[10px] font-semibold block text-white/90">Call</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                      <CreditCard className="w-4 h-4 mx-auto text-primary" />
                      <span className="text-[10px] font-semibold block text-white/90">Bank</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                      <QrCode className="w-4 h-4 mx-auto text-amber-400" />
                      <span className="text-[10px] font-semibold block text-white/90">QR</span>
                    </div>
                  </div>

                  {/* Contact Card Save CTA */}
                  <div className="p-3 rounded-xl bg-primary text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Save Contact to Phone</span>
                  </div>

                  {/* Verified Badge footer */}
                  <p className="text-[10px] text-white/40 font-medium">
                    Digicardo VCard Business · NFC Enabled
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
