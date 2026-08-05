import { Router } from "express";
import { parseWorkflowRun } from "../services/github.service.js";

const router = Router();

router.post("/github", (req, res) => {

    const event = req.headers["x-github-event"];

    console.log("Event:", event);
    console.log("Action:", req.body.action);
    console.log("Repository:", req.body.repository?.full_name);
    console.log("Branch:", req.body.ref);

    if (event === "workflow_run") {
        const workflow = parseWorkflowRun(req.body);

        console.log("Workflow Details:");
        console.log(workflow);
    }


    res.sendStatus(200);
});

export default router;