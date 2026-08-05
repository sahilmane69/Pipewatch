import prisma from "../config/prisma.js";

export const savePipelineRun = async (data) => {
    return await prisma.pipelineRun.create({
        data: {
            workflowId: data.workflowId,
            repository: data.repository,
            workflow: data.workflow,
            branch: data.branch,
            status: data.status,
            conclusion: data.conclusion,
            url: data.url,
        },
    });
};