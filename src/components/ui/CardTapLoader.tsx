import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Digital visiting card loader: a Digicardo NFC card glides to a phone and taps it, contactless
 * waves ripple out, and the phone fills in with a contact card (cover, photo, name, buttons and a
 * "Saved" tick). Then the card slides back and the loop repeats (3.6 s).
 *
 * Pure SVG + CSS: no library, no network, renders instantly. People who prefer reduced motion see
 * the finished frame without movement.
 */
const CSS = `
.dcl *{transform-box:fill-box}
.dcl-card{animation:dcl-card 3.6s cubic-bezier(.65,0,.35,1) infinite;transform-origin:50% 50%}
@keyframes dcl-card{
  0%,6%{transform:translate(0,0) rotate(-9deg)}
  26%{transform:translate(20px,-3px) rotate(-3deg)}
  31%{transform:translate(25px,0) rotate(0deg)}
  36%{transform:translate(21px,-1px) rotate(-1deg)}
  74%{transform:translate(21px,-1px) rotate(-1deg)}
  92%,100%{transform:translate(0,0) rotate(-9deg)}
}
.dcl-shine{animation:dcl-shine 3.6s ease-in-out infinite}
@keyframes dcl-shine{0%,20%{transform:translateX(-120px)}45%,100%{transform:translateX(130px)}}
.dcl-wave{opacity:0;animation:dcl-wave 3.6s ease-out infinite;transform-origin:0% 50%}
.dcl-wave.w2{animation-delay:.12s}.dcl-wave.w3{animation-delay:.24s}
@keyframes dcl-wave{0%,30%{opacity:0;transform:scale(.55)}36%{opacity:1}58%,100%{opacity:0;transform:scale(1.45)}}
.dcl-glow{opacity:0;animation:dcl-glow 3.6s ease-out infinite}
@keyframes dcl-glow{0%,30%{opacity:0}38%{opacity:.9}70%{opacity:.35}92%,100%{opacity:0}}
.dcl-in{opacity:0;animation:3.6s cubic-bezier(.34,1.56,.64,1) infinite}
.dcl-cover{transform-origin:50% 0%;animation-name:dcl-cover}
@keyframes dcl-cover{0%,33%{opacity:0;transform:scaleY(0)}42%,86%{opacity:1;transform:scaleY(1)}94%,100%{opacity:0;transform:scaleY(1)}}
.dcl-pop{transform-origin:50% 50%;animation-name:dcl-pop}
@keyframes dcl-pop{0%,40%{opacity:0;transform:scale(0)}49%,86%{opacity:1;transform:scale(1)}94%,100%{opacity:0;transform:scale(1)}}
.dcl-bar{transform-origin:0% 50%;animation-name:dcl-bar;animation-timing-function:cubic-bezier(.22,1,.36,1)}
@keyframes dcl-bar{0%,46%{opacity:0;transform:scaleX(0)}55%,86%{opacity:1;transform:scaleX(1)}94%,100%{opacity:0;transform:scaleX(1)}}
.dcl-bar.b2{animation-delay:.12s}
.dcl-btn{transform-origin:50% 50%;animation-name:dcl-btn}
@keyframes dcl-btn{0%,54%{opacity:0;transform:scale(0)}61%,86%{opacity:1;transform:scale(1)}94%,100%{opacity:0;transform:scale(1)}}
.dcl-btn.k2{animation-delay:.07s}.dcl-btn.k3{animation-delay:.14s}.dcl-btn.k4{animation-delay:.21s}
.dcl-saved{transform-origin:50% 50%;animation-name:dcl-saved}
@keyframes dcl-saved{0%,64%{opacity:0;transform:translateY(6px) scale(.8)}71%,86%{opacity:1;transform:none}94%,100%{opacity:0;transform:none}}
.dcl-tick{stroke-dasharray:14;stroke-dashoffset:14;animation:dcl-tick 3.6s ease-out infinite}
@keyframes dcl-tick{0%,68%{stroke-dashoffset:14}76%,100%{stroke-dashoffset:0}}
.dcl-phone{animation:dcl-phone 3.6s ease-in-out infinite;transform-origin:50% 50%}
@keyframes dcl-phone{0%,30%{transform:none}33%{transform:translateX(2px) rotate(1deg)}37%,100%{transform:none}}
.dcl-shadow{opacity:.14;animation:dcl-shadow 3.6s cubic-bezier(.65,0,.35,1) infinite;transform-origin:50% 50%}
@keyframes dcl-shadow{0%,6%{transform:translateX(0) scaleX(1);opacity:.14}31%,74%{transform:translateX(24px) scaleX(.9);opacity:.08}92%,100%{transform:translateX(0) scaleX(1);opacity:.14}}
@media (prefers-reduced-motion: reduce){
  .dcl *{animation:none!important}
  .dcl-card{transform:translate(21px,-1px) rotate(-1deg)}
  .dcl-in{opacity:1;transform:none}
  .dcl-tick{stroke-dashoffset:0}
}
`;

export function CardTapLoader({ className, width = 260 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 240 168"
      width={width}
      height={(width * 168) / 240}
      className={cn("dcl overflow-visible", className)}
      role="img"
      aria-label="Loading"
    >
      <style>{CSS}</style>
      <defs>
        <linearGradient id="dcl-card-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7A5CFF" />
          <stop offset=".55" stopColor="#5B3FE4" />
          <stop offset="1" stopColor="#3A22B8" />
        </linearGradient>
        <linearGradient id="dcl-cover-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B73FF" />
          <stop offset="1" stopColor="#5B3FE4" />
        </linearGradient>
        <radialGradient id="dcl-glow-g">
          <stop offset="0" stopColor="#7C5CFF" stopOpacity=".55" />
          <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dcl-shine-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="dcl-card-clip">
          <rect x="20" y="58" width="96" height="60" rx="10" />
        </clipPath>
        <clipPath id="dcl-screen-clip">
          <rect x="147" y="20" width="66" height="128" rx="11" />
        </clipPath>
      </defs>

      {/* glow where the card meets the phone */}
      <circle className="dcl-glow" cx="142" cy="86" r="46" fill="url(#dcl-glow-g)" />

      {/* phone */}
      <g className="dcl-phone">
        <ellipse cx="180" cy="160" rx="34" ry="4" fill="#121018" opacity=".12" />
        <rect x="141" y="13" width="78" height="142" rx="17" fill="#121018" />
        <rect x="147" y="20" width="66" height="128" rx="11" fill="#fff" />
        <rect x="170" y="23" width="20" height="5" rx="2.5" fill="#121018" />
        <g clipPath="url(#dcl-screen-clip)">
          <rect className="dcl-in dcl-cover" x="147" y="20" width="66" height="34" fill="url(#dcl-cover-g)" />
          <g className="dcl-in dcl-pop">
            <circle cx="180" cy="55" r="12" fill="#fff" />
            <circle cx="180" cy="55" r="9.5" fill="#DAF56B" />
            <circle cx="180" cy="52" r="3.6" fill="#121018" />
            <path d="M173.6 61.2a6.6 6.6 0 0 1 12.8 0" fill="#121018" />
          </g>
          <rect className="dcl-in dcl-bar" x="162" y="73" width="36" height="5" rx="2.5" fill="#121018" />
          <rect className="dcl-in dcl-bar b2" x="167" y="82" width="26" height="4" rx="2" fill="#C9C5D6" />
          {[
            { x: 158, c: "#DAF56B" },
            { x: 172, c: "#5B3FE4" },
            { x: 186, c: "#25D366" },
            { x: 200, c: "#F6B6E6" },
          ].map((b, k) => (
            <circle key={b.x} className={cn("dcl-in dcl-btn", k > 0 && `k${k + 1}`)} cx={b.x + 2} cy="101" r="5.2" fill={b.c} />
          ))}
          <g className="dcl-in dcl-saved">
            <rect x="157" y="116" width="46" height="15" rx="7.5" fill="#121018" />
            <circle cx="166" cy="123.5" r="4" fill="#DAF56B" />
            <path className="dcl-tick" d="M164.2 123.6l1.3 1.3 2.6-2.8" stroke="#121018" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="173" y="121.5" width="22" height="4" rx="2" fill="#fff" opacity=".9" />
          </g>
        </g>
      </g>

      {/* contactless waves from the tap point */}
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          className={cn("dcl-wave", k === 1 && "w2", k === 2 && "w3")}
          d={`M${140 + k * 2} ${74 - k * 8}a${13 + k * 9} ${13 + k * 9} 0 0 1 0 ${24 + k * 16}`}
          transform={`translate(${6 + k * 7} 0)`}
          stroke="#5B3FE4"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {/* the NFC visiting card */}
      <ellipse className="dcl-shadow" cx="68" cy="132" rx="42" ry="5" fill="#121018" />
      <g className="dcl-card">
        <rect x="20" y="58" width="96" height="60" rx="10" fill="url(#dcl-card-g)" />
        <g clipPath="url(#dcl-card-clip)">
          <rect className="dcl-shine" x="20" y="54" width="44" height="70" fill="url(#dcl-shine-g)" transform="skewX(-18)" />
          <circle cx="112" cy="54" r="30" fill="#fff" opacity=".07" />
        </g>
        {/* chip */}
        <rect x="30" y="70" width="14" height="11" rx="2.5" fill="#DAF56B" />
        <path d="M30 75.5h14M37 70v11" stroke="#5B3FE4" strokeWidth=".8" opacity=".6" />
        {/* tap mark */}
        <circle cx="101" cy="74" r="1.8" fill="#fff" />
        <path d="M104.6 70.4a5 5 0 0 1 0 7.2M107.6 67.6a9 9 0 0 1 0 12.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        {/* name + role */}
        <rect x="30" y="94" width="40" height="5" rx="2.5" fill="#fff" />
        <rect x="30" y="103" width="26" height="3.6" rx="1.8" fill="#fff" opacity=".6" />
        <text x="106" y="109" textAnchor="end" fontSize="7" fontWeight="800" fill="#fff" fontFamily="var(--font-sans), system-ui, sans-serif" letterSpacing="-.2">
          digi<tspan fill="#DAF56B">cardo</tspan>
        </text>
      </g>
    </svg>
  );
}
