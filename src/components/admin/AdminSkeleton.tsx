"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-8 w-72 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
        <div className="flex gap-2 pt-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-[32px] border border-border/80 bg-card p-6 shadow-card space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-4">
        <Skeleton className="h-6 w-48 rounded-md" />
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
