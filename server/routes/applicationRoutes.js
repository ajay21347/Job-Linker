import express from "express";
import {
  applyJob,
  checkApplied,
  getApplicants,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyJob);
router.get("/applicants/:jobId", protect, getApplicants);
router.get("/check/:jobId", protect, checkApplied);

export default router;
