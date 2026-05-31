import { useEffect, useState } from "react";
import api from "@/utils/api";
import AnalysisHistoryCard from "./AnalysisHistoryCard";
import { toast } from "sonner";

const AnalysisHistoryTab = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchAnalysisHistory = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/ai/history?sort=${sortBy}`);

        setAnalyses(res.data.history || []);
      } catch (error) {
        toast.error("Failed to load analysis history");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisHistory();
  }, [sortBy]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700">
          Loading Analysis History...
        </h2>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700">
          No Analysis History Found
        </h2>

        <p className="text-gray-500 mt-2">
          Run your first AI Resume Analysis to see history here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Analysis History</h2>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm outline-none"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">A → Z</option>
        </select>
      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {analyses.map((analysis) => (
          <AnalysisHistoryCard key={analysis._id} analysis={analysis} />
        ))}
      </div>
    </>
  );
};

export default AnalysisHistoryTab;
