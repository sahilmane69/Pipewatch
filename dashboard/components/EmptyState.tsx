"use client";

import React from "react";
import { Inbox, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onReset: () => void;
}

export function EmptyState({ searchQuery, onReset }: EmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 max-w-lg mx-auto my-8">
      <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-sm">
        <Inbox className="h-6 w-6 text-zinc-500" />
      </div>

      <h3 className="text-base font-semibold text-zinc-200">
        No pipeline runs found
      </h3>

      <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
        {searchQuery
          ? `No pipelines matched "${searchQuery}". Try searching for another keyword or clear active filters.`
          : "There are currently no pipeline runs matching the selected criteria."}
      </p>

      <div className="mt-5">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset all filters</span>
        </button>
      </div>
    </div>
  );
}
