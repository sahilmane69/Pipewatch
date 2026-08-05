import { Router } from "express";
import { parseWorkflowRun } from "../services/github.service.js";
import { savePipelineRun } from "../services/pipeline.service.js";

const router = Router();

router.post("/github", async (req, res) => {
    const event = req.headers["x-github-event"];

    if (event === "workflow_run") {
        const data = parseWorkflowRun(req.body);

        await savePipelineRun(data);

        console.log("Saved to database:", data);
    }

    res.sendStatus(200);
});

export default router;