import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
  getRecruiterJobs,
  getRecruiterApplicants,
  getChartData,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.get("/dashboard-stats", protect, getDashboardStats);

router.get("/jobs", protect, getRecruiterJobs);

router.get("/applicants", protect, getRecruiterApplicants);

router.get("/chart-data", protect, getChartData);

export default router;
