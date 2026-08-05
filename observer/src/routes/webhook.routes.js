import { Router } from "express";

const router = Router();

router.post("/github", (req, res) => {
    console.log("Webhook Hit");
    return res.status(200).json({
        success: true
    });
});

export default router;