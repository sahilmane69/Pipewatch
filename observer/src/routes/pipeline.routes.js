import { Router } from "express";
import { getAllPipelines } from "../controllers/pipeline.controller.js";

const router = Router();

router.get("/", getAllPipelines);

export default router;