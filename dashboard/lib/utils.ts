import { PipelineRun } from "./types";

/**
 * Format ISO date string into relative time string (e.g. "2 min ago", "just now", "3h ago")
 */
export function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds)) return "Unknown";
  if (diffInSeconds < 5) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} mo ago`;

  return `${Math.floor(diffInMonths / 12)}y ago`;
}

/**
 * Format duration in seconds to human readable form (e.g. "1m 42s", "28s")
 */
export function formatDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null) return "--";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) {
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
}

/**
 * Format full date for tooltips
 */
export function formatFullDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

/**
 * Realistic Mock Data for fallback & demonstration
 */
export const INITIAL_MOCK_PIPELINES: PipelineRun[] = [
  {
    id: "run-9021",
    workflowId: "109827341",
    repository: "pipewatch/observer",
    workflow: "CI / Integration Tests",
    branch: "main",
    status: "Running",
    conclusion: null,
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9021",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    durationSec: 124,
    commitHash: "8f3a1d9",
    commitMessage: "feat(collector): optimize metric parsing pipeline",
    author: "sahilmane",
    steps: [
      { name: "Set up job & environment", status: "success", durationSec: 4 },
      { name: "Checkout repository", status: "success", durationSec: 3 },
      { name: "Install Node dependencies", status: "success", durationSec: 18 },
      { name: "Run unit & integration tests", status: "running", durationSec: 99 },
      { name: "Build container image", status: "queued", durationSec: 0 },
      { name: "Publish artifacts", status: "queued", durationSec: 0 },
    ],
  },
  {
    id: "run-9020",
    workflowId: "109827340",
    repository: "pipewatch/dashboard",
    workflow: "Deploy to Production",
    branch: "main",
    status: "Success",
    conclusion: "success",
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9020",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(), // 14 mins ago
    durationSec: 88,
    commitHash: "c4b9012",
    commitMessage: "fix(ui): adjust layout spacing for telemetry metrics",
    author: "sahilmane",
    steps: [
      { name: "Set up Node.js environment", status: "success", durationSec: 5 },
      { name: "Checkout code", status: "success", durationSec: 2 },
      { name: "Install pnpm packages", status: "success", durationSec: 15 },
      { name: "Next.js Build & Lint", status: "success", durationSec: 42 },
      { name: "Deploy to Vercel production", status: "success", durationSec: 24 },
    ],
  },
  {
    id: "run-9019",
    workflowId: "109827339",
    repository: "pipewatch/database",
    workflow: "Prisma Migration Check",
    branch: "feature/add-indexing",
    status: "Failed",
    conclusion: "failure",
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9019",
    createdAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(), // 38 mins ago
    durationSec: 45,
    commitHash: "7e2f901",
    commitMessage: "feat(db): add unique constraint on workflow_id",
    author: "dev-alex",
    steps: [
      { name: "Set up PostgreSQL service", status: "success", durationSec: 8 },
      { name: "Checkout code", status: "success", durationSec: 2 },
      { name: "Run Prisma validate", status: "success", durationSec: 10 },
      { name: "Apply dry-run migration", status: "failed", durationSec: 25 },
      { name: "Rollback transaction", status: "skipped", durationSec: 0 },
    ],
  },
  {
    id: "run-9018",
    workflowId: "109827338",
    repository: "pipewatch/auth-service",
    workflow: "Security & Vulnerability Audit",
    branch: "main",
    status: "Success",
    conclusion: "success",
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9018",
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // 1.5 hours ago
    durationSec: 195,
    commitHash: "3a910bf",
    commitMessage: "security: update dependencies to patch CVE-2026-118",
    author: "dependabot[bot]",
    steps: [
      { name: "Checkout source", status: "success", durationSec: 3 },
      { name: "Dependency security scan (Trivy)", status: "success", durationSec: 92 },
      { name: "SAST CodeQL analysis", status: "success", durationSec: 100 },
    ],
  },
  {
    id: "run-9017",
    workflowId: "109827337",
    repository: "pipewatch/observer",
    workflow: "Build Docker Image",
    branch: "fix/goroutine-leak",
    status: "Queued",
    conclusion: null,
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9017",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    durationSec: 0,
    commitHash: "991e0a2",
    commitMessage: "fix: prevent memory leak in socket connection pool",
    author: "sahilmane",
    steps: [
      { name: "Waiting for available runner pool", status: "queued", durationSec: 0 },
    ],
  },
  {
    id: "run-9016",
    workflowId: "109827336",
    repository: "pipewatch/api-gateway",
    workflow: "E2E Contract Tests",
    branch: "main",
    status: "Success",
    conclusion: "success",
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9016",
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(), // 3.5 hours ago
    durationSec: 310,
    commitHash: "e501a4f",
    commitMessage: "chore: release v1.4.0 API specification",
    author: "sahilmane",
    steps: [
      { name: "Spin up mock API cluster", status: "success", durationSec: 40 },
      { name: "Run Cypress & Newman suites", status: "success", durationSec: 250 },
      { name: "Generate coverage reports", status: "success", durationSec: 20 },
    ],
  },
  {
    id: "run-9015",
    workflowId: "109827335",
    repository: "pipewatch/dashboard",
    workflow: "Unit & Visual Regression Tests",
    branch: "feature/dark-mode",
    status: "Failed",
    conclusion: "failure",
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9015",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    durationSec: 112,
    commitHash: "1104ef9",
    commitMessage: "style: add glassmorphism effects to sidebar",
    author: "dev-kate",
    steps: [
      { name: "Checkout repository", status: "success", durationSec: 2 },
      { name: "Install packages", status: "success", durationSec: 14 },
      { name: "Playwright visual snapshot comparison", status: "failed", durationSec: 96 },
    ],
  },
  {
    id: "run-9014",
    workflowId: "109827334",
    repository: "pipewatch/observer",
    workflow: "CI / Integration Tests",
    branch: "main",
    status: "Success",
    conclusion: "success",
    url: "https://github.com/sahilmane69/Pipewatch/actions/runs/9014",
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(), // 8.3 hours ago
    durationSec: 140,
    commitHash: "44ab210",
    commitMessage: "refactor: simplify event dispatcher payload",
    author: "sahilmane",
    steps: [
      { name: "Build & Test", status: "success", durationSec: 140 },
    ],
  },
];
