import { Calendar, Award, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnalysisHistoryCard = ({ analysis }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/history/analysis/${analysis._id}`)}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Top */}
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

        {/* Analysis Type */}
        <h2 className="text-lg font-bold text-black">
          {analysis.type === "job-match"
            ? "Job Match Analysis"
            : "Resume Analysis"}
        </h2>

        {/* Job Info */}
        {analysis.type === "job-match" && analysis.job ? (
          <>
            <p className="font-medium text-gray-700">{analysis.job.title}</p>

            <p className="text-sm text-gray-500">{analysis.job.company}</p>
          </>
        ) : (
          <p className="font-medium text-gray-600 text-sm">
            AI-powered ATS evaluation
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {new Date(analysis.createdAt).toLocaleDateString()}
        </div>

        {/* Analysis Category */}
        <div className="flex items-center gap-2 text-sm text-purple-500">
          <Briefcase className="w-4 h-4" />
          {analysis.type === "job-match"
            ? "Job Specific Analysis"
            : "General Resume Review"}
        </div>

        <span className="text-sm mt-2 font-medium text-purple-500 hover:underline">
          View Details
        </span>
      </div>
    </div>
  );
};

export default AnalysisHistoryCard;
