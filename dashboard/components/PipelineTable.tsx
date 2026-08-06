"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  GitBranch,
  ChevronRight,
  FolderGit2,
} from "lucide-react";
import { PipelineRun, PipelineStatus } from "@/lib/types";
import { formatDuration, formatFullDate, formatRelativeTime } from "@/lib/utils";

interface PipelineTableProps {
  pipelines: PipelineRun[];
  onSelectRepo: (repo: string) => void;
  onSelectPipeline: (pipeline: PipelineRun) => void;
}

export function PipelineTable({
  pipelines,
  onSelectRepo,
  onSelectPipeline,
}: PipelineTableProps) {
  const renderStatusBadge = (status: PipelineStatus) => {
    switch (status) {
      case "Success":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Success
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </span>
        );
      case "Running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Running
          </span>
        );
      case "Queued":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <Clock className="h-3.5 w-3.5" />
            Queued
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-950/80 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <th className="py-3.5 px-4 sm:px-6">Repository</th>
              <th className="py-3.5 px-4 sm:px-6">Workflow & Branch</th>
              <th className="py-3.5 px-4 sm:px-6">Status</th>
              <th className="py-3.5 px-4 sm:px-6">Duration</th>
              <th className="py-3.5 px-4 sm:px-6">Triggered</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs">
            {pipelines.map((pipeline) => {
              const owner = pipeline.repository.split("/")[0] || "github";

              return (
                <tr
                  key={pipeline.id}
                  onClick={() => onSelectPipeline(pipeline)}
                  className="group cursor-pointer hover:bg-zinc-800/50 transition-colors duration-150"
                >
                  {/* Repository (Clickable Pill with Avatar) */}
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-zinc-200 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRepo(pipeline.repository);
                      }}
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 font-mono transition-all"
                      title={`Filter by repository ${pipeline.repository}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://github.com/${owner}.png`}
                        alt={owner}
                        className="h-3.5 w-3.5 rounded-full bg-zinc-800 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span>{pipeline.repository}</span>
                    </button>
                  </td>

                  {/* Workflow & Branch */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="space-y-1">
                      <div className="font-semibold text-zinc-100 group-hover:text-zinc-300 transition-colors">
                        {pipeline.workflow}
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                        <GitBranch className="h-3 w-3 text-zinc-500 shrink-0" />
                        <span>{pipeline.branch}</span>
                        {pipeline.commitHash && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500">
                              {pipeline.commitHash}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    {renderStatusBadge(pipeline.status)}
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono text-zinc-300">
                    {formatDuration(pipeline.durationSec)}
                  </td>

                  {/* Relative Timestamp */}
                  <td
                    className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-zinc-400"
                    title={formatFullDate(pipeline.createdAt)}
                  >
                    <span className="cursor-help hover:text-zinc-200 transition-colors">
                      {formatRelativeTime(pipeline.createdAt)}
                    </span>
                  </td>

                  {/* Action Link to Details */}
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                    <Link
                      href={`/pipelines/${pipeline.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-zinc-500 group-hover:text-zinc-200 group-hover:bg-zinc-800 transition-all"
                      title="Open details page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
