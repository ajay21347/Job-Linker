import Job from "../models/JobModel.js";
import Application from "../models/ApplicationModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({
      postedBy: recruiterId,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    });

    const shortlisted = applications.filter(
      (app) => app.status === "Shortlisted",
    ).length;

    const selected = applications.filter(
      (app) => app.status === "Selected",
    ).length;

    res.status(200).json({
      totalJobs: jobs.length,
      totalApplicants: applications.length,
      shortlisted,
      selected,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRecruiterApplicants = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
    });

    const jobIds = jobs.map((job) => job._id);

    const applicants = await Application.find({
      job: {
        $in: jobIds,
      },
    })
      .populate("applicant", "name email phone")
      .populate("job", "title company")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      applicants,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRecruiterAnalytics = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    }).populate("job", "title");

    const jobCounts = {};

    applications.forEach((app) => {
      const title = app.job?.title || "Unknown";

      jobCounts[title] = (jobCounts[title] || 0) + 1;
    });

    let mostAppliedJob = "No Applications";

    let max = 0;

    Object.entries(jobCounts).forEach(([title, count]) => {
      if (count > max) {
        max = count;

        mostAppliedJob = title;
      }
    });

    const selected = applications.filter(
      (app) => app.status === "Selected",
    ).length;

    res.status(200).json({
      mostAppliedJob,
      totalApplications: applications.length,
      selected,
      applicationsPerJob: jobCounts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
