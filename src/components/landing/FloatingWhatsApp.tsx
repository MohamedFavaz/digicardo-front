"use client";

import * as React from "react";
import { X, MessageCircle, Phone, ArrowUpRight } from "lucide-react";

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = React.useState(false);

  const contacts = [
    {
      name: "Support & Custom Cards",
      number: "+91 8593048536",
      raw: "918593048536",
      display: "+91 85930 48536",
      subtitle: "Instant help & card orders",
    },
    {
      name: "Sales & Inquiries",
      number: "+91 9526390381",
      raw: "919526390381",
      display: "+91 95263 90381",
      subtitle: "General queries & lifetime plans",
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Pop-up Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#25D366] px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">Digicardo WhatsApp</div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Typically replies in minutes</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-slate-50/50">
            <p className="text-xs text-slate-600">
              Need assistance or want to order custom NFC cards? Chat directly with our team:
            </p>

            <div className="space-y-2">
              {contacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-slate-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{contact.name}</div>
                      <div className="text-xs font-semibold text-slate-900 mt-0.5">{contact.display}</div>
                      <div className="text-[10px] text-slate-400">{contact.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-100">
                    <a
                      href={`https://wa.me/${contact.raw}?text=${encodeURIComponent("Hi Digicardo, I would like to chat about the digital visiting card.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-98"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                      <span>Chat on WhatsApp</span>
                      <ArrowUpRight className="w-3 h-3 opacity-80" />
                    </a>
                    <a
                      href={`tel:${contact.number}`}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      title={`Call ${contact.display}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
        style={{
          backgroundColor: "#25D366",
        }}
        aria-label="Contact us on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-[#25D366]" />
        </span>
        <WhatsAppIcon className="w-5 h-5 fill-current" />
        <span className="text-xs sm:text-sm font-bold tracking-tight">WhatsApp Us</span>
      </button>
    </div>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
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
