import { useEffect, useState } from "react";
import api from "@/utils/api";
import InterviewHistoryCard from "./InterviewHistoryCard";
import { toast } from "sonner";

const InterviewHistoryTab = () => {
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("latest");

  const sortedInterviews = [...interviews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortBy === "alphabetical") {
      return (a.job?.title || "").localeCompare(b.job?.title || "");
    }

    return 0;
  });

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        setLoading(true);

        const res = await api.get("/interview/history");

        setInterviews(res.data || []);
      } catch (error) {
        toast.error("Failed to load interview history");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewHistory();
  }, []);

  const downloadTranscript = (interview) => {
    const content = interview.transcript
      ?.map((msg) => `${msg.role.toUpperCase()}:\n${msg.content}\n`)
      .join("\n");

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${interview.job?.title || "Interview"}.txt`;

    link.click();
    toast.success("Transcript downloaded");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-md border">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading Interview History...
        </h2>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700">
          No Interviews Found
        </h2>

        <p className="text-gray-500 mt-2">
          Complete your first AI Mock Interview to see history here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Interview History</h2>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm outline-none"
        >
          <option value="latest">Latest </option>
          <option value="oldest">Oldest </option>
          <option value="alphabetical">A→Z </option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedInterviews.map((interview) => (
          <InterviewHistoryCard
            key={interview._id}
            interview={interview}
            onDownload={downloadTranscript}
          />
        ))}
      </div>
    </>
  );
};

export default InterviewHistoryTab;
