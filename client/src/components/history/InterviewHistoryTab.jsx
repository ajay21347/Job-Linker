import { useEffect, useState } from "react";
import api from "@/utils/api";
import InterviewHistoryCard from "./InterviewHistoryCard";

const InterviewHistoryTab = () => {
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        const res = await api.get("/interview/history");

        console.log("Interview History:", res.data);

        setInterviews(res.data || []);
      } catch (error) {
        console.log(error);
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
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading Interview History...
        </h2>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">
          No Interviews Found
        </h2>

        <p className="text-gray-500 mt-2">
          Complete your first AI Mock Interview to see history here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {interviews.map((interview) => (
        <InterviewHistoryCard
          key={interview._id}
          interview={interview}
          onDownload={downloadTranscript}
        />
      ))}
      return (
      <div>
        <h1>Total Interviews: {interviews.length}</h1>

        {interviews.map((interview) => (
          <div key={interview._id}>{interview.job?.title}</div>
        ))}
      </div>
      );
    </div>
  );
};

export default InterviewHistoryTab;
