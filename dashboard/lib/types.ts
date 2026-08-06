export type PipelineStatus = "Success" | "Failed" | "Running" | "Queued";

export interface PipelineStep {
  name: string;
  status: "success" | "failed" | "running" | "queued" | "skipped";
  durationSec: number;
}

export interface PipelineRun {
  id: string;
  workflowId?: string | number;
  repository: string;
  workflow: string;
  branch: string;
  status: PipelineStatus;
  conclusion: string | null;
  url?: string;
  createdAt: string;
  durationSec?: number;
  commitHash?: string;
  commitMessage?: string;
  author?: string;
  steps?: PipelineStep[];
}

export interface PipelineStats {
  total: number;
  success: number;
  failed: number;
  running: number;
  queued: number;
  successRate: number;
}
