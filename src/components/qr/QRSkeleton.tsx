"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function QRSkeleton() {
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

      {/* 2-Column Workspace Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-4">
            <Skeleton className="h-6 w-36 rounded-md" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          </div>
          <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-4">
            <Skeleton className="h-6 w-44 rounded-md" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-4 flex flex-col items-center">
            <Skeleton className="h-64 w-64 rounded-3xl" />
            <Skeleton className="h-4 w-40 rounded-md" />
            <div className="flex gap-2 w-full pt-2">
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 flex-1 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
