"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* 5 Metric Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/80 bg-card p-5 shadow-card space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-2xl" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Chart Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-4 w-60 rounded-md" />
          </div>
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>

      {/* Bottom 2-Column Grid Skeleton: Top Blocks & Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-4">
          <Skeleton className="h-6 w-44 rounded-md" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-4">
          <Skeleton className="h-6 w-40 rounded-md" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
