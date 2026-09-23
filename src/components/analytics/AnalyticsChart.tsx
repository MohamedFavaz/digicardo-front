"use client";

import * as React from "react";
import type { AnalyticsTimeseriesPoint } from "@/types/analytics";
import { TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalyticsChartProps {
  timeseries: AnalyticsTimeseriesPoint[];
}

export function AnalyticsChart({ timeseries }: AnalyticsChartProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<AnalyticsTimeseriesPoint | null>(null);
  const [showViews, setShowViews] = React.useState(true);
  const [showClicks, setShowClicks] = React.useState(true);

  if (!timeseries || timeseries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center space-y-2">
        <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto" />
        <h4 className="text-sm font-semibold text-foreground">
          No Timeseries Data Available
        </h4>
        <p className="text-xs text-muted-foreground font-medium">
          Analytics trend data will populate as visitors engage with your page.
        </p>
      </div>
    );
  }

  const maxVal = Math.max(
    ...timeseries.map((p) => {
      let m = 0;
      if (showViews) m = Math.max(m, p.views);
      if (showClicks) m = Math.max(m, p.clicks);
      return m;
    }),
    5 // Minimum scale
  );

  const width = 800;
  const height = 240;
  const paddingX = 44;
  const paddingY = 32;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Generate SVG coordinates
  const pointsViews = timeseries.map((p, i) => {
    const x = paddingX + (i / Math.max(timeseries.length - 1, 1)) * chartWidth;
    const y = height - paddingY - (p.views / maxVal) * chartHeight;
    return { x, y, point: p };
  });

  const pointsClicks = timeseries.map((p, i) => {
    const x = paddingX + (i / Math.max(timeseries.length - 1, 1)) * chartWidth;
    const y = height - paddingY - (p.clicks / maxVal) * chartHeight;
    return { x, y, point: p };
  });

  const pathViews = pointsViews.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const areaViews =
    pathViews +
    ` L ${pointsViews[pointsViews.length - 1]?.x} ${height - paddingY} L ${pointsViews[0]?.x} ${
      height - paddingY
    } Z`;

  const pathClicks = pointsClicks.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-5">
      {/* Header with Title & Metric Toggle Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">
              Performance Trend
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>Daily Rollup</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Daily distribution of page impressions and interactive link clicks.
          </p>
        </div>

        {/* Metric Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowViews(!showViews)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all select-none",
              showViews
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted/40 border-border text-muted-foreground opacity-60"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Views</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClicks(!showClicks)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all select-none",
              showClicks
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-muted/40 border-border text-muted-foreground opacity-60"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Clicks</span>
          </button>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="viewsAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingY - ratio * chartHeight;
            const labelVal = Math.round(ratio * maxVal);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontWeight="600"
                  className="font-mono select-none"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Area under Views */}
          {showViews && <path d={areaViews} fill="url(#viewsAreaGradient)" />}

          {/* Views Line */}
          {showViews && (
            <path
              d={pathViews}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Clicks Line */}
          {showClicks && (
            <path
              d={pathClicks}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Point Circles */}
          {timeseries.map((pt, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Invisible touch target hit area */}
              <circle
                cx={pointsViews[idx]?.x}
                cy={pointsViews[idx]?.y}
                r="12"
                fill="transparent"
              />

              {showViews && pointsViews[idx] && (
                <circle
                  cx={pointsViews[idx]?.x}
                  cy={pointsViews[idx]?.y}
                  r={hoveredPoint?.date === pt.date ? "6" : "4"}
                  fill="#8b5cf6"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all"
                />
              )}

              {showClicks && pointsClicks[idx] && (
                <circle
                  cx={pointsClicks[idx]?.x}
                  cy={pointsClicks[idx]?.y}
                  r={hoveredPoint?.date === pt.date ? "6" : "4"}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all"
                />
              )}
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 rounded-2xl border border-border/80 bg-card/95 p-3.5 text-xs shadow-float backdrop-blur-md space-y-1.5 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-muted-foreground font-bold font-mono">
              <Calendar className="w-3 h-3" />
              <span>{hoveredPoint.date}</span>
            </div>
            <div className="flex items-center gap-4 font-mono font-black">
              <span className="text-brand-600">
                Views: <strong>{hoveredPoint.views}</strong>
              </span>
              <span className="text-emerald-600">
                Clicks: <strong>{hoveredPoint.clicks}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Date Labels Bar */}
      <div className="flex justify-between px-11 text-[11px] text-muted-foreground font-mono font-semibold">
        <span>{timeseries[0]?.date}</span>
        {timeseries.length > 2 && (
          <span>{timeseries[Math.floor(timeseries.length / 2)]?.date}</span>
        )}
        <span>{timeseries[timeseries.length - 1]?.date}</span>
      </div>
    </div>
  );
}
