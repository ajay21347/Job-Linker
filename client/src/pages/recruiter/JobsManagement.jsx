import { useEffect, useState } from "react";
import api from "@/utils/api";

import RecruiterHeader from "@/components/recruiter/RecruiterHeader";
import SearchFilter from "@/components/recruiter/SearchFilter";
import JobCard from "@/components/recruiter/JobCard";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await api.get("/recruiter/jobs");

      setJobs(res.data.jobs);
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (jobId) => {
    try {
      await api.delete(`/jobs/delete/${jobId}`);

      setJobs((prev) => prev.filter((job) => job._id !== jobId));

      toast.success("job deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete job");
    }
  };

  return (
    <>
      <RecruiterHeader title="Jobs Management" />

      <SearchFilter
        value={search}
        onChange={setSearch}
        placeholder="Search jobs..."
      />

      <div className="grid md:grid-cols-4 gap-6 mt-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onEdit={() => navigate(`/recruiter-dashboard/edit-job/${job._id}`)}
            onApplicants={() => navigate(`/applicants/${job._id}`)}
            onDelete={() => handleDelete(job._id)}
          />
        ))}
      </div>
    </>
  );
};

export default JobsManagement;
