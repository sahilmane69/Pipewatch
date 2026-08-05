-- CreateTable
CREATE TABLE "public"."PipelineRun" (
    "id" TEXT NOT NULL,
    "workflowId" INTEGER,
    "repository" TEXT NOT NULL,
    "workflow" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "conclusion" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id")
);
