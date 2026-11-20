"use client";

import * as React from "react";
import { IndianRupee, MessageCircle, Nfc, QrCode, UserPlus } from "lucide-react";
import { TemplatePhone } from "@/components/marketing/TemplatePhone";
import { TapGlyph } from "@/components/ui/DigicardoLogo";
import { SocialIcon, WhatsAppGlyph } from "@/templates/shared/SocialIcon";
import { cn } from "@/lib/utils";

/**
 * Landing hero visual: a small 3D scene about Digicardo — the example card on a tilted phone,
 * an NFC smart card floating in front, a spinning QR cube, social bubbles and "it works"
 * notifications at different depths. It flies in on load, floats, tilts towards the mouse and
 * leans back as the hero scrolls away. Pure CSS 3D (no WebGL); everything stays still for
 * reduced motion. Decorative only (aria-hidden) — the hero text carries the message.
 */

const C = { lime: "#DAF56B", violet: "#5B3FE4", ink: "#1C1245", pink: "#F6B6E6" };

/** Scene units: everything is laid out on a 560 × 600 box and scaled to fit the column. */
const BOX_W = 560;
const BOX_H = 600;

const CSS = `
.h3d-scene{perspective:1500px;perspective-origin:50% 40%}
.h3d-3d{transform-style:preserve-3d}
.h3d-stage{transform:rotateX(calc(9deg + var(--py,0) * -7deg + var(--sp,0) * 14deg)) rotateY(calc(-19deg + var(--px,0) * 12deg)) rotateZ(2deg) translateY(calc(var(--sp,0) * 40px))}
.h3d-cube{transform:rotateX(-22deg) rotateY(30deg)}
@media (prefers-reduced-motion:no-preference){
  .h3d-stage{transition:transform .9s cubic-bezier(.2,.8,.2,1)}
  .h3d-enter{animation:h3d-enter 1.5s cubic-bezier(.2,.8,.2,1) both}
  .h3d-in{animation:h3d-in 1.1s cubic-bezier(.34,1.4,.64,1) both;animation-delay:calc(var(--d,0) * 1ms + 350ms)}
  .h3d-fade{animation:h3d-fade .6s ease-out both;animation-delay:calc(var(--d,0) * 1ms + 350ms)}
  .h3d-float{animation:h3d-float 6s ease-in-out infinite;animation-delay:calc(var(--d,0) * -1ms)}
  .h3d-cube{animation:h3d-spin 16s linear infinite}
  .h3d-wave{animation:h3d-wave 2.4s ease-out infinite}
  .h3d-wave:nth-child(2){animation-delay:.8s}
  .h3d-wave:nth-child(3){animation-delay:1.6s}
}
@keyframes h3d-enter{from{transform:rotateX(38deg) rotateY(-42deg) translateY(90px) scale(.82)}to{transform:none}}
@keyframes h3d-in{from{transform:translate3d(var(--fx,0),var(--fy,40px),-260px) scale(.55)}to{transform:none}}
@keyframes h3d-fade{from{opacity:0}to{opacity:1}}
@keyframes h3d-float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-12px,0)}}
@keyframes h3d-spin{from{transform:rotateX(-22deg) rotateY(0)}to{transform:rotateX(-22deg) rotateY(360deg)}}
@keyframes h3d-wave{from{transform:scale(.6);opacity:.9}to{transform:scale(1.9);opacity:0}}
`;

/**
 * One floating thing in the scene. `z` is its depth (px towards the viewer); `d` its entrance
 * delay (ms) and float phase; `from` where it flies in from.
 */
function Layer({
  x,
  y,
  z,
  d = 0,
  rotate = "",
  from = ["0px", "40px"],
  float = true,
  children,
}: {
  x: number;
  y: number;
  z: number;
  d?: number;
  rotate?: string;
  from?: [string, string];
  float?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="h3d-3d absolute left-0 top-0" style={{ transform: `translate3d(${x}px, ${y}px, ${z}px) ${rotate}` }}>
      <div className="h3d-3d h3d-in" style={{ "--d": d, "--fx": from[0], "--fy": from[1] } as React.CSSProperties}>
        <div className="h3d-3d h3d-fade" style={{ "--d": d } as React.CSSProperties}>
          <div className={cn("h3d-3d", float && "h3d-float")} style={{ "--d": d * 3 } as React.CSSProperties}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ icon, tone, title, text }: { icon: React.ReactNode; tone: string; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-white py-2.5 pl-2.5 pr-5 shadow-[0_24px_40px_-18px_rgba(28,18,69,0.55)]">
      <span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: tone }}>
        {icon}
      </span>
      <span>
        <span className="block text-[14px] font-bold leading-5 text-[#1C1245]">{title}</span>
        <span className="block text-[12px] text-[#6B6585]">{text}</span>
      </span>
    </div>
  );
}

/** The physical NFC card Digicardo sells, floating in front of the phone. */
function NfcCard() {
  return (
    <div
      className="relative h-[168px] w-[266px] overflow-hidden rounded-[20px] p-5 text-white shadow-[0_40px_60px_-24px_rgba(28,18,69,0.75)]"
      style={{ background: `radial-gradient(120% 90% at 100% 0%, #8D78FF 0%, transparent 55%), linear-gradient(135deg, ${C.ink}, ${C.violet})` }}
    >
      <span className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/15" />
      <span className="absolute -bottom-20 -left-8 h-44 w-44 rounded-full bg-white/[0.06]" />
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/15">
          <TapGlyph className="h-[18px] w-[18px]" color="#FFFFFF" />
        </span>
        <span className="text-[13px] font-semibold tracking-wide">Digicardo</span>
      </div>
      <svg viewBox="0 0 40 30" className="mt-4 h-[26px] w-[34px]">
        <rect x="0.5" y="0.5" width="39" height="29" rx="6" fill="#E9C46A" stroke="#B88A2B" />
        <path d="M0.5 10.5h12m15 0h12M0.5 19.5h12m15 0h12M12.5 0.5v29M27.5 0.5v29M12.5 15h15" stroke="#B88A2B" fill="none" />
      </svg>
      <div className="absolute bottom-5 left-5">
        <div className="text-[17px] font-bold leading-tight">Rahul Verma</div>
        <div className="text-[11.5px] text-white/75">Interior Designer</div>
      </div>
      {/* Tap waves */}
      <div className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center">
        <span className="absolute inset-0">
          <span className="h3d-wave absolute inset-0 rounded-full border-2 border-[#DAF56B]/80" />
          <span className="h3d-wave absolute inset-0 rounded-full border-2 border-[#DAF56B]/80" />
          <span className="h3d-wave absolute inset-0 rounded-full border-2 border-[#DAF56B]/80" />
        </span>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#DAF56B] text-[#1C1245]">
          <Nfc className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

/** A real 3D cube (six faces) that slowly spins: QR, NFC, WhatsApp, rupee. */
function Cube({ size = 92 }: { size?: number }) {
  const h = size / 2;
  const face = "absolute inset-0 flex items-center justify-center rounded-[18px] border border-white/40 [backface-visibility:hidden]";
  const faces: { t: string; bg: string; fg: string; icon: React.ReactNode }[] = [
    { t: `translateZ(${h}px)`, bg: C.lime, fg: C.ink, icon: <QrCode className="h-11 w-11" strokeWidth={1.8} /> },
    { t: `rotateY(90deg) translateZ(${h}px)`, bg: C.violet, fg: "#fff", icon: <Nfc className="h-10 w-10" /> },
    { t: `rotateY(180deg) translateZ(${h}px)`, bg: "#25D366", fg: "#fff", icon: <WhatsAppGlyph className="h-10 w-10" /> },
    { t: `rotateY(-90deg) translateZ(${h}px)`, bg: C.pink, fg: C.ink, icon: <IndianRupee className="h-10 w-10" /> },
    { t: `rotateX(90deg) translateZ(${h}px)`, bg: "#C9E85A", fg: C.ink, icon: null },
    { t: `rotateX(-90deg) translateZ(${h}px)`, bg: "#3B25B0", fg: "#fff", icon: null },
  ];
  return (
    <div className="h3d-3d relative" style={{ width: size, height: size }}>
      <div className="h3d-cube h3d-3d absolute inset-0">
        {faces.map((f, i) => (
          <div key={i} className={face} style={{ transform: f.t, background: f.bg, color: f.fg }}>
            {f.icon}
          </div>
        ))}
      </div>
    </div>
  );
}

function Bubble({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full shadow-[0_20px_30px_-14px_rgba(28,18,69,0.6)]" style={{ background: C.lime, color }}>
      {children}
    </span>
  );
}

export function Hero3D() {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  // Fit the 560 × 600 scene to the column.
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => setScale(Math.min(1, wrap.clientWidth / BOX_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Mouse tilt (fine pointers only) and scroll lean, written as CSS variables — no re-renders.
  React.useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!stage || !wrap || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      frame = 0;
      const box = wrap.getBoundingClientRect();
      const sp = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height)));
      stage.style.setProperty("--px", px.toFixed(3));
      stage.style.setProperty("--py", py.toFixed(3));
      stage.style.setProperty("--sp", sp.toFixed(3));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
      queue();
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    queue();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", queue);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="relative mx-auto w-full max-w-[560px]" style={{ height: BOX_H * scale }}>
      <style>{CSS}</style>
      {/* Backdrop panel (flat) — the 3D scene breaks out of it. */}
      <div className="absolute inset-x-[4%] bottom-[2%] top-[6%] overflow-hidden rounded-[44px]" style={{ background: C.violet }}>
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full" style={{ background: "#7B61FF" }} />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full" style={{ background: "#4128C4" }} />
      </div>

      <div className="h3d-scene absolute left-1/2 top-0 origin-top" style={{ width: BOX_W, height: BOX_H, transform: `translateX(-50%) scale(${scale})` }}>
        <div className="h3d-3d h3d-enter absolute inset-0">
          <div ref={stageRef} className="h3d-3d h3d-stage absolute inset-0">
            {/* Phone, with a darker slab behind it for thickness. */}
            <Layer x={135} y={36} z={0} d={0} float={false} from={["0px", "80px"]}>
              <div className="relative">
                <div className="absolute inset-0 translate-x-[10px] translate-y-[8px] rounded-[40px] bg-[#0E0A24]" />
                <TemplatePhone template="vcard" width={290} className="relative shadow-[0_50px_80px_-30px_rgba(14,10,36,0.8)]" />
              </div>
            </Layer>

            {/* NFC smart card in front of the phone, bottom-left. */}
            <Layer x={18} y={372} z={150} d={350} rotate="rotateZ(-6deg)" from={["-60px", "80px"]}>
              <NfcCard />
            </Layer>

            {/* Spinning QR cube, top-right. */}
            <Layer x={420} y={64} z={90} d={600} from={["60px", "-40px"]}>
              <Cube />
            </Layer>

            {/* Social bubbles stacked on the right, each a little closer. */}
            <Layer x={448} y={300} z={70} d={700} from={["60px", "0px"]}>
              <Bubble color="#25D366">
                <WhatsAppGlyph className="h-7 w-7" />
              </Bubble>
            </Layer>
            <Layer x={462} y={378} z={110} d={820} from={["60px", "0px"]}>
              <Bubble color="#E1306C">
                <SocialIcon platform="instagram" className="h-7 w-7" />
              </Bubble>
            </Layer>
            <Layer x={448} y={456} z={150} d={940} from={["60px", "0px"]}>
              <Bubble color="#0A66C2">
                <SocialIcon platform="linkedin" className="h-7 w-7" />
              </Bubble>
            </Layer>

            {/* "It works" notifications. */}
            <Layer x={-10} y={120} z={120} d={1050} from={["-80px", "0px"]}>
              <Toast icon={<MessageCircle className="h-5 w-5" />} tone="#25D366" title="New WhatsApp enquiry" text="“Is Saturday free?”" />
            </Layer>
            <Layer x={336} y={318} z={200} d={1250} from={["80px", "0px"]}>
              <Toast icon={<UserPlus className="h-5 w-5" />} tone={C.violet} title="Contact saved" text="Rahul Verma" />
            </Layer>
            <Layer x={250} y={520} z={180} d={1450} from={["0px", "80px"]}>
              <Toast icon={<IndianRupee className="h-5 w-5" />} tone={C.ink} title="₹2,500 received" text="UPI · just now" />
            </Layer>
          </div>
        </div>
      </div>
    </div>
  );
}
