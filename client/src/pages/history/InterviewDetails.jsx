import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

const InterviewDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interview/${id}`);

        setInterview(res.data);
      } catch (error) {
        toast.error("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const downloadTranscript = () => {
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
    return <div className="p-10 text-center">Loading Interview...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={downloadTranscript}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-xl"
          >
            <Download size={18} />
            Download
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold">{interview.job?.title}</h1>

          <p className="text-gray-500 mt-2">{interview.job?.company}</p>

          <div className="mt-8 space-y-5">
            {interview.transcript?.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-purple-500 text-white ml-auto max-w-[80%]"
                    : "bg-gray-100 max-w-[80%]"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
