import { CheckCircle2, FileText, X } from "lucide-react";

const InterviewComplete = ({ downloadTranscript, viewTranscript }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020617] via-[#071330] to-[#0a1735] flex items-center justify-center px-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-12 text-center max-w-2xl w-full">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-white mb-4">Thank You</h1>

        <p className="text-xl text-slate-300 mb-2">
          Interview Completed Successfully
        </p>

        <p className="text-slate-400 mb-10">
          You can now close this tab or review your interview transcript.
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={downloadTranscript}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all"
          >
            <FileText size={18} />
            Download Transcript
          </button>

          <button
            onClick={viewTranscript}
            className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"
          >
            <FileText size={18} />
            View Transcript
          </button>

          <button
            onClick={() => window.close()}
            className="px-6 py-3 rounded-2xl bg-red-500 text-white font-semibold flex items-center gap-2 hover:bg-red-600 transition-all"
          >
            <X size={18} />
            Close Tab
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewComplete;
