import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/utils/api";
import { ArrowLeft } from "lucide-react";

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
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
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

          <div className="mt-5">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
              ATS Score : {analysis.atsScore}
            </span>
          </div>

          <div className="mt-8 whitespace-pre-wrap leading-8">
            {analysis.analysis}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetails;
