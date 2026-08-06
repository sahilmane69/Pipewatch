"use client";

import React from "react";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-zinc-800 rounded"></div>
              <div className="h-7 w-7 bg-zinc-800 rounded-lg"></div>
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <div className="h-6 w-12 bg-zinc-800 rounded"></div>
              <div className="h-3 w-16 bg-zinc-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-950/60 flex justify-between">
          <div className="h-4 w-32 bg-zinc-800 rounded"></div>
          <div className="h-4 w-24 bg-zinc-800 rounded"></div>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-1/4">
                <div className="h-7 w-7 bg-zinc-800 rounded-md shrink-0"></div>
                <div className="space-y-1 w-full">
                  <div className="h-3 w-28 bg-zinc-800 rounded"></div>
                  <div className="h-2.5 w-16 bg-zinc-800/60 rounded"></div>
                </div>
              </div>
              <div className="h-3 w-32 bg-zinc-800 rounded hidden md:block"></div>
              <div className="h-5 w-20 bg-zinc-800 rounded-full"></div>
              <div className="h-3 w-24 bg-zinc-800 rounded hidden sm:block"></div>
              <div className="h-4 w-12 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
