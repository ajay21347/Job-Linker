import express from "express";

import {
  aiChat,
  analyzeJobMatch,
  analyzeResumeOpenAI,
  careerSuggestions,
  generateInterviewQuestions,
  getAnalysisById,
  getAnalysisHistory,
} from "../controllers/aiController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", protect, getAnalysisHistory);

router.post("/chat", protect, aiChat);

router.post("/analyze-resume", protect, analyzeResumeOpenAI);

router.post("/analyze-job-match", protect, analyzeJobMatch);

router.post("/interview-questions", protect, generateInterviewQuestions);

router.post("/career-suggestions", protect, careerSuggestions);

router.get("/history/:id", protect, getAnalysisById);

export default router;
