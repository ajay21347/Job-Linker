import express from "express";
import { analyzeResumeOpenAI } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze-resume", protect, analyzeResumeOpenAI);

export default router;
