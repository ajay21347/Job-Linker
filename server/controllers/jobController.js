import Job from "../models/JobModel.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields must be filled",
      });
    }
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ success: false, message: "Only recruiters can post jobs" });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      postedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
