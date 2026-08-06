"use client";

import React from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { PipelineStatus } from "@/lib/types";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: PipelineStatus | "All";
  setStatusFilter: (status: PipelineStatus | "All") => void;
  selectedRepo: string;
  setSelectedRepo: (repo: string) => void;
  repositories: string[];
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalCount: number;
}

const STATUS_OPTIONS: (PipelineStatus | "All")[] = [
  "All",
  "Success",
  "Failed",
  "Running",
  "Queued",
];

export function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedRepo,
  setSelectedRepo,
  repositories,
  onResetFilters,
  totalFilteredCount,
  totalCount,
}: FilterBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "All" ||
    selectedRepo !== "All";

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-lg p-3 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repository, workflow, or branch..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-9 pr-8 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Controls Container */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Repository Dropdown */}
          <div className="relative">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="appearance-none bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:border-zinc-700 cursor-pointer font-mono"
            >
              <option value="All">All Repositories</option>
              {repositories.map((repo) => (
                <option key={repo} value={repo}>
                  {repo}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-md flex items-center gap-1 transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-zinc-800/60 pt-2.5">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_OPTIONS.map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Result Counter */}
        <span className="text-[11px] font-mono text-zinc-500 text-right">
          Showing <span className="text-zinc-300">{totalFilteredCount}</span> /{" "}
          <span className="text-zinc-300">{totalCount}</span>
        </span>
      </div>
    </div>
  );
}
