import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InterviewInput = ({
  currentAnswer,
  setCurrentAnswer,
  handleSubmit,
  interviewCompleted,
  messages,
  interviewId,
  loading,
  darkMode,
}) => {
  const navigate = useNavigate();

  const downloadInterview = () => {
    const content = messages
      .map((msg) => `${msg.role.toUpperCase()}:\n${msg.content}\n`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${interviewId}.txt`;

    link.click();
  };

  if (interviewCompleted) {
    return (
      <div className="p-6 flex justify-center gap-5 border-t border-purple-200 bg-white/80">
        <button
          onClick={downloadInterview}
          className="px-6 py-3 rounded-2xl bg-purple-600 text-white flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }
  return (
    <div
      className={`p-5 border-t flex gap-4 transition-all duration-500 ${
        darkMode
          ? "bg-slate-900 border-slate-700"
          : "border-purple-200 bg-white/80 backdrop-blur-md "
      }`}
    >
      <textarea
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        className={`flex-1 rounded-2xl p-4 outline-none resize-none h-24 transition-all duration-500 ${
          darkMode
            ? "bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400"
            : "border border-purple-200 bg-white text-black"
        }`}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-semibold shadow-lg"
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
};

export default InterviewInput;
