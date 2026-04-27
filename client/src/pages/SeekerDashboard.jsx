import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import { Briefcase, Clipboard, IndianRupee, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await api.get("/jobs");
      setJobs(res.data.jobs);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    `${jobs.title} ${job.company} ${job.location} ${job.jobType}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search jobs..."
          className="h-12 shadow"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Job Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card
            key={job._id}
            onClick={() => navigate(`/job/${job._id}`)}
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <CardContent className="p-5 flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="2-4 h-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-green-500">
                <IndianRupee className="2-4 h-4" />
                {job.salary || "Not disclosed"}
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-500">
                <Briefcase className="2-4 h-4" />
                {job.jobType}
              </div>
              <span className="text-purple-600 text-sm mt-2 hover:underline">
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
