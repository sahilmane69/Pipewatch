"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "@/lib/api";
import { PipelineRun, PipelineStats, PipelineStatus } from "@/lib/types";
import { INITIAL_MOCK_PIPELINES } from "@/lib/utils";

import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { FilterBar } from "@/components/FilterBar";
import { PipelineTable } from "@/components/PipelineTable";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { PipelineDetailsModal } from "@/components/PipelineDetailsModal";

export default function Home() {
  const [pipelines, setPipelines] = useState<PipelineRun[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<PipelineStatus | "All">("All");
  const [selectedRepo, setSelectedRepo] = useState<string>("All");

  // Selected modal details
  const [selectedPipelineModal, setSelectedPipelineModal] = useState<PipelineRun | null>(null);

  // Fetch pipeline data from API with fallback mock
  const fetchPipelines = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);

    try {
      const res = await api.get("/pipelines");
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Normalize backend data structure
        const normalized: PipelineRun[] = res.data.map((item: any, idx: number) => {
          // Normalize status representation
          const rawStatus = (item.status || "").toLowerCase();
          const rawConclusion = (item.conclusion || "").toLowerCase();
          
          let status: PipelineStatus = "Queued";
          if (rawStatus === "completed" || rawStatus === "success") {
            status = rawConclusion === "failure" ? "Failed" : "Success";
          } else if (rawStatus === "in_progress" || rawStatus === "running") {
            status = "Running";
          } else if (rawStatus === "failed" || rawConclusion === "failure") {
            status = "Failed";
          } else if (rawStatus === "queued" || rawStatus === "pending") {
            status = "Queued";
          } else if (item.status === "Success" || item.status === "Failed" || item.status === "Running" || item.status === "Queued") {
            status = item.status;
          }

          return {
            id: item.id || `run-${1000 + idx}`,
            workflowId: item.workflowId || item.id,
            repository: item.repository || "pipewatch/core",
            workflow: item.workflow || "CI / Workflow",
            branch: item.branch || "main",
            status: status,
            conclusion: item.conclusion ?? null,
            url: item.url || undefined,
            createdAt: item.createdAt || new Date().toISOString(),
            durationSec: item.durationSec || Math.floor(Math.random() * 180) + 20,
            commitHash: item.commitHash || "a1b2c3d",
            commitMessage: item.commitMessage || "chore: pipeline update",
            author: item.author || "developer",
            steps: item.steps || [
              { name: "Checkout repository", status: "success", durationSec: 3 },
              { name: "Build & Test", status: status === "Failed" ? "failed" : status === "Running" ? "running" : "success", durationSec: 45 },
            ],
          };
        });
        setPipelines(normalized);
      } else {
        // Fallback to initial mock pipelines if API returns empty array
        setPipelines(INITIAL_MOCK_PIPELINES);
      }
    } catch (err) {
      // API offline or error, fallback to rich mock data
      setPipelines((prev) => (prev.length > 0 ? prev : INITIAL_MOCK_PIPELINES));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  // Polling interval
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      fetchPipelines();
    }, 5000);

    return () => clearInterval(timer);
  }, [autoRefresh, fetchPipelines]);

  // Extract unique repositories for dropdown filter
  const repositories = useMemo(() => {
    const repos = new Set(pipelines.map((p) => p.repository));
    return Array.from(repos).sort();
  }, [pipelines]);

  // Filtered pipeline list
  const filteredPipelines = useMemo(() => {
    return pipelines.filter((pipeline) => {
      // Status filter
      if (statusFilter !== "All" && pipeline.status !== statusFilter) {
        return false;
      }

      // Repository filter
      if (selectedRepo !== "All" && pipeline.repository !== selectedRepo) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesRepo = pipeline.repository.toLowerCase().includes(query);
        const matchesWorkflow = pipeline.workflow.toLowerCase().includes(query);
        const matchesBranch = pipeline.branch.toLowerCase().includes(query);
        const matchesCommit = (pipeline.commitMessage || "").toLowerCase().includes(query);
        return matchesRepo || matchesWorkflow || matchesBranch || matchesCommit;
      }

      return true;
    });
  }, [pipelines, statusFilter, selectedRepo, searchQuery]);

  // Calculate statistics summary
  const stats: PipelineStats = useMemo(() => {
    const total = pipelines.length;
    const success = pipelines.filter((p) => p.status === "Success").length;
    const failed = pipelines.filter((p) => p.status === "Failed").length;
    const running = pipelines.filter((p) => p.status === "Running").length;
    const queued = pipelines.filter((p) => p.status === "Queued").length;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    return { total, success, failed, running, queued, successRate };
  }, [pipelines]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setSelectedRepo("All");
  };

  // Trigger simulated new run
  const handleTriggerRun = () => {
    const repos = ["pipewatch/observer", "pipewatch/dashboard", "pipewatch/auth-service", "pipewatch/database"];
    const workflows = ["CI / Unit Tests", "Deploy to Staging", "Security Audit", "Release Build"];
    const branches = ["main", "feature/telemetry-v2", "fix/memory-leak"];
    const authors = ["sahilmane", "alex-dev", "kate-ops"];

    const randomRepo = repos[Math.floor(Math.random() * repos.length)];
    const randomWorkflow = workflows[Math.floor(Math.random() * workflows.length)];
    const randomBranch = branches[Math.floor(Math.random() * branches.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

    const newRun: PipelineRun = {
      id: `run-${Math.floor(1000 + Math.random() * 9000)}`,
      workflowId: `${Date.now()}`,
      repository: randomRepo,
      workflow: randomWorkflow,
      branch: randomBranch,
      status: "Running",
      conclusion: null,
      url: `https://github.com/sahilmane69/Pipewatch/actions/runs/${Date.now()}`,
      createdAt: new Date().toISOString(),
      durationSec: 12,
      commitHash: Math.random().toString(36).substring(2, 9),
      commitMessage: `feat: trigger build run #${Math.floor(Math.random() * 100)}`,
      author: randomAuthor,
      steps: [
        { name: "Set up job runner", status: "success", durationSec: 3 },
        { name: "Checkout repository", status: "success", durationSec: 2 },
        { name: "Execute pipeline task", status: "running", durationSec: 7 },
        { name: "Publish status webhook", status: "queued", durationSec: 0 },
      ],
    };

    setPipelines((prev) => [newRun, ...prev]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar Header */}
      <Header
        onRefresh={() => fetchPipelines(true)}
        isRefreshing={isRefreshing}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onTriggerRun={handleTriggerRun}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Summary Metrics Cards */}
            <SummaryCards
              stats={stats}
              selectedStatus={statusFilter}
              onSelectStatus={setStatusFilter}
            />

            {/* Search & Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedRepo={selectedRepo}
              setSelectedRepo={setSelectedRepo}
              repositories={repositories}
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredPipelines.length}
              totalCount={pipelines.length}
            />

            {/* Pipeline Data Table / Empty State */}
            {filteredPipelines.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                onReset={handleResetFilters}
              />
            ) : (
              <PipelineTable
                pipelines={filteredPipelines}
                onSelectRepo={(repo) => setSelectedRepo(repo)}
                onSelectPipeline={(pipeline) => setSelectedPipelineModal(pipeline)}
              />
            )}
          </>
        )}
      </main>

      {/* Details Slide-Over Modal */}
      <PipelineDetailsModal
        pipeline={selectedPipelineModal}
        onClose={() => setSelectedPipelineModal(null)}
      />

      {/* Clean Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">Pipewatch</span>
            <span>•</span>
            <span>DevOps CI/CD Observer</span>
          </div>
          <p className="text-zinc-600">
            Real-time pipeline monitoring & status telemetry dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}