import express from "express";
import {
  applyJob,
  checkApplied,
  getApplicants,
  getMyApplications,
  markRecruiterNotificationSeen,
  recruiterNotifications,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/apply", protect, upload.single("resume"), applyJob);
router.get("/applicants/:jobId", protect, getApplicants);
router.get("/check/:jobId", protect, checkApplied);
router.get("/my-applications", protect, getMyApplications);
router.get("/recruiter-notifications", protect, recruiterNotifications);
router.put("/mark-recruiter-seen", protect, markRecruiterNotificationSeen);

export default router;
