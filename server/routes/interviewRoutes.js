import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  completeInterview,
  generateFeedback,
  getInterviewById,
  getInterviewHistory,
  startInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/feedback", protect, generateFeedback);
router.post("/complete", protect, completeInterview);
router.get("/history", protect, getInterviewHistory);
router.get("/:id", protect, getInterviewById);

export default router;
