import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await api.get("/jobs");
      const found = res.data.jobs.find((j) => j._id === id);
      setJob(found);
    };
    fetchJobs();
  }, [id]);

  if (!job) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className=" text-gray-500 mb-2">{job.location}</p>
      <p className="mb-4">{job.description}</p>
      <Button className="mt-3 bg-purple-600 text-white px-4 py-1 rounded-none hover:bg-purple-700">
        Apply
      </Button>{" "}
    </div>
  );
};

export default JobDetails;
