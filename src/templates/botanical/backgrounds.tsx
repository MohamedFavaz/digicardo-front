import * as React from "react";

/**
 * Botanical background art (manifest control "background"). Each is a light line drawing
 * in the palette's line colour, kept to the edges so text always sits on a calm surface.
 */

const line = "var(--c-line)";

function Leaves() {
  return (
    <>
      <svg viewBox="0 0 200 260" className="absolute -right-[30px] -top-[10px] h-[260px] w-[200px]">
        <path d="M150 0 C 120 60, 170 110, 120 170 S 90 240, 60 260" fill="none" stroke={line} strokeWidth="2" />
        <ellipse cx="160" cy="40" rx="22" ry="9" fill={line} opacity="0.7" transform="rotate(-35 160 40)" />
        <ellipse cx="124" cy="62" rx="20" ry="8" fill={line} opacity="0.5" transform="rotate(30 124 62)" />
        <ellipse cx="156" cy="112" rx="24" ry="9" fill={line} opacity="0.6" transform="rotate(-25 156 112)" />
        <ellipse cx="112" cy="146" rx="20" ry="8" fill={line} opacity="0.45" transform="rotate(35 112 146)" />
        <ellipse cx="128" cy="200" rx="22" ry="8" fill={line} opacity="0.55" transform="rotate(-30 128 200)" />
      </svg>
      <svg viewBox="0 0 160 200" className="absolute -left-10 bottom-[120px] h-[200px] w-[160px]">
        <path d="M20 200 C 50 150, 10 110, 60 60 S 110 10, 130 0" fill="none" stroke={line} strokeWidth="2" />
        <ellipse cx="44" cy="150" rx="20" ry="8" fill={line} opacity="0.5" transform="rotate(-40 44 150)" />
        <ellipse cx="58" cy="92" rx="22" ry="8" fill={line} opacity="0.45" transform="rotate(30 58 92)" />
        <ellipse cx="100" cy="40" rx="20" ry="8" fill={line} opacity="0.4" transform="rotate(-30 100 40)" />
      </svg>
    </>
  );
}

function Contours() {
  return (
    <svg viewBox="0 0 240 240" className="absolute -right-12 -top-12 h-[260px] w-[260px]" fill="none" stroke={line} strokeWidth="1.5">
      {[30, 55, 80, 105, 130, 155].map((r, i) => (
        <path
          key={r}
          opacity={0.9 - i * 0.12}
          d={`M${120 - r} 120 C ${120 - r} ${120 - r * 0.9}, ${120 + r * 0.8} ${120 - r * 1.05}, ${120 + r} 118 S ${120 + r * 0.3} ${120 + r * 1.1}, ${120 - r} 120 Z`}
        />
      ))}
    </svg>
  );
}

function Grid() {
  return (
    <svg className="absolute inset-x-0 top-0 h-[300px] w-full" preserveAspectRatio="none">
      <defs>
        <pattern id="bot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke={line} strokeWidth="1" />
        </pattern>
        <linearGradient id="bot-grid-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="bot-grid-mask">
          <rect width="100%" height="100%" fill="url(#bot-grid-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#bot-grid)" mask="url(#bot-grid-mask)" />
    </svg>
  );
}

function Glow() {
  return (
    <>
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--c-tint2)] opacity-60 blur-3xl" />
      <div className="absolute -left-24 top-[420px] h-64 w-64 rounded-full bg-[var(--c-tint1)] opacity-60 blur-3xl" />
    </>
  );
}

function Plain() {
  return <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--c-accent)]" />;
}

function Marble() {
  return (
    <svg viewBox="0 0 390 400" className="absolute inset-x-0 top-0 h-[400px] w-full" preserveAspectRatio="xMidYMin slice" fill="none" stroke={line} strokeLinecap="round">
      <path d="M-10 60 C 80 40, 120 110, 210 80 S 330 20, 400 70" strokeWidth="1.4" opacity="0.8" />
      <path d="M-10 90 C 60 80, 140 140, 230 120 S 340 90, 400 120" strokeWidth="0.8" opacity="0.6" />
      <path d="M260 0 C 250 60, 300 90, 280 160 S 320 260, 300 320" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function Dots() {
  return (
    <svg className="absolute inset-x-0 top-0 h-[280px] w-full">
      <defs>
        <pattern id="bot-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill={line} />
        </pattern>
        <linearGradient id="bot-dots-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="bot-dots-mask">
          <rect width="100%" height="100%" fill="url(#bot-dots-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#bot-dots)" mask="url(#bot-dots-mask)" />
    </svg>
  );
}

function Frosted() {
  return (
    <>
      <div className="absolute -right-16 -top-10 h-56 w-56 rounded-[40%] bg-[var(--c-tint1)] opacity-70 blur-2xl" />
      <div className="absolute right-20 top-24 h-28 w-28 rounded-full bg-[var(--c-tint3)] opacity-40 blur-2xl" />
      <div className="absolute -left-12 top-[520px] h-48 w-48 rounded-[40%] bg-[var(--c-tint2)] opacity-50 blur-2xl" />
    </>
  );
}

function Waves() {
  return (
    <svg viewBox="0 0 390 220" className="absolute inset-x-0 top-0 h-[220px] w-full" preserveAspectRatio="none" fill="none" stroke={line}>
      <path d="M0 40 C 90 90, 200 0, 390 60" strokeWidth="2" opacity="0.8" />
      <path d="M0 70 C 110 120, 210 30, 390 95" strokeWidth="1.5" opacity="0.55" />
      <path d="M0 100 C 120 150, 230 60, 390 130" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function Shapes() {
  return (
    <svg viewBox="0 0 200 200" className="absolute -right-6 -top-6 h-[200px] w-[200px]">
      <circle cx="130" cy="60" r="44" fill={line} opacity="0.45" />
      <path d="M60 150 a40 40 0 0 1 80 0 Z" fill={line} opacity="0.35" />
      <rect x="150" y="120" width="40" height="40" fill="none" stroke={line} strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

const BACKGROUNDS: Record<string, () => React.ReactNode> = {
  botanical: Leaves,
  topo: Contours,
  geometric: Grid,
  aura: Glow,
  minimal: Plain,
  marble: Marble,
  tech: Dots,
  frosted: Frosted,
  silk: Waves,
  bauhaus: Shapes,
};

export function BotanicalBackground({ variant }: { variant: string }) {
  const Art = BACKGROUNDS[variant] ?? Leaves;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Art />
    </div>
  );
}
