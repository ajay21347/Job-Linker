import {
  Camera,
  Mic,
  MicOff,
  Moon,
  Pause,
  Play,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";

const InterviewHeader = ({
  interviewId,
  interviewName,
  jobRole,
  timer,
  micEnabled,
  setMicEnabled,
  voiceEnabled,
  setVoiceEnabled,
  paused,
  setPaused,
  cameraEnabled,
  setCameraEnabled,
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
      <div className="flex items-center gap-3">
        {/* Question Count */}
        <div className="bg-purple-500/20 text-purple-500 px-4 py-2 rounded-xl font-semibold">
          Question {currentQuestionIndex + 1} / 5
        </div>

        {/* Timer */}
        <div className="bg-purple-500/20 text-purple-500 px-4 py-2 rounded-xl font-semibold">
          ⏱ {formatTime(timer)}
        </div>

        {/* Theme */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl shadow  hover:scale-110${
            darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* AI Voice */}
        <button
          title={voiceEnabled ? "AI Voice  On" : "AI Voice Off"}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`px-4 py-2 rounded-xl shadow justify-center  transition-all duration-300 hover:scale-110  ${
            voiceEnabled
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Mic */}
        <button
          title={micEnabled ? "Mic On" : "Mic Off"}
          onClick={() => setMicEnabled(!micEnabled)}
          className={`px-4 py-2 rounded-xl shadow justify-center  transition-all duration-300 hover:scale-110  ${
            micEnabled ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        {/* Camera */}
        <button
          title={cameraEnabled ? "Hide Camera" : "Show Camera"}
          onClick={() => setCameraEnabled(!cameraEnabled)}
          className={`px-4 py-2 rounded-xl text-white shadow  justify-center  transition-all duration-300 hover:scale-110  ${
            cameraEnabled ? "bg-blue-500" : "bg-gray-500"
          }`}
        >
          <Camera size={20} />
        </button>

        {/* Pause / Resume */}
        <button
          title={paused ? "Resume" : "Pause"}
          onClick={() => setPaused(!paused)}
          className={`px-4 py-2 rounded-xl text-white justify-center shadow transition-all duration-300 hover:scale-110 ${
            paused
              ? "bg-green-500 hover:bg-green-600"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {paused ? <Play size={20} /> : <Pause size={20} />}
        </button>

        {/* Exit */}
        <button
          title="Exit Interview"
          onClick={onExit}
          className="px-4 py-2 rounded-xl bg-red-500 text-white shadow-md flex items-center justify-center transition-all duration-300   hover:scale-110"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default InterviewHeader;
