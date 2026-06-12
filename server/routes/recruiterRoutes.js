import express from "express";
import { protect } from "../middleware/authMiddleware.js";

// import {
//   getDashboardStats,
//   getRecruiterJobs,
//   getRecruiterApplicants,
//   getRecruiterAnalytics,
//   getChartData,
//   getApplicationsByJob,
// } from "../controllers/recruiterController.js";

import {
  getDashboardStats,
  getRecruiterJobs,
  getRecruiterApplicants,
  getRecruiterAnalytics,
  getChartData,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.get("/dashboard-stats", protect, getDashboardStats);

router.get("/jobs", protect, getRecruiterJobs);

router.get("/applicants", protect, getRecruiterApplicants);

router.get("/analytics", protect, getRecruiterAnalytics);

router.get("/chart-data", protect, getChartData);

export default router;
