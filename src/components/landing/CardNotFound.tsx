"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Nfc, QrCode, Search, Sparkles } from "lucide-react";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { C, ClaimForm, display } from "@/components/landing/home/Top";
import { cn } from "@/lib/utils";

/** The handle from the address bar (/ravi → "ravi"), or "" when it isn't a valid handle. */
function handleFromPath(pathname: string | null): string {
  const first = (pathname ?? "").split("/").filter(Boolean)[0] ?? "";
  const decoded = (() => {
    try {
      return decodeURIComponent(first);
    } catch {
      return "";
    }
  })();
  // "_not-found" is the internal page the middleware rewrites to, not a real handle.
  return /^[a-z0-9_-]{1,30}$/i.test(decoded) && decoded !== "_not-found" ? decoded.toLowerCase() : "";
}

/** A blank card on a tilted phone: what's at this address right now. */
function BlankCard() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[360px] w-[300px] [perspective:1200px] sm:h-[420px] sm:w-[340px]">
      <div className="absolute inset-0 [transform:rotateX(8deg)_rotateY(-16deg)_rotateZ(3deg)] [transform-style:preserve-3d]">
        <div className="absolute inset-x-6 inset-y-0 rounded-[38px] bg-[#0E0A24] [transform:translate3d(10px,8px,-20px)]" />
        <div className="absolute inset-x-6 inset-y-0 overflow-hidden rounded-[38px] border-[7px] border-[#1C1245] bg-white">
          <div className="h-[30%] bg-[repeating-linear-gradient(135deg,#ECE8FD_0_12px,#F5F3FF_12px_24px)]" />
          <div className="-mt-11 flex flex-col items-center px-6">
            <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-[3px] border-dashed border-[#B9B0E8] bg-white text-[34px] font-extrabold text-[#B9B0E8]">
              ?
            </span>
            <span className="mt-4 h-3.5 w-36 rounded-full bg-[#ECE8FD]" />
            <span className="mt-2.5 h-2.5 w-24 rounded-full bg-[#F1EFF8]" />
            <div className="mt-6 grid w-full grid-cols-3 gap-2.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-14 rounded-2xl border-2 border-dashed border-[#E2DDF7]" />
              ))}
            </div>
            <span className="mt-4 h-11 w-full rounded-full border-2 border-dashed border-[#E2DDF7]" />
          </div>
        </div>
      </div>

      {/* Floating bits */}
      <span className="absolute -right-3 top-6 flex h-[74px] w-[74px] rotate-[10deg] items-center justify-center rounded-[22px] text-[22px] font-extrabold tracking-tight text-[#1C1245] shadow-[0_18px_30px_-14px_rgba(28,18,69,0.6)] motion-safe:animate-float" style={{ background: C.lime }}>
        404
      </span>
      <span className="absolute -left-4 top-[42%] flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#5B3FE4] shadow-[0_18px_30px_-14px_rgba(28,18,69,0.6)] motion-safe:animate-float [animation-delay:1.2s]">
        <Search className="h-6 w-6" />
      </span>
      <span className="absolute -right-1 bottom-10 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_18px_30px_-14px_rgba(28,18,69,0.6)] motion-safe:animate-float [animation-delay:2.4s]" style={{ background: C.violet }}>
        <Nfc className="h-5 w-5" />
      </span>
    </div>
  );
}

/**
 * On an agent's own domain: no Digicardo branding and no sign-up offer — the visitor came for
 * one of the agent's customers, so just say the card isn't here.
 */
function WhiteLabelNotFound({ handle }: { handle: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F6F3] px-5 py-16 text-[#18181B]">
      <div className="w-full max-w-[440px] text-center">
        <div aria-hidden="true" className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-white shadow-[0_18px_40px_-20px_rgba(24,24,27,0.35)]">
          <Search className="h-8 w-8 text-[#71717A]" />
        </div>
        <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">Card not found</p>
        <h1 className="mt-2 text-[34px] font-bold leading-tight tracking-[-0.02em] sm:text-[40px]">
          {handle ? "This card isn’t here." : "Nothing here yet."}
        </h1>
        <p className="mx-auto mt-4 max-w-[360px] text-[16px] leading-7 text-[#52525B]">
          {handle ? (
            <>
              There’s no card at <span className="font-semibold text-[#18181B]">/{handle}</span>. Check the link, or ask the person to share their card again.
            </>
          ) : (
            "This page isn’t available. Check the link, or ask the person to share their card again."
          )}
        </p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#18181B] px-6 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Go to the home page
        </Link>
      </div>
    </main>
  );
}

/** Shown at /{handle} when no card lives there: says so plainly and offers the handle. */
export function CardNotFound({ whiteLabel = false }: { whiteLabel?: boolean }) {
  const handle = handleFromPath(usePathname());
  if (whiteLabel) return <WhiteLabelNotFound handle={handle} />;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden" style={{ background: C.lime, color: C.ink }}>
      {/* Soft shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/30" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-32 h-[440px] w-[440px] rounded-full bg-[#C9E85A]" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8">
        <Link href="/" aria-label="Digicardo home">
          <DigicardoLogo size="md" />
        </Link>
        <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold shadow-[0_10px_30px_-14px_rgba(28,18,69,0.35)] transition-transform hover:-translate-y-0.5">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] flex-1 grid-cols-1 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-0">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#1C1245] px-4 py-1.5 text-[13px] font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-[#DAF56B]" aria-hidden="true" />
            No card here · 404
          </p>
          <h1 className={cn("mt-6 text-[48px] sm:text-[72px]", display)}>
            {handle ? (
              <>
                This card
                <br />
                is still blank.
              </>
            ) : (
              <>
                Nothing
                <br />
                here yet.
              </>
            )}
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-lg font-medium leading-8 text-[#2E2563] lg:mx-0">
            {handle ? (
              <>
                There&apos;s no Digicardo at{" "}
                <span className="whitespace-nowrap rounded-lg bg-white/70 px-2 py-0.5 font-bold text-[#1C1245]">digicardo.app/{handle}</span>. It may have been renamed or
                removed — or the name is free for you to take.
              </>
            ) : (
              <>This link doesn&apos;t lead to a card. It may have been renamed or removed. Check the spelling, or make a card of your own.</>
            )}
          </p>

          <div className="mt-8 flex flex-col items-center lg:items-start">
            <p className="mb-3 inline-flex items-center gap-2 text-[15px] font-bold">
              <Sparkles className="h-4 w-4" style={{ color: C.violet }} aria-hidden="true" />
              {handle ? "Make this name yours" : "Claim your own name"}
            </p>
            <ClaimForm defaultHandle={handle} button="Claim it free" buttonStyle={{ background: C.ink, color: "#fff" }} />
            <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px] font-medium text-[#4A4178] lg:justify-start">
              <li className="inline-flex items-center gap-1.5">
                <QrCode className="h-4 w-4" aria-hidden="true" /> QR code included
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Nfc className="h-4 w-4" aria-hidden="true" /> Works with NFC cards
              </li>
              <li>Live in minutes</li>
            </ul>
          </div>
        </div>

        <BlankCard />
      </div>

      <footer className="relative z-10 pb-6 text-center text-[13px] font-medium text-[#4A4178]">
        Looking for someone? Ask them to share their card link or QR code again.
      </footer>
    </main>
  );
}
