import { Download, Clock, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InterviewHistoryCard = ({ interview, onDownload }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/history/interview/${interview._id}`)}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Icon + Status */}

        <div className="flex items-center justify-between">
          <MessageSquare className="w-6 h-6 text-cyan-500" />

          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Completed
          </span>
        </div>

        {/* Job */}

        <h2 className="text-lg font-bold text-black">
          {interview.job?.title || "Mock Interview"}
        </h2>

        <p className="font-medium text-gray-600 text-sm">
          {interview.job?.company || "AI Interview"}
        </p>

        {/* Duration */}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {interview.duration || 0} mins
        </div>

        {/* Date */}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {new Date(interview.createdAt).toLocaleDateString()}
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-purple-500 hover:underline">
            View Details
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();

              onDownload(interview);
            }}
            className="p-2 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Download className="w-4 h-4 text-purple-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewHistoryCard;
