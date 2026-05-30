import { Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnalysisHistoryCard = ({ analysis }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/history/analysis/${analysis._id}`)}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Award className="w-6 h-6 text-purple-500" />

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              analysis.atsScore >= 80
                ? "bg-green-100 text-green-700"
                : analysis.atsScore >= 60
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            ATS {analysis.atsScore}
          </span>
        </div>

        <h2 className="text-lg font-bold text-black">Resume Analysis</h2>

        <p className="font-medium text-gray-600 text-sm">
          AI-powered ATS evaluation
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {new Date(analysis.createdAt).toLocaleDateString()}
        </div>

        <span className="text-sm mt-2 font-medium text-purple-500 hover:underline">
          View Details
        </span>
      </div>
    </div>
  );
};

export default AnalysisHistoryCard;
