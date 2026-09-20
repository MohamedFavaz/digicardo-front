"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function BillingSkeleton() {
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
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>

      {/* Current Plan Card Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-20 w-64 rounded-2xl" />
      </div>

      {/* 3 Usage Meters Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-[28px] border border-border/80 bg-card p-5 shadow-card space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
        ))}
      </div>

      {/* Plans Comparison Skeleton */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-44 rounded-md" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[32px] border border-border/80 bg-card p-6 shadow-card space-y-4">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
