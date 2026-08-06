"use client";

import React from "react";
import {
  X,
  ExternalLink,
  GitBranch,
  GitCommit,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Terminal,
} from "lucide-react";
import { PipelineRun, PipelineStatus } from "@/lib/types";
import { formatDuration, formatFullDate, formatRelativeTime } from "@/lib/utils";

interface PipelineDetailsModalProps {
  pipeline: PipelineRun | null;
  onClose: () => void;
}

export function PipelineDetailsModal({
  pipeline,
  onClose,
}: PipelineDetailsModalProps) {
  if (!pipeline) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-zinc-950 border-l border-zinc-800 min-h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-start justify-between gap-4 bg-zinc-900/30">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                {pipeline.workflow}
              </h2>
              {renderStatusBadge(pipeline.status)}
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400">
              <span className="font-mono font-medium text-indigo-400">
                {pipeline.repository}
              </span>
              <span>•</span>
              <span className="font-mono text-zinc-500">
                ID: {pipeline.id}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Branch
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-zinc-200">
                <GitBranch className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{pipeline.branch}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Commit
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-zinc-200">
                <GitCommit className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>{pipeline.commitHash || "head"}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Duration
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-200 font-mono">
                <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span>{formatDuration(pipeline.durationSec)}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Triggered
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-200">
                <span>{formatRelativeTime(pipeline.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Commit details */}
          {pipeline.commitMessage && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-zinc-200 font-medium">
                    {pipeline.author || "system"}
                  </span>
                </div>
                <span title={formatFullDate(pipeline.createdAt)}>
                  {formatFullDate(pipeline.createdAt)}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-300 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
                {pipeline.commitMessage}
              </p>
            </div>
          )}

          {/* Execution Steps Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                Workflow Steps Breakdown
              </h3>
              <span className="text-[11px] text-zinc-500">
                {pipeline.steps?.length || 0} steps
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 divide-y divide-zinc-800/60 overflow-hidden">
              {pipeline.steps && pipeline.steps.length > 0 ? (
                pipeline.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-zinc-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {step.status === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                      {step.status === "failed" && (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      )}
                      {step.status === "running" && (
                        <Loader2 className="h-4 w-4 text-amber-400 animate-spin shrink-0" />
                      )}
                      {step.status === "queued" && (
                        <Clock className="h-4 w-4 text-zinc-500 shrink-0" />
                      )}
                      {step.status === "skipped" && (
                        <AlertCircle className="h-4 w-4 text-zinc-600 shrink-0" />
                      )}
                      <span className="font-mono text-zinc-200">
                        {step.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-zinc-500">
                        {step.status === "queued"
                          ? "queued"
                          : `${step.durationSec}s`}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                          step.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : step.status === "failed"
                            ? "bg-rose-500/10 text-rose-400"
                            : step.status === "running"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No step breakdown available for this run.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Close
          </button>

          {pipeline.url && (
            <a
              href={pipeline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-indigo-600/20"
            >
              <span>View External Log</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
