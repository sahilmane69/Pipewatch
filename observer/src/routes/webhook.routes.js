import { Router } from "express";

const router = Router();

router.post("/github", (req, res) => {
    console.log("Webhook Received");
    console.log(req.body);

    res.status(200).json({
        success: true,
        message: "Webhook received"
    });
});

export default router;
