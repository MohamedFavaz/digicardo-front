"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
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
        <Skeleton className="h-10 w-64 rounded-2xl" />
      </div>

      {/* Profile Form Card Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-5">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-11 w-full max-w-xl rounded-2xl" />
        <Skeleton className="h-11 w-full max-w-xl rounded-2xl" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Password Card Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-5">
        <Skeleton className="h-6 w-44 rounded-md" />
        <Skeleton className="h-11 w-full max-w-xl rounded-2xl" />
        <Skeleton className="h-11 w-full max-w-xl rounded-2xl" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
    </div>
  );
}
