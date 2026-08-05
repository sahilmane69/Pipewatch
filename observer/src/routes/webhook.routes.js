import { Router } from "express";

const router = Router();

router.post("/github", (req, res) => {

    const event = req.headers["x-github-event"];

    console.log("=================================");
    console.log("Event:", event);
    console.log("Action:", req.body.action);
    console.log("Repository:", req.body.repository?.full_name);
    console.log("Branch:", req.body.ref);
    console.log("=================================");

    res.sendStatus(200);
});

export default router;