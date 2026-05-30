import { useEffect, useState } from "react";
import api from "@/utils/api";
import AnalysisHistoryCard from "./AnalysisHistoryCard";

const AnalysisHistoryTab = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisHistory = async () => {
      try {
        const res = await api.get("/ai/history");

        setAnalyses(res.data.history || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisHistory();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading analysis history...</div>;
  }

  if (analyses.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">
          No Analysis History Found
        </h2>

        <p className="text-gray-500 mt-2">
          Run your first AI resume analysis to see history here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {analyses.map((analysis) => (
        <AnalysisHistoryCard key={analysis._id} analysis={analysis} />
      ))}
    </div>
  );
};

export default AnalysisHistoryTab;
