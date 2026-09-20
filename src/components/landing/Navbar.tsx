"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenFaq?: () => void;
}

export function Navbar({ onOpenFaq }: NavbarProps) {
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-4 bg-white/95 backdrop-blur-md",
        scrolled ? "border-b border-slate-100 shadow-xs" : "border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ── Left: Brand Logo ── */}
        <Link
          href="/"
          className="group transition-transform active:scale-95 select-none"
        >
          <DigicardoLogo size="md" />
        </Link>

        {/* ── Right: Links & Get Started CTA ── */}
        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a
              href="#features"
              className="hover:text-[#5B3FE4] transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-[#5B3FE4] transition-colors"
            >
              Pricing
            </a>
            {onOpenFaq ? (
              <button
                type="button"
                onClick={onOpenFaq}
                className="hover:text-[#5B3FE4] transition-colors cursor-pointer"
              >
                FAQs
              </button>
            ) : (
              <a
                href="#faqs"
                className="hover:text-[#5B3FE4] transition-colors"
              >
                FAQs
              </a>
            )}
            <a
              href="#contact"
              className="hover:text-[#5B3FE4] transition-colors"
            >
              Contact
            </a>
          </nav>

          <div suppressHydrationWarning>
            {mounted && isAuthenticated ? (
              <Link
                href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="inline-flex items-center px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white transition-all active:scale-95"
                style={{
                  backgroundColor: "#5B3FE4",
                  boxShadow: "0 4px 14px rgba(91, 63, 228, 0.3)",
                }}
              >
                {user?.role === "admin" ? "Admin Console" : "Dashboard"}
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white transition-all active:scale-95"
                style={{
                  backgroundColor: "#5B3FE4",
                  boxShadow: "0 4px 14px rgba(91, 63, 228, 0.3)",
                }}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
