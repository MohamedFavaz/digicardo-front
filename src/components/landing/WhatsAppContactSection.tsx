"use client";

import * as React from "react";
import { Phone, MessageCircle, Clock, ShieldCheck, ArrowUpRight, Sparkles } from "lucide-react";

export function WhatsAppContactSection() {
  const contacts = [
    {
      number: "+91 8593048536",
      rawNumber: "918593048536",
      formattedNumber: "+91 85930 48536",
      label: "Support & Custom Cards",
      description: "Fast responses for card customization, orders, and technical assistance.",
      badge: "Priority Support",
      available: "Active now",
    },
    {
      number: "+91 9526390381",
      rawNumber: "919526390381",
      formattedNumber: "+91 95263 90381",
      label: "Sales & Inquiries",
      description: "Direct assistance for lifetime plans, bulk orders, and general questions.",
      badge: "Direct Line",
      available: "Active now",
    },
  ];

  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-100 relative overflow-hidden">
      {/* Background soft ambient orbs */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#5B3FE4]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide" style={{ backgroundColor: "#eafaf1", color: "#16a34a" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct WhatsApp Support</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Have Questions? Chat With Us
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Need help choosing a plan, custom NFC business cards, or instant setup assistance? Connect with our team directly on WhatsApp.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative group"
            >
              {/* Top Row: Label & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: idx === 0 ? "#eeebfc" : "#e6f4ea", color: idx === 0 ? "#5B3FE4" : "#137333" }}
                  >
                    {contact.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{contact.available}</span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  {contact.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
                  {contact.description}
                </p>

                {/* Display Number */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      WhatsApp & Call
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                      {contact.formattedNumber}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <WhatsAppIcon className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Call */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/${contact.rawNumber}?text=${encodeURIComponent("Hi Digicardo, I would like to know more about the digital visiting card.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-all duration-200 active:scale-98 shadow-sm hover:shadow-md"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors active:scale-98"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Assurance bar below cards */}
        <div className="mt-12 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Fast response within minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5B3FE4]" />
            <span>Official Digicardo Contact</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>NFC & Custom Inquiries</span>
          </div>
        </div>

      </div>
    </section>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.178-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.3.301-.501.101-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.238-.244-.59-.492-.51-.678-.519l-.577-.01c-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.079 2.912 1.23 3.113.15.201 2.122 3.24 5.141 4.544.718.311 1.279.497 1.716.636.721.23 1.377.198 1.896.12.577-.087 1.78-.727 2.031-1.429.251-.702.251-1.303.176-1.429-.076-.126-.277-.201-.578-.351z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 21.66a.8.8 0 00.99.99l4.57-1.383A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-8 10a8 8 0 1114.32 4.906.8.8 0 00-.094.618l.847 2.802-2.837-.859a.8.8 0 00-.623.094A7.962 7.962 0 0112 20a8 8 0 01-8-8z"
      />
    </svg>
  );
}
