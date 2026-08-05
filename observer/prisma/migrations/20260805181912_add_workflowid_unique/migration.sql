/*
  Warnings:

  - A unique constraint covering the columns `[workflowId]` on the table `PipelineRun` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PipelineRun_workflowId_key" ON "public"."PipelineRun"("workflowId");
