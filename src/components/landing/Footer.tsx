"use client";

import * as React from "react";
import Link from "next/link";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import {
  Sparkles,
  Twitter,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card py-14 sm:py-16 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ── Main Multi-Column Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="group inline-block">
              <DigicardoLogo size="md" />
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-medium">
              The modern digital business card, NFC smart card, and omnichannel profile platform. Built for creators, businesses, and digital professionals worldwide.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <span className="font-extrabold text-foreground uppercase tracking-wider text-[11px]">
              Platform
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors font-medium">
                  Smart Digital Cards
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors font-medium">
                  Order Custom NFC Cards
                </a>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors font-medium">
                  Custom Domains
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors font-medium">
                  Enterprise Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Inquiries & Support */}
          <div className="space-y-3">
            <span className="font-extrabold text-foreground uppercase tracking-wider text-[11px]">
              Get in Touch
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors font-medium">
                  Contact Sales &amp; Orders
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors font-medium">
                  Custom Card Inquiries
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors font-medium">
                  Technical Support
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Auth */}
          <div className="space-y-3">
            <span className="font-extrabold text-foreground uppercase tracking-wider text-[11px]">
              Account
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors font-medium">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/login?returnUrl=/dashboard" className="hover:text-foreground transition-colors font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/80 font-medium">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted-foreground/80 font-medium">Terms of Service</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Strip ── */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-foreground">All systems operational</span>
          </div>

          <div className="text-[11px]">
            &copy; {new Date().getFullYear()} Digicardo, Inc. Crafted for creators &amp; modern professionals everywhere.
          </div>
        </div>

      </div>
    </footer>
  );
}
