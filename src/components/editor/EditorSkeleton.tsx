"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function EditorSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Skeleton */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>
          <Skeleton className="h-8 w-60 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* Main 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Blocks List Skeleton (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border/80 bg-card p-5 shadow-card flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <Skeleton className="h-6 w-4 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-3 w-56 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Preview Frame Skeleton (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-[36px] border border-border/80 bg-card p-6 shadow-card space-y-4">
            <Skeleton className="h-6 w-32 rounded-md" />
            <div className="w-full max-w-[280px] mx-auto h-[440px] rounded-[36px] border-2 border-border/80 bg-muted/20 p-4 space-y-3">
              <Skeleton className="h-3 w-16 rounded-full mx-auto" />
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-4 w-28 rounded-md mx-auto" />
              <Skeleton className="h-3 w-40 rounded-md mx-auto" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
