"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsSkeleton() {
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

      {/* Filter Bar Skeleton */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      {/* Notifications List Skeleton */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-[28px] border border-border/80 bg-card p-5 shadow-card space-y-3">
            <div className="flex gap-3 items-center">
              <Skeleton className="h-9 w-9 rounded-2xl flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
