import express from "express";
import cors from "cors";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "pipewatch Observer Running "
    });
});
app.use("/webhook", webhookRoutes);

export default app;