import { useState } from "react";
import { Brain, History } from "lucide-react";
import AnalysisHistoryTab from "@/components/history/AnalysisHistoryTab";
import InterviewHistoryTab from "@/components/history/InterviewHistoryTab";

const HistoryCenter = () => {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100">
      {/* HEADER */}

      <div className="bg-white/70 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <History className="text-white w-7 h-7" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                History Center
              </h1>

              <p className="text-gray-500 mt-1">
                Access all your AI activities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}

      <div className="max-w-7xl mx-auto px-8 pt-8">
        <div className="bg-white rounded-3xl p-2 shadow-lg inline-flex gap-2">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "analysis"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Analysis History
          </button>

          <button
            onClick={() => setActiveTab("interview")}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "interview"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Interview History
          </button>
        </div>

        {/* CONTENT */}

        <div className="mt-8">
          {activeTab === "analysis" ? (
            <AnalysisHistoryTab />
          ) : (
            <InterviewHistoryTab />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCenter;
