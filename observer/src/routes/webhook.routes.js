import { Router } from "express";

const router = Router();

router.post("/github", (req, res) => {
    console.log("========== WEBHOOK ==========");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    res.status(200).json({
        success: true
    });
});

export default router;