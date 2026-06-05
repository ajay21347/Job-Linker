import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { Briefcase, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getDeadlineText, getPostedTime } from "@/utils/jobUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { useAiAssistant } from "@/context/AiAssistantContext";
const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { open } = useAiAssistant();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");

        const myJobs = res.data.jobs.filter(
          (job) => job.postedBy?._id === user._id,
        );
        setJobs(myJobs);
      } catch (error) {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/delete/${id}`);

      setJobs(jobs.filter((job) => job._id !== id));

      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

          <p className="text-gray-600 font-medium">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8 transition-all duration-300 ${open ? "mr-[-120px]" : "mr-0"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Job Posts</h1>

        <Button
          onClick={() => navigate("/create-job")}
          className="bg-purple-600 hover:bg-purple-700 flex text-white items-center gap-2 mt-5"
        >
          <Plus className="w-4 h-4 mr-1" />
          Post Job
        </Button>
      </div>

      {/* Job Grid */}
      {jobs.length === 0 ? (
        <div className="flex justify-center mt-12">
          <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
            <Briefcase className="w-12 h-12 text-purple-500 mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-gray-800">
              No Jobs Posted Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first job posting to start receiving applications.
            </p>

            <Button
              onClick={() => navigate("/create-job")}
              className="mt-5 bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <Card
              key={job._id}
              onClick={() => navigate(`/job/${job._id}`)}
              className="cursor-pointer bg-white border-0 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <h2 className="text-lg font-bold text-black">{job.title}</h2>

                <p className="font-medium text-gray-600">{job.company}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>

                <div className="flex items-center gap-2 text-green-600">
                  ₹
                  {job.salary
                    ? `${job.salary.toLocaleString("en-IN")} P.A.`
                    : "Not disclosed"}
                </div>

                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <Briefcase className="w-4 h-4" />
                  {job.jobType.replace(/\b\w/g, (char) => char.toUpperCase())}
                </div>

                <div className="text-xs text-gray-500">
                  {getPostedTime(job.createdAt)}
                </div>

                <div className="text-sm font-medium">
                  {getDeadlineText(job.deadline) === "Expired" ? (
                    <span className="text-red-600">Expired</span>
                  ) : (
                    <span className="text-orange-600">
                      {getDeadlineText(job.deadline)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-purple-600 hover:underline">
                    View Details
                  </span>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogOverlay className="bg-black/40 backdrop-blur-sm" />

                    <AlertDialogContent className="rounded-2xl bg-white border border-gray-200 shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Job Post?</AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone. The job post will be
                          permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => handleDelete(job._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
