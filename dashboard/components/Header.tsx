"use client";

import React from "react";
import { Activity, RefreshCw } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
}

export function Header({
  onRefresh,
  isRefreshing,
  autoRefresh,
  setAutoRefresh,
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Activity className="h-4 w-4 text-zinc-300" />
          </div>
          <h1 className="text-base font-semibold tracking-tight text-zinc-100">
            Pipewatch
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Refresh pipeline status"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-zinc-400 ${
                isRefreshing ? "animate-spin text-zinc-200" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              autoRefresh
                ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                : "bg-zinc-950 border-zinc-800/60 text-zinc-500 hover:text-zinc-300"
            }`}
            title="Toggle auto refresh"
          >
            <span>Auto Refresh {autoRefresh ? "On" : "Off"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
