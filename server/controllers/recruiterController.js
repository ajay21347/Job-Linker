import Job from "../models/JobModel.js";
import Application from "../models/ApplicationModel.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     const recruiterId = req.user.id;

//     const jobs = await Job.find({
//       postedBy: recruiterId,
//     });

//     const jobIds = jobs.map((job) => job._id);

//     const applications = await Application.find({
//       job: {
//         $in: jobIds,
//       },
//     });

//     const shortlisted = applications.filter(
//       (app) => app.status === "Shortlisted",
//     ).length;

//     const selected = applications.filter(
//       (app) => app.status === "Selected",
//     ).length;

//     res.status(200).json({
//       totalJobs: jobs.length,
//       totalApplicants: applications.length,
//       shortlisted,
//       selected,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({
      postedBy: recruiterId,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    });

    const totalJobs = jobs.length;

    const totalApplications = applications.length;

    const shortlistedCandidates = applications.filter(
      (app) => app.status === "Shortlisted",
    ).length;

    const interviewScheduled = applications.filter(
      (app) => app.status === "Interview Scheduled",
    ).length;

    const hiredCandidates = applications.filter(
      (app) => app.status === "Selected",
    ).length;

    const hiringRate =
      totalApplications > 0
        ? ((hiredCandidates / totalApplications) * 100).toFixed(1)
        : 0;

    let mostAppliedJob = "No Applications";
    let topJobApplications = 0;

    for (const job of jobs) {
      const count = applications.filter(
        (app) => app.job.toString() === job._id.toString(),
      ).length;

      if (count > topJobApplications) {
        topJobApplications = count;
        mostAppliedJob = job.title;
      }
    }

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalApplications,
        shortlistedCandidates,
        interviewScheduled,
        hiredCandidates,
        hiringRate,
        mostAppliedJob,
        topJobApplications,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
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

export const getChartData = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { type } = req.query;

    const jobs = await Job.find({
      postedBy: recruiterId,
    }).select("_id title");

    const jobIds = jobs.map((job) => job._id);

    if (type === "applicationsByJob") {
      const chartData = await Promise.all(
        jobs.map(async (job) => {
          const count = await Application.countDocuments({
            job: job._id,
          });

          return {
            jobTitle: job.title,
            applications: count,
          };
        }),
      );

      res.status(200).json({
        success: true,
        chartData,
      });
    }

    if (type === "statusDistribution") {
      const result = await Application.aggregate([
        {
          $match: {
            job: {
              $in: jobIds,
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      const chartData = result.map((item) => ({
        status: item._id,
        count: item.count,
      }));

      return res.status(200).json({
        success: true,
        chartData,
      });
    }

    if (type === "applicationsTrend") {
      const result = await Application.aggregate([
        {
          $match: {
            job: {
              $in: jobIds,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

      const chartData = result.map((item) => ({
        label: item._id,
        value: item.count,
      }));

      return res.status(200).json({
        success: true,
        chartData,
      });
    }

    if (type === "topJobs") {
      let chartData = await Promise.all(
        jobs.map(async (job) => {
          const count = await Application.countDocuments({
            job: job._id,
          });

          return {
            jobTitle: job.title,
            applications: count,
          };
        }),
      );

      chartData = chartData
        .sort((a, b) => b.applications - a.applications)
        .slice(0, 5);

      return res.status(200).json({
        success: true,
        chartData,
      });
    }

    if (type === "selectionRate") {
      const chartData = await Promise.all(
        jobs.map(async (job) => {
          const totalApplications = await Application.countDocuments({
            job: job._id,
          });

          const selectedApplications = await Application.countDocuments({
            job: job._id,
            status: "Selected",
          });

          return {
            label: job.title,
            value:
              totalApplications > 0
                ? Number(
                    ((selectedApplications / totalApplications) * 100).toFixed(
                      1,
                    ),
                  )
                : 0,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        chartData,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid chart type",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load chart data",
    });
  }
};
