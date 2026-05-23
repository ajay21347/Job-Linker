import express from "express";
import {
  analyzeJobMatch,
  analyzeResumeOpenAI,
  getAnalysisHistory,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze-resume", protect, analyzeResumeOpenAI);
router.post("/analyze-job-match", protect, analyzeJobMatch);
router.get("/history", protect, getAnalysisHistory);

export default router;
