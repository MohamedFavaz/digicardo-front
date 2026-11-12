"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, ShieldCheck, UserCheck, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenFaq?: () => void;
}

export function Navbar({ onOpenFaq }: NavbarProps) {
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function handleNavLinkClick() {
    setMobileMenuOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/95 backdrop-blur-md",
        scrolled ? "border-b border-slate-200/80 shadow-2xs" : "border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ── Left: Brand Logo ── */}
        <Link
          href="/"
          onClick={handleNavLinkClick}
          className="group transition-transform active:scale-95 select-none flex-shrink-0"
        >
          <DigicardoLogo size="md" />
        </Link>

        {/* ── Desktop Center Navigation Links ── */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            Pricing
          </a>
          {onOpenFaq ? (
            <button
              type="button"
              onClick={onOpenFaq}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              FAQs
            </button>
          ) : (
            <a href="#faqs" className="hover:text-slate-900 transition-colors">
              FAQs
            </a>
          )}
          <a href="#contact" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
        </nav>

        {/* ── Desktop Action Buttons (lg and up) ── */}
        <div suppressHydrationWarning className="hidden sm:flex items-center gap-2 sm:gap-3">
          {mounted && isAuthenticated ? (
            <Link
              href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="inline-flex items-center px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all shadow-xs active:scale-95"
            >
              {user?.role === "admin" ? "Admin Console" : "Dashboard"}
            </Link>
          ) : (
            <>
              {/* Agent Portal Login */}
              <Link
                href="/agent-login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-2xs"
                title="Agent Partner Portal"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <span>Agent Login</span>
              </Link>

              {/* User Login */}
              <Link
                href="/login"
                className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                User Login
              </Link>

              {/* Get Started CTA */}
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Right Section (sm & below): Quick CTA + Hamburger Toggle ── */}
        <div className="flex sm:hidden items-center gap-2">
          {mounted && isAuthenticated ? (
            <Link
              href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900 active:scale-95 shadow-2xs"
            >
              Get Started
            </Link>
          )}

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Fullscreen / Slide Mobile Menu Drawer ── */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[61px] bottom-0 z-40 bg-white/98 backdrop-blur-xl border-t border-slate-100 flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-6 pt-2">
            {/* Navigation Anchor Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Navigation
              </p>
              <a
                href="#features"
                onClick={handleNavLinkClick}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>Features</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#pricing"
                onClick={handleNavLinkClick}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>Pricing Plans</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
              {onOpenFaq ? (
                <button
                  type="button"
                  onClick={() => {
                    handleNavLinkClick();
                    onOpenFaq();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors text-left"
                >
                  <span>Frequently Asked Questions</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ) : (
                <a
                  href="#faqs"
                  onClick={handleNavLinkClick}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span>FAQs</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              )}
              <a
                href="#contact"
                onClick={handleNavLinkClick}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>WhatsApp Contact Support</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Account & Portals Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Account & Portals
              </p>

              {/* Agent Portal Login */}
              <Link
                href="/agent-login"
                onClick={handleNavLinkClick}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Agent Partner Login</div>
                    <div className="text-xs text-slate-500">Authorized card partner portal</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Customer User Login */}
              <Link
                href="/login"
                onClick={handleNavLinkClick}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">User / Customer Login</div>
                    <div className="text-xs text-slate-500">Access your digital visiting card</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bottom Mobile Drawer Actions */}
          <div className="pt-6 pb-2 border-t border-slate-100 space-y-3">
            <Link
              href="/register"
              onClick={handleNavLinkClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-black transition-colors shadow-sm"
            >
              <span>Create Your Card Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-center text-[11px] text-slate-400">
              Digicardo &bull; Smart Digital Profile &amp; NFC Platform
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
