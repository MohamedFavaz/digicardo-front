"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade">
      {/* Welcome header skeleton */}
      <div className="pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-3 w-52 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* 4 Metric Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-20 rounded" />
            <Skeleton className="h-2.5 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Main 2-Column grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-xl border border-border bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>

          <div className="rounded-xl border border-border bg-white p-6 space-y-3">
            <Skeleton className="h-4 w-20 rounded" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border">
                <Skeleton className="h-7 w-7 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-2.5 w-48 rounded" />
                </div>
                <Skeleton className="h-5 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-xl border border-border bg-white p-5 space-y-4">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="w-full max-w-[260px] mx-auto h-[380px] rounded-3xl border-4 border-slate-900 bg-muted/20 p-4 space-y-3">
              <Skeleton className="h-12 w-12 rounded-full mx-auto" />
              <Skeleton className="h-3.5 w-24 rounded mx-auto" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
