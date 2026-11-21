"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Phone, X } from "lucide-react";

const CONTACTS = [
  { name: "Support & custom cards", raw: "918593048536", tel: "+918593048536", display: "+91 85930 48536" },
  { name: "Sales & enquiries", raw: "919526390381", tel: "+919526390381", display: "+91 95263 90381" },
];

const TEXT = encodeURIComponent("Hi Digicardo, I'd like to know more about the digital business card.");

/**
 * Floating "Chat with us" launcher: a dark pill (a rounded square on phones) that opens a small
 * panel with both WhatsApp numbers. Matches the landing page's ink + lime palette.
 */
export function FloatingWhatsApp() {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Chat with Digicardo"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[340px] origin-bottom-right overflow-hidden rounded-[24px] bg-white shadow-[0_30px_70px_-20px_rgba(18,16,24,0.45)] ring-1 ring-black/5"
          >
            <div className="flex items-start justify-between gap-3 bg-[#121018] p-5 text-white">
              <div>
                <p className="text-[16px] font-semibold">Talk to Digicardo</p>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#DAF56B]" aria-hidden="true" />
                  Usually replies within minutes
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ul className="space-y-2 p-3">
              {CONTACTS.map((c) => (
                <li key={c.raw} className="flex items-center gap-2 rounded-[18px] bg-[#F6F6F3] p-3 pl-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-[#6B6779]">{c.name}</p>
                    <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#121018]">{c.display}</p>
                  </div>
                  <a
                    href={`https://wa.me/${c.raw}?text=${TEXT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${c.display}`}
                    className="inline-flex h-10 items-center gap-1 rounded-full bg-[#121018] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2A2635]"
                  >
                    Chat <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a href={`tel:${c.tel}`} aria-label={`Call ${c.display}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#121018] ring-1 ring-black/5 transition-colors hover:bg-[#ECEBE6]">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close chat options" : "Chat with us on WhatsApp"}
        className="group flex h-14 items-center gap-3 rounded-[18px] bg-[#121018] p-2 text-white shadow-[0_18px_40px_-14px_rgba(18,16,24,0.6)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 sm:rounded-full sm:pr-5"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#DAF56B] text-[#121018] sm:rounded-full">
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <WhatsAppIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110" />}
        </span>
        <span className="hidden text-[14px] font-semibold sm:inline">{open ? "Close" : "Chat with us"}</span>
      </button>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.178-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.3.301-.501.101-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.238-.244-.59-.492-.51-.678-.519l-.577-.01c-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.079 2.912 1.23 3.113.15.201 2.122 3.24 5.141 4.544.718.311 1.279.497 1.716.636.721.23 1.377.198 1.896.12.577-.087 1.78-.727 2.031-1.429.251-.702.251-1.303.176-1.429-.076-.126-.277-.201-.578-.351z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 21.66a.8.8 0 00.99.99l4.57-1.383A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-8 10a8 8 0 1114.32 4.906.8.8 0 00-.094.618l.847 2.802-2.837-.859a.8.8 0 00-.623.094A7.962 7.962 0 0112 20a8 8 0 01-8-8z"
      />
    </svg>
  );
}
