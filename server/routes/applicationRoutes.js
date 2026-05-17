import express from "express";
import {
  applyJob,
  checkApplied,
  getApplicants,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/apply", protect, upload.single("resume"), applyJob);
router.get("/applicants/:jobId", protect, getApplicants);
router.get("/check/:jobId", protect, checkApplied);

export default router;
