import * as React from "react";

/** Tiny decorative-but-real charts for the Home summary tiles (pure SVG, no library). */

function scale(values: number[], w: number, h: number, pad = 4) {
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  return values.map((v, i) => ({ x: pad + i * step, y: h - pad - (v / max) * (h - pad * 2) }));
}

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
function smooth(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function AreaSpark({ values, color = "#FFFFFF", className }: { values: number[]; color?: string; className?: string }) {
  const W = 200;
  const H = 80;
  const pts = scale(values.length ? values : [0, 0], W, H);
  const line = smooth(pts);
  const id = React.useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`a${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.55" />
          <stop offset="1" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={`${line} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`} fill={`url(#a${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function LineSpark({ values, color = "#38BDD8", className }: { values: number[]; color?: string; className?: string }) {
  const W = 200;
  const H = 80;
  const pts = scale(values.length ? values : [0, 0], W, H, 8);
  const marks = pts.filter((_, i) => i === 0 || i === pts.length - 1 || i === Math.floor(pts.length / 2));
  const id = React.useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${smooth(pts)} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`} fill={`url(#l${id})`} />
      <path d={smooth(pts)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {marks.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="#FFFFFF" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export function BarSpark({ values, colors = ["#5B3FE4", "#7FE3EE"], className }: { values: number[]; colors?: [string, string]; className?: string }) {
  const W = 200;
  const H = 80;
  const list = values.length ? values : [0];
  const max = Math.max(1, ...list);
  const gap = 4;
  const bw = (W - gap * (list.length - 1)) / list.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {list.map((v, i) => {
        const h = Math.max(4, (v / max) * (H - 4));
        return <rect key={i} x={i * (bw + gap)} y={H - h} width={bw} height={h} rx={Math.min(4, bw / 2)} fill={colors[i % 2]} />;
      })}
    </svg>
  );
}

export function DonutChart({ parts, size = 120, className }: { parts: { value: number; color: string }[]; size?: number; className?: string }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const r = 15.9155; // circumference 100
  let offset = 25;
  return (
    <svg viewBox="0 0 42 42" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="21" cy="21" r={r} fill="none" stroke="#EEEBFA" strokeWidth="7" />
      {total > 0 &&
        parts.map((p, i) => {
          const pct = (p.value / total) * 100;
          const el = <circle key={i} cx="21" cy="21" r={r} fill="none" stroke={p.color} strokeWidth="7" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset} />;
          offset -= pct;
          return el;
        })}
      <circle cx="21" cy="21" r="8.5" fill="#FFFFFF" />
    </svg>
  );
}
