import ApplicationModel from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await ApplicationModel.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    await ApplicationModel.create({
      job: jobId,
      applicant: req.user.id,
      recruiter: job.postedBy,
      resume: {
        url: req.file.path,
        public_id: req.file.pathname,
      },
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({
      job: req.params.jobId,
    }).populate("applicant", "name email phone resume");

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkApplied = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      job: req.params.jobId,
      applicant: req.user.id,
    });

    res.status(200).json({
      success: true,
      applied: !!application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
