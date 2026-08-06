"use client";

import React from "react";
import { Activity, RefreshCw, Play, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  onTriggerRun: () => void;
}

export function Header({
  onRefresh,
  isRefreshing,
  autoRefresh,
  setAutoRefresh,
  onTriggerRun,
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/10">
            <div className="h-full w-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                Pipewatch
              </h1>
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                DevOps
              </span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All workflows operational</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Live Polling Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
              autoRefresh
                ? "bg-zinc-900 border-zinc-700 text-zinc-200 shadow-sm"
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title="Toggle 5-second auto refresh"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
              }`}
            />
            <span>Auto-refresh {autoRefresh ? "On" : "Off"}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            title="Refresh pipeline status"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-zinc-400 ${
                isRefreshing ? "animate-spin text-indigo-400" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          {/* Trigger Mock Pipeline Action */}
          <button
            onClick={onTriggerRun}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-indigo-600/20 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Trigger Run</span>
          </button>
        </div>
      </div>
    </header>
  );
}
