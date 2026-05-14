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
const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

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
        console.log(error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Job Posts</h1>

        <Button
          onClick={() => navigate("/create-job")}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          Post Job
        </Button>
      </div>

      {/* Job Grid */}
      {jobs.length === 0 ? (
        <div
          className="text-center text-gray-500 mt-10
      "
        >
          No jobs posted yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card
              key={job._id}
              className="hover:shadow-xl transition-all duration-300 "
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-purple-600 w-5 h-5 " />
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                </div>
                <p className="text-gray-600">{job.company}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-sm text-green-600">
                    ₹
                    {job.salary ? `${job.salary.toLocaleString()} P.A.` : "N/A"}
                  </span>
                  <span className="text-sm text-purple-600">
                    {job.jobType.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
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

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="hover:underline  underline-offset-4 hover:text-blue-600
                    transition-all duration-200"
                  >
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="hover:underline underline-offset-4 hover:text-red-500 transition-all duration-200"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogOverlay className="bg-black/40 backdrop-blur-sm" />

                    <AlertDialogContent className="rounded-2xl bg-white border border-gray-200 shadow-2xl backdrop-blur-none">
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
