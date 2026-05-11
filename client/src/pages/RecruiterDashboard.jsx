import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { Briefcase, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  const confirmDelete = (id) => {
    toast.dismiss();

    toast.error("Are you sure to delete this job post?", {
      description: "This action cannot be undone.",
      duration: 10000,
      action: {
        label: "Delete",
        onClick: () => handleDelete(id),
        className: "bg-red-600 text-white hover:bg-red:700",
      },
    });
  };

  const handleDelete = async (id) => {
    console.log("DELETE CLICKED", id);
    try {
      await api.delete(`/jobs/delete/${id}`);
      toast.success("Job deleted");

      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting job");
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
          PostJob
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
                    ₹{job.salary || "N/A"}
                  </span>
                  <span className="text-sm text-purple-600">{job.jobType}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="hover:underline"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => confirmDelete(job._id)}
                    className="hover:underline"
                  >
                    Delete
                  </Button>
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
