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

    let resumeData;
    if (req.file) {
      resumeData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    } else {
      resumeData = {
        url: req.body.resumeUrl,
        public_id: req.body.public_id,
      };
    }

    if (!resumeData.url) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    await ApplicationModel.create({
      job: jobId,
      applicant: req.user.id,
      recruiter: job.postedBy,
      resume: resumeData,
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

export const getMyApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({
      applicant: req.user.id,
    })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    const updatedCount = applications.filter(
      (app) => app.isUpdated === true,
    ).length;

    await ApplicationModel.updateMany(
      {
        applicant: req.user.id,
        isUpdated: true,
      },
      {
        $set: { isUpdated: false },
      },
    );

    res.status(200).json({
      success: true,
      applications,
      updatedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const recruiterNotifications = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
    });
    const jobIds = jobs.map((job) => job._id);

    const count = await ApplicationModel.countDocuments({
      job: { $in: jobIds },
      isSeen: false,
    });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markRecruiterNotificationSeen = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });

    const jobIds = jobs.map((job) => job._id);

    await ApplicationModel.updateMany(
      {
        job: { $in: jobIds },
        isSeen: false,
      },
      {
        $set: { isSeen: true },
      },
    );
    res.status(200).json({ success: true, message: "Notification cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecruiterNotifications = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
    });

    const jobIds = jobs.map((job) => job._id);
    const notifications = await ApplicationModel.find({ job: { $in: jobIds } })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await ApplicationModel.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const validStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview Scheduled",
      "Selected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    application.status = status;
    application.isUpdated = true;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application ${status}`,
      application,
    });
  } catch (error) {
    console.log(error);
  }
};
