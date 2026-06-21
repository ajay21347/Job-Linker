import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Clock3,
  IndianRupee,
  MapPin,
  Sparkle,
  Sparkles,
  User2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getDeadlineText,
  getPostedDate,
  getPostedTime,
} from "@/utils/jobUtils";
import { useAiAssistant } from "@/context/AiAssistantContext";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [applied, setApplied] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const isExpired = job ? new Date(job.deadline) < new Date() : false;
  const [loadingStates, setLoadingStates] = useState({
    apply: false,
    analyze: false,
    upload: false,
    applicants: false,
    update: false,
  });
  const { setCurrentJob } = useAiAssistant();

  const setLoading = (key, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
        setCurrentJob(res.data.job);

        if (user?.role === "seeker") {
          const appliedRes = await api.get(`/application/check/${id}`);
          setApplied(appliedRes.data.applied);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load job");
      }
    };
    fetchJobs();
  }, [id]);

  const handleApplyClick = () => {
    if (!user?.resume?.url) {
      toast.error("Resume required");
      navigate("/profile");
      return;
    }
    setOpen(true);
  };

  const applyWithExisting = async () => {
    try {
      setLoading("apply", true);
      const res = await api.post("/application/apply", {
        jobId: job._id,
        resumeUrl: user.resume.url,
        public_id: user.resume.public_id,
      });

      toast.success(res.data.message);
      setApplied(true);
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading("apply", false);
    }
  };

  const applyWithNewResume = async () => {
    try {
      setLoading("upload", true);

      if (!file) {
        toast.warning("Please select a resume file");
        return;
      }

      const formData = new FormData();
      formData.append("jobId", job._id);
      formData.append("resume", file);

      const res = await api.post("/application/apply", formData);

      toast.success(res.data.message);
      setApplied(true);
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading("upload", false);
    }
  };
  const handleJobMatch = async () => {
    try {
      setLoading("analyze", true);
      const res = await api.post("/ai/analyze-job-match", { jobId: job._id });

      toast.success("Job match analysis completed");

      navigate("/resume-analysis", {
        state: { analysis: res.data.analysis },
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading("analyze", false);
    }
  };

  if (!job)
    return (
      <p className="min-h-screen flex items-center justify-center">
        Loading...
      </p>
    );

  return (
    <div className="p-6  min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-md">
        <CardContent className="p-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Briefcase className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {job.title}
                </h1>

                <div className="flex flex-wrap gap-4 mt-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    {job.salary
                      ? `${job.salary.toLocaleString("en-IN")} P.A.`
                      : "Not disclosed"}
                  </div>
                </div>
              </div>
            </div>
            {user?.role === "recruiter" ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate(`/applicants/${job._id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  View Applicants
                </Button>

                <Button
                  onClick={() => navigate(`/edit-job/${job._id}`)}
                  className="bg-purple-600 hover:bg-purple-700 hover:underline underline-offset-4
                  "
                >
                  Update Job
                </Button>
              </div>
            ) : (
              <div className="flex gap-4 mt-6 ">
                <Button
                  onClick={handleApplyClick}
                  disabled={applied || isExpired || loadingStates.apply}
                  className={`transition-all duration-200 ${
                    applied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 "
                  }`}
                >
                  {loadingStates.apply ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Applying...
                    </div>
                  ) : isExpired ? (
                    "Expired"
                  ) : applied ? (
                    "Applied"
                  ) : (
                    " Apply Now"
                  )}
                </Button>
                <Button
                  onClick={handleJobMatch}
                  disabled={loadingStates.analyze}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {loadingStates.analyze ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze Job Match
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    toast.info(
                      " AI Mock Interview will open in a new tab in 3 seconds",
                      {
                        description:
                          "The mock interview will open in a new tab.",
                      },
                    );

                    setTimeout(() => {
                      window.open(
                        `/mock-interview/${job._id}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }, 3000);
                  }}
                  className="  bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 px-6 py-3 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Sparkle className="w-4 h-4" />
                  Start AI Mock Interview
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              {job.jobType.replace(/\b\w/g, (char) => char.toUpperCase())}
            </div>

            <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium flex items-center gap-1">
              <Clock3 className="w-4 h-4" />
              <div className="flex flex-col">
                <span>{getPostedTime(job.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock3 className="w-4 h-4 text-red-500" />
              Deadline: {getDeadlineText(job.deadline)}
            </div>
          </div>
          {/* Description */}
          <div className="bg-white/70 rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Job Description
            </h2>
            <p
              className={`text-gray-700 leading-7 whitespace-pre-line transition-all duration-300 ${showFullDescription ? "" : "line-clamp-3"}`}
            >
              {job.description}
            </p>
            {job.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-3 text-purple-600 hover:text-purple-700 font-medium transition-all duration-500 ease-in-out"
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
          {/* Recruiter Information */}
          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Recruiter Information
            </h2>

            <div className="flex items-center gap-2 text-gray-700 ">
              <User2 className="w-4 h-4 text-indigo-600" />
              <span>
                {job.postedBy?.name} ({job.postedBy?.email})
              </span>
            </div>
          </div>

          {/* Posted Information */}
          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Posted Information
            </h2>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-sm text-gray-500">
                Posted on : {getPostedDate(job.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white text-black backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle>Choose your resume option below</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Opening resume...");
                window.open(
                  `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(user.resume?.url)}`,
                  "_blank",
                );
              }}
            >
              View Current Resume
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={applyWithExisting}
            >
              Use This Resume
            </Button>
            <div className="border-t p-4 ">
              <p className="text-sm mb-2">Upload New Resume</p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <Button
                  disabled={loadingStates.upload}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={applyWithNewResume}
                >
                  {loadingStates.upload ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    "Upload & Apply"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;
