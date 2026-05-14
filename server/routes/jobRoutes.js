import express from "express";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createJob);

router.get("/", getJobs);

router.get("/:id", getJobById);

router.delete("/delete/:id", protect, deleteJob);

router.put("/update/:id", protect, updateJob);

export default router;
