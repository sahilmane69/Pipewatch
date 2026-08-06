import express from "express";
import cors from "cors";

import webhookRoutes from "./routes/webhook.routes.js";
import pipelineRoutes from "./routes/pipeline.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Pipewatch Observer Running 🚀",
    });
});

app.use("/webhook", webhookRoutes);
app.use("/api/pipelines", pipelineRoutes);

export default app;