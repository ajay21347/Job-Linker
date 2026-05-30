import { Mic, MicOff, Moon, PhoneOff, Sun } from "lucide-react";

const InterviewHeader = ({
  interviewId,
  interviewName,
  jobRole,
  timer,
  micEnabled,
  setMicEnabled,
  darkMode,
  setDarkMode,
  onExit,
  currentQuestionIndex,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={`h-24 border-b flex items-center justify-between px-8 shadow-md transition-all duration-500 ${
        darkMode
          ? "bg-slate-900 border-slate-700"
          : "bg-gradient-to-r from-[#dbeafe] via-[#eef2ff] to-[#e0f2fe] border-blue-200 backdrop-blur-xl"
      }`}
    >
      {/* LEFT */}

      <div className="flex flex-col">
        <h2
          className={`font-bold text-3xl tracking-tight ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {interviewName}
        </h2>

        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {jobRole} Mock Interview
        </p>

        <p className="text-xs text-purple-500 mt-1">ID: {interviewId}</p>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">
        {/* QUESTION COUNT */}

        <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-2xl font-semibold shadow-md">
          Question {currentQuestionIndex + 1} / 5
        </div>

        {/* TIMER */}

        <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-2xl font-semibold shadow-md">
          ⏱ {formatTime(timer)}
        </div>

        {/* THEME BUTTON */}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-12 rounded-2xl shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            darkMode ? "bg-slate-800" : "bg-white"
          }`}
        >
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-purple-600" />
          )}
        </button>

        {/* MIC BUTTON */}

        <button
          onClick={() => {
            if (micEnabled) {
              speechSynthesis.cancel();
            }
            setMicEnabled(!micEnabled);
          }}
          className={`w-12 h-12 rounded-2xl shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            darkMode ? "bg-slate-800" : "bg-white"
          }`}
        >
          {micEnabled ? (
            <Mic className="text-purple-500" />
          ) : (
            <MicOff className="text-red-500" />
          )}
        </button>

        {/* EXIT BUTTON */}

        <button
          onClick={onExit}
          className="w-12 h-12 rounded-2xl bg-red-500 text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-red-600"
        >
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default InterviewHeader;
