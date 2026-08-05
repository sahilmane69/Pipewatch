import { Router } from "express";

const router = Router();

router.post("/github", (req, res) => {

    console.log("=================================");
    console.log("EVENT:", req.headers["x-github-event"]);
    console.log("ACTION:", req.body.action);
    console.log("REPOSITORY:", req.body.repository?.full_name);
    console.log("BRANCH:", req.body.ref);
    console.log("=================================");

    res.sendStatus(200);
});

export default router;