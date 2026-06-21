import { Play } from "lucide-react";

const InterviewStartScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020617] via-[#071330] to-[#0a1735] flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-12 text-center max-w-lg w-full">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
          <Play size={32} className="text-white ml-1" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-3">
          Start Mock Interview
        </h1>

        <p className="text-slate-300 mb-2">AI Powered Mock Interview Session</p>

        <p className="text-purple-400 font-medium mb-8">Duration: 15 Minutes</p>

        <button
          onClick={onStart}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold flex items-center gap-3 mx-auto hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <Play size={20} />
          Start Interview
        </button>

        <p className="text-xs text-slate-400 mt-6">
          Make sure your microphone and camera are enabled before starting
        </p>
      </div>
    </div>
  );
};

export default InterviewStartScreen;
