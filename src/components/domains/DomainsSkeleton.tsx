"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DomainsSkeleton() {
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

      {/* Domain Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
