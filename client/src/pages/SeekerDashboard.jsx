import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import { Briefcase, IndianRupee, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDeadlineText, getPostedTime } from "@/utils/jobUtils";
import { useAiAssistant } from "@/context/AiAssistantContext";
import { toast } from "sonner";

const SeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();
  const { open } = useAiAssistant();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");

        setJobs(res.data.jobs);
        const applied = [];
        for (const job of res.data.jobs) {
          try {
            const check = await api.get(`/application/check/${job._id}`);
            if (check.data.applied) {
              applied.push(job._id);
            }
          } catch (error) {
            console.log(error);
          }
        }
        setAppliedJobs(applied);
      } catch (error) {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
  if (jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <Briefcase className="w-12 h-12 text-purple-500 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-gray-800">
            No Jobs Available
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no job postings available.
          </p>
        </div>
      </div>
    );
  }

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.location} ${job.jobType}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8 transition-all duration-300 ${open ? "mr-[-120px]" : "mr-0"}`}
    >
      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search jobs, companies..."
            className="h-12 pl-12 rounded-2xl border-0 bg-white shadow-lg focus-visible:ring-2 focus-visible:ring-purple-400"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {filteredJobs.map((job) => (
          <Card
            key={job._id}
            onClick={() => navigate(`/job/${job._id}`)}
            className={`cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 ${appliedJobs.includes(job._id) ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg" : "bg-white"}`}
          >
            <CardContent className="p-5 flex flex-col gap-3">
              <h2
                className={`text-lg font-bold ${appliedJobs.includes(job._id) ? "text-white" : "text-black"}`}
              >
                {job.title}
              </h2>
              <p
                className={`font-medium ${appliedJobs.includes(job._id) ? "text-green-100" : "text-gray-600"}`}
              >
                {job.company}
              </p>
              <div
                className={`flex items-center gap-2 text-sm ${
                  appliedJobs.includes(job._id)
                    ? "text-green-100"
                    : "text-gray-500"
                }`}
              >
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <div
                className={`flex items-center gap-2 ${
                  appliedJobs.includes(job._id)
                    ? "text-white"
                    : "text-green-500"
                }`}
              >
                <IndianRupee className="w-4 h-4" />
                {job.salary
                  ? `${job.salary.toLocaleString("en-IN")} P.A.`
                  : "Not disclosed"}
              </div>
              <div
                className={`flex items-center gap-2 text-sm ${
                  appliedJobs.includes(job._id)
                    ? "text-green-50"
                    : "text-purple-500"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                {job.jobType.replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>
              <div
                className={`text-xs ${
                  appliedJobs.includes(job._id)
                    ? "text-green-100"
                    : "text-gray-500"
                }`}
              >
                {getPostedTime(job.createdAt)}
              </div>
              <div className="text-sm font-medium">
                {getDeadlineText(job.deadline) === "Expired" ? (
                  <span
                    className={
                      appliedJobs.includes(job._id)
                        ? "text-red-200"
                        : "text-red-600"
                    }
                  >
                    Expired
                  </span>
                ) : (
                  <span
                    className={
                      appliedJobs.includes(job._id)
                        ? "text-yellow-200"
                        : "text-orange-600"
                    }
                  >
                    {getDeadlineText(job.deadline)}
                  </span>
                )}
              </div>
              <span
                className={` text-sm mt-2 font-medium hover:underline ${
                  appliedJobs.includes(job._id)
                    ? "text-white"
                    : "text-purple-500"
                }`}
              >
                View Details
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeekerDashboard;
