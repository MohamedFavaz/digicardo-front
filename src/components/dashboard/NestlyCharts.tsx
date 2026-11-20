import * as React from "react";

/** Small SVG charts in the Nestly look (sage bars, olive highlight, dashed overlay, gauges). */

const OLIVE = "#343C22";
const SAGE = "#B0C08F";

/** Monthly/daily bars with the highest bar highlighted and an optional dashed second series. */
export function NestlyBars({
  labels,
  values,
  overlay,
  unit,
  className,
}: {
  labels: string[];
  values: number[];
  overlay?: number[];
  unit: string;
  className?: string;
}) {
  const W = 560;
  const H = 200;
  const top = 34;
  const max = Math.max(1, ...values, ...(overlay ?? []));
  const n = Math.max(1, values.length);
  const slot = W / n;
  const bw = Math.min(30, slot * 0.62);
  const peak = values.reduce((best, v, i) => (v > values[best] ? i : best), 0);
  const y = (v: number) => H - (v / max) * (H - top);
  const id = React.useId().replace(/:/g, "");
  // Whole-number axis labels without repeats (small counts would give "0, 0, 1, 1").
  const ticks = [...new Set([0, 0.33, 0.66, 1].map((f) => Math.round(max * f)))];

  const line =
    overlay && overlay.length > 1
      ? overlay.map((v, i) => `${i === 0 ? "M" : "L"}${(i + 0.5) * slot},${y(v)}`).join(" ")
      : null;

  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between pb-6 text-[11px] text-[#9A9C8F]" style={{ height: 200 }}>
          {[...ticks].reverse().map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[176px] w-full" role="img" aria-label={`${unit} per day`}>
            <defs>
              <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={SAGE} />
                <stop offset="1" stopColor="#E7ECDC" />
              </linearGradient>
            </defs>
            {values.map((v, i) => {
              const h = Math.max(6, (v / max) * (H - top));
              const x = i * slot + (slot - bw) / 2;
              return <rect key={i} x={x} y={H - h} width={bw} height={h} rx={bw / 2.4} fill={i === peak && v > 0 ? OLIVE : `url(#b${id})`} />;
            })}
            {line && <path d={line} fill="none" stroke="#6A6C61" strokeWidth="1.6" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />}
          </svg>
          <div className="mt-1 flex text-[11px] text-[#9A9C8F]">
            {labels.map((l, i) => (
              <span key={i} className={`flex-1 truncate text-center ${i === peak && values[peak] > 0 ? "font-medium text-[#121212]" : ""}`}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
      {values[peak] > 0 && (
        <p className="sr-only">
          Busiest: {labels[peak]} with {values[peak]} {unit}
        </p>
      )}
    </div>
  );
}

/** Peak tooltip pill (rendered by the caller above the chart). */
export function PeakPill({ value, label, unit }: { value: number; label: string; unit: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#343C22] px-2.5 py-1 text-xs text-white">
      <span className="font-semibold">
        {value} {unit}
      </span>
      <span className="uppercase tracking-wide text-white/60">{label}</span>
    </span>
  );
}

/** Semicircle gauge with an outer (olive) and inner (sage) arc, like the reference "Buyer match". */
export function NestlyGauge({ value, inner, className }: { value: number; inner?: number; className?: string }) {
  const arc = (r: number) => `M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`;
  const len = (r: number) => Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const iv = Math.max(0, Math.min(100, inner ?? value * 0.7));
  return (
    <svg viewBox="0 0 200 108" className={className} aria-hidden="true">
      <path d={arc(84)} fill="none" stroke="#E7ECDC" strokeWidth="14" strokeLinecap="round" />
      <path d={arc(84)} fill="none" stroke={OLIVE} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(v / 100) * len(84)} ${len(84)}`} />
      <path d={arc(62)} fill="none" stroke="#EEF2E4" strokeWidth="12" strokeLinecap="round" />
      <path d={arc(62)} fill="none" stroke={SAGE} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(iv / 100) * len(62)} ${len(62)}`} />
    </svg>
  );
}

/** Small progress ring for stat tiles. */
export function MiniRing({ value, className }: { value: number; className?: string }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#E7ECDC" strokeWidth="4" />
      <circle cx="18" cy="18" r={r} fill="none" stroke={OLIVE} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(v / 100) * c} ${c}`} transform="rotate(-90 18 18)" />
    </svg>
  );
}

/** Thin vertical bars for stat tiles. */
export function MiniBars({ values, className }: { values: number[]; className?: string }) {
  const list = values.length ? values : [0];
  const max = Math.max(1, ...list);
  return (
    <svg viewBox={`0 0 ${list.length * 6} 32`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {list.map((v, i) => {
        const h = Math.max(4, (v / max) * 30);
        return <rect key={i} x={i * 6 + 1} y={32 - h} width="3" height={h} rx="1.5" fill={i === list.length - 1 ? OLIVE : "#8F9A72"} />;
      })}
    </svg>
  );
}

/** Thin line for stat tiles, last point marked. */
export function MiniLine({ values, className }: { values: number[]; className?: string }) {
  const list = values.length > 1 ? values : [0, 0];
  const max = Math.max(1, ...list);
  const pts = list.map((v, i) => [(i / (list.length - 1)) * 70 + 2, 28 - (v / max) * 24] as const);
  const last = pts[pts.length - 1];
  return (
    <svg viewBox="0 0 74 32" className={className} aria-hidden="true">
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#6A6C61" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#FFFFFF" stroke={OLIVE} strokeWidth="1.6" />
    </svg>
  );
}
