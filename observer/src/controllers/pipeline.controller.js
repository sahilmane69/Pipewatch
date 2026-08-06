import prisma from "../config/prisma.js";

export const getAllPipelines = async (req, res) => {
    try {
        const pipelines = await prisma.pipelineRun.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        const response = pipelines.map((pipeline) => ({
            ...pipeline,
            workflowId: pipeline.workflowId
                ? pipeline.workflowId.toString()
                : null,
        }));

        return res.status(200).json(response);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch pipelines",
            error: error.message,
        });
    }
};