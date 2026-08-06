"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  GitBranch,
  GitCommit,
  User,
  ExternalLink,
  Terminal,
  FolderGit2,
  Copy,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";
import { PipelineRun, PipelineStatus } from "@/lib/types";
import { INITIAL_MOCK_PIPELINES, formatDuration, formatFullDate, formatRelativeTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PipelineDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [pipeline, setPipeline] = useState<PipelineRun | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"steps" | "logs">("steps");

  useEffect(() => {
    async function loadPipeline() {
      try {
        const res = await api.get("/pipelines");
        if (Array.isArray(res.data)) {
          const found = res.data.find((p: any) => String(p.id) === String(id));
          if (found) {
            setPipeline(found);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to mock
      }

      // Check initial mock list
      const mockFound = INITIAL_MOCK_PIPELINES.find((p) => p.id === id) || INITIAL_MOCK_PIPELINES[0];
      setPipeline(mockFound);
      setLoading(false);
    }

    loadPipeline();
  }, [id]);

  const copyHash = () => {
    if (pipeline?.commitHash) {
      navigator.clipboard.writeText(pipeline.commitHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderStatusBadge = (status?: PipelineStatus) => {
    switch (status) {
      case "Success":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Success
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </span>
        );
      case "Running":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Running
          </span>
        );
      case "Queued":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <Clock className="h-3.5 w-3.5" />
            Queued
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (!pipeline) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
        <p>Pipeline run not found.</p>
        <Link href="/" className="text-indigo-400 hover:underline text-xs mt-2 inline-block">
          ← Back to Pipelines
        </Link>
      </div>
    );
  }

  const repoOwner = pipeline.repository.split("/")[0] || "github";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Pipelines</span>
          </Link>

          <div className="flex items-center gap-3">
            {renderStatusBadge(pipeline.status)}
            {pipeline.url && (
              <a
                href={pipeline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <span>External Link</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Run Title Header */}
        <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                {/* Repo avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://github.com/${repoOwner}.png`}
                  alt={repoOwner}
                  className="h-4 w-4 rounded-full bg-zinc-800 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="text-zinc-200">{pipeline.repository}</span>
                <span>/</span>
                <span className="text-zinc-400">{pipeline.id}</span>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                {pipeline.workflow}
              </h1>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Branch
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-zinc-200">
                <GitBranch className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{pipeline.branch}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Commit
              </span>
              <div className="flex items-center justify-between mt-1 text-xs font-mono text-zinc-200">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>{pipeline.commitHash || "head"}</span>
                </div>
                <button
                  onClick={copyHash}
                  className="text-zinc-500 hover:text-zinc-300"
                  title="Copy commit hash"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Duration
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-zinc-200">
                <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span>{formatDuration(pipeline.durationSec)}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Triggered
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-200">
                <span>{formatRelativeTime(pipeline.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Commit Message Box */}
          {pipeline.commitMessage && (
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2 text-zinc-300 font-mono overflow-hidden">
                <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="font-semibold text-zinc-200 shrink-0">{pipeline.author || "dev"}:</span>
                <span className="truncate">{pipeline.commitMessage}</span>
              </div>
              <span className="text-[11px] text-zinc-500 shrink-0" title={formatFullDate(pipeline.createdAt)}>
                {formatFullDate(pipeline.createdAt)}
              </span>
            </div>
          )}
        </div>

        {/* View Toggle Tabs */}
        <div className="border-b border-zinc-800 flex items-center gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab("steps")}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "steps"
                ? "border-zinc-200 text-zinc-100"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Pipeline Steps ({pipeline.steps?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "logs"
                ? "border-zinc-200 text-zinc-100"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Raw Log Output</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "steps" ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 divide-y divide-zinc-800/60 overflow-hidden">
            {pipeline.steps && pipeline.steps.length > 0 ? (
              pipeline.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
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
                    <span className="font-mono text-xs text-zinc-200">
                      {step.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-zinc-500 text-[11px]">
                      {step.status === "queued" ? "queued" : `${step.durationSec}s`}
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
              <div className="p-6 text-center text-xs text-zinc-500">
                No individual step logs recorded.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 space-y-1.5 overflow-x-auto">
            <div className="text-zinc-500">[00:00:01] Pipewatch Agent v1.0.4 starting...</div>
            <div className="text-zinc-500">[00:00:02] Fetching repository metadata for {pipeline.repository}...</div>
            <div className="text-zinc-500">[00:00:03] Git checkout branch: {pipeline.branch} ({pipeline.commitHash || "head"})</div>
            <div className="text-emerald-400">[00:00:05] ✔ Environment setup complete.</div>
            <div className="text-zinc-300">[00:00:10] Executing pipeline task: {pipeline.workflow}...</div>
            {pipeline.status === "Failed" ? (
              <div className="text-rose-400">[00:00:25] ✖ Error: Pipeline execution failed with exit code 1.</div>
            ) : pipeline.status === "Success" ? (
              <div className="text-emerald-400">[00:00:45] ✔ Pipeline finished successfully. Exit code 0.</div>
            ) : (
              <div className="text-amber-400">[00:00:30] ⏳ Pipeline task in progress...</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
