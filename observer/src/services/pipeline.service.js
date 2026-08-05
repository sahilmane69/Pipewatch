export const savePipelineRun = async (data) => {
    return await prisma.pipelineRun.upsert({
        where: {
            workflowId: BigInt(data.workflowId),
        },

        update: {
            status: data.status,
            conclusion: data.conclusion,
            branch: data.branch,
            url: data.url,
        },

        create: {
            workflowId: BigInt(data.workflowId),
            repository: data.repository,
            workflow: data.workflow,
            branch: data.branch,
            status: data.status,
            conclusion: data.conclusion,
            url: data.url,
        },
    });
};