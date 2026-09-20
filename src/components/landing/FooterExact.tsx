"use client";

import * as React from "react";
import Link from "next/link";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { Instagram, Linkedin, Youtube } from "lucide-react";

export function FooterExact() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ── Top Row: Logo/Tagline, Contact & WhatsApp, Links & Socials ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Logo + Tagline */}
          <div className="md:col-span-4 space-y-3">
            <Link href="/" className="inline-block group">
              <DigicardoLogo size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              A smarter way to share who you are. Modern digital cards and NFC solutions for professionals.
            </p>
          </div>

          {/* Middle Column (4 cols): WhatsApp & Phone Contact Numbers */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Contact & WhatsApp Support</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/918593048536?text=Hi%20Digicardo%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-[11px]">
                    WA
                  </span>
                  <span>+91 85930 48536</span>
                </a>
                <span className="text-[11px] text-slate-400 font-normal">Support & Custom Cards</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/919526390381?text=Hi%20Digicardo%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-[11px]">
                    WA
                  </span>
                  <span>+91 95263 90381</span>
                </a>
                <span className="text-[11px] text-slate-400 font-normal">Sales & Inquiries</span>
              </div>
            </div>
          </div>

          {/* Right Column (3 cols): Links & Social Icons */}
          <div className="md:col-span-3 flex flex-col md:items-end space-y-3">
            <nav className="flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-600">
              <Link href="/privacy" className="hover:text-[#5B3FE4] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#5B3FE4] transition-colors">
                Terms
              </Link>
              <a href="#contact" className="hover:text-[#5B3FE4] transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-3 text-slate-600 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:text-[#5B3FE4] hover:bg-slate-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 stroke-[2]" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:text-[#5B3FE4] hover:bg-slate-100 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 stroke-[2]" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:text-[#5B3FE4] hover:bg-slate-100 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 stroke-[2]" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Strip ── */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
          <div>&copy; 2026 Digicardo. All rights reserved.</div>
          <div>Made for professionals, by professionals.</div>
        </div>

      </div>
    </footer>
  );
}
