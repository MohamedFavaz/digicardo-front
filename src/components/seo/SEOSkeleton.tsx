"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SEOSkeleton() {
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
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      {/* 2-Column Grid Skeleton: Form on left (7 cols), Preview on right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-4">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-4">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[36px] border border-border/80 bg-card p-6 shadow-card space-y-4">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
          <div className="rounded-[36px] border border-border/80 bg-card p-6 shadow-card space-y-3">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-4 w-44 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
