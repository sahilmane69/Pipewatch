import prisma from "../config/prisma.js";

export const getAllPipelines = async (req, res) => {
    try {
        const pipelines = await prisma.pipelineRun.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.json(
            JSON.parse(
                JSON.stringify(
                    pipelines,
                    (_, value) =>
                        typeof value === "bigint"
                            ? value.toString()
                            : value
                )
            )
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};