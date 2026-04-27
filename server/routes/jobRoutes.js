import express from "express";
import {
  createJob,
  getJobById,
  getJobs,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createJob);

router.get("/", getJobs);

router.get("/:id", getJobById);

export default router;
