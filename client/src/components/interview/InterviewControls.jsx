import { Mic, MicOff, Pause, PhoneOff, Play } from "lucide-react";
import React from "react";

const InterviewControls = ({
  micEnabled,
  setMicEnabled,
  paused,
  setPaused,
  onExit,
}) => {
  return (
    <div className=" flex gap-3">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">
        AI Voice
      </button>

      <button
        onClick={setMicEnabled(!micEnabled)}
        className="px-4 py-2 bg-white rounded-2xl"
      >
        {micEnabled ? <Mic /> : <MicOff />}
      </button>

      <button
        onClick={() => setPaused(!paused)}
        className={`px-4 py-2 rounded-xl text-white ${paused ? "bg-green-500" : "bg-yellow-500"}`}
      >
        {paused ? (
          <>
            <Play size={16} />
            Resume
          </>
        ) : (
          <>
            <Pause size={16} />
            Pause
          </>
        )}
      </button>

      <button
        onClick={onExit}
        className="px-4 py-2 bg-red-500
       text-white rounded-xl"
      >
        <PhoneOff />
      </button>
    </div>
  );
};

export default InterviewControls;
