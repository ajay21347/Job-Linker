import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/utils/api";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AnalysisDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/ai/history/${id}`);

        setAnalysis(res.data);
      } catch (error) {
        toast.error("Failed to load analysis details");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading && !analysis) {
    return <div className="p-10 text-center">Loading Analysis...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold">Resume Analysis</h1>

          <div className="mt-4 flex gap-3">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
              ATS Score : {analysis.atsScore}
            </span>

            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
              {analysis.type === "job-match"
                ? "Job Match Analysis"
                : "Resume Analysis"}
            </span>
          </div>

          {analysis.type === "job-match" && analysis.job && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <p className="text-sm font-medium text-blue-600">
                Matched Against Job
              </p>

              <h2 className="text-xl font-bold text-gray-800 mt-1">
                {analysis.job.title}
              </h2>

              {analysis.job.company && (
                <p className="text-gray-500 mt-1">{analysis.job.company}</p>
              )}
            </div>
          )}

          {analysis.resumeUrl && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Resume Used
                </h2>

                <a
                  href={analysis.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white"
                  onClick={() => toast.success("Resume downloaded ")}
                >
                  Download Resume
                </a>
              </div>
              <div className="overflow-hidden rounded-2xl border shadow">
                <iframe
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                    analysis.resumeUrl,
                  )}`}
                  title="Resume Preview"
                  className="w-full h-[800px]"
                />
              </div>
            </div>
          )}

          <div className="mt-8 whitespace-pre-wrap leading-8">
            {analysis.analysis}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetails;
