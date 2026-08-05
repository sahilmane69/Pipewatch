router.post("/github", async (req, res) => {
    const event = req.headers["x-github-event"];

    if (event === "workflow_run") {
        const data = parseWorkflowRun(req.body);

        console.log("Parsed Data:", data);

        const saved = await savePipelineRun(data);

        console.log("Saved Row:", saved);
    }

    res.sendStatus(200);
});