import express from "express";
import { createJob, getJobs } from "../controllers/jobController";

const router = express.Router();

router.post("/create", protect, createJob);

router.get("/", getJobs);

export default router;
