import InterviewChat from "@/components/interview/InterviewChat";
import InterviewHeader from "@/components/interview/InterviewHeader";
import InterviewInput from "@/components/interview/InterviewInput";
import useInterviewRecording from "@/hooks/useInterviewRecording";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import InterviewComplete from "@/components/interview/InterviewComplete";
import InterviewCamera from "@/components/interview/InterviewCamera";
import InterviewStartScreen from "@/components/interview/InterviewStartScreen";

import ExitInterviewDialog from "@/components/interview/ExitInterviewDialog";

const MockInterview = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);

  const [currentAnswer, setCurrentAnswer] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [questionSet, setQuestionSet] = useState([]);

  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const [micEnabled, setMicEnabled] = useState(true);

  const [timer, setTimer] = useState(0);

  const [interviewId] = useState(`INT-${Date.now()}`);

  const [interviewName] = useState("AI Mock Interview");

  const [jobRole, setJobRole] = useState("");

  const { jobId } = useParams();

  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(true);

  const [aiSpeaking, setAiSpeaking] = useState(false);

  const [showExitDialog, setShowExitDialog] = useState(false);

  const [dbInterviewId, setDbInterviewId] = useState(null);

  const [allQuestions, setAllQuestions] = useState([]);

  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  const {
    videoRef,

    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useInterviewRecording();

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  useEffect(() => {
    if (!voiceEnabled) {
      speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const [interviewStarted, setInterviewStarted] = useState(false);

  const [paused, setPaused] = useState(false);

  const [cameraEnabled, setCameraEnabled] = useState(false);

  const [interviewEnded, setInterviewEnded] = useState(false);

  const downloadTranscript = () => {
    const content = messages
      .map((msg) => `${msg.role.toUpperCase()}\n${msg.content}\n`)
      .join("\n");

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${interviewId}.txt`;
    a.click();
  };

  //Speak Question
  const speakQuestion = (text) => {
    if (!voiceEnabled || paused) return;

    speechSynthesis.cancel();

    setAiSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => {
      setAiSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const startInterviewHandler = async () => {
    try {
      setInterviewStarted(true);

      await startRecording();

      const res = await api.post("/interview/start", {
        jobId,
      });

      setDbInterviewId(res.data.interviewId);

      setQuestionSet(res.data.questions);

      setAllQuestions(res.data.questions);

      const introMessage = {
        role: "assistant",
        content: `
Hello ${user?.name?.split(" ")[0] || ""}

I am your AI Interviewer today.

This is a mock interview for the role of ${res.data.jobTitle}.

Let's begin.
`,
      };

      setMessages([introMessage]);

      setTimeout(() => {
        const firstQuestion = {
          role: "assistant",
          content: res.data.questions[0],
        };

        setMessages((prev) => [...prev, firstQuestion]);
      }, 5000);

      setJobRole(res.data.jobTitle);
    } catch {
      toast.error("Failed to start interview");
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      voiceEnabled &&
      !paused
    ) {
      speakQuestion(lastMessage.content);
    }
  }, [messages]);

  // Timer
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [paused]);

  const handlePause = () => {
    if (!paused) {
      speechSynthesis.pause();

      pauseRecording();

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: " ⏸Interview Paused",
        },
      ]);
    } else {
      speechSynthesis.resume();

      resumeRecording();

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "▶  Interview Resumed",
        },
      ]);
    }

    setPaused(!paused);
  };

  const handleExitInterview = async () => {
    speechSynthesis.cancel();

    stopRecording();

    await saveInterview(messages, true);

    setInterviewEnded(true);
  };

  //Save Interview
  const saveInterview = async (
    transcriptData = messages,
    showToast = false,
  ) => {
    if (!dbInterviewId) return;

    try {
      await api.post("/interview/complete", {
        interviewId: dbInterviewId,
        transcript: transcriptData,
        duration: Math.floor(timer / 60),
      });
      if (showToast) {
        toast.success("Interview saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save interview");
    }
  };

  // Submit Answer
  const handleSubmit = async () => {
    if (paused) {
      toast.warning("Interview is paused");
      return;
    }

    if (!currentAnswer.trim()) {
      toast.warning("Please enter an answer");
      return;
    }

    try {
      setLoading(true);

      const answer = currentAnswer;

      const userMessage = {
        role: "user",
        content: answer,
      };

      setMessages((prev) => [...prev, userMessage]);

      setCurrentAnswer("");

      const currentQuestion = questionSet[currentQuestionIndex];

      const res = await api.post("/interview/feedback", {
        question: currentQuestion,
        answer,
      });

      const feedback = res.data.feedback;

      const isLastQuestion = currentQuestionIndex >= questionSet.length - 1;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "feedback",
            content: `Feedback:\n${feedback}`,
          },
        ]);
      }, 700);

      // LAST QUESTION
      if (isLastQuestion) {
        setTimeout(() => {
          setShowContinuePrompt(true);
        }, 2500);

        return;
      }

      // NEXT QUESTION
      const nextIndex = currentQuestionIndex + 1;

      setTimeout(() => {
        const nextQuestion = questionSet[nextIndex];

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: nextQuestion,
          },
        ]);

        setCurrentQuestionIndex(nextIndex);
      }, 7000);
    } catch (error) {
      toast.error("Failed to generate  feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      const res = await api.post("/interview/start", {
        jobId,
        previousQuestions: allQuestions,
      });

      setCurrentQuestionIndex(0);

      setQuestionSet(res.data.questions);

      setAllQuestions((prev) => [...prev, ...res.data.questions]);

      setShowContinuePrompt(false);

      toast.success("New interview questions generated");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Great! Let's continue with another set of questions.",
        },
        { role: "assistant", content: res.data.questions[0] },
      ]);
    } catch (error) {
      toast.error("Failed to generate more questions");
    }
  };

  const viewTranscript = () => {
    const transcriptWindow = window.open("", "_blank");

    transcriptWindow.document.write(`
    <html>
      <head>
        <title>Interview Transcript</title>
        <style>
          body{
            font-family:Arial,sans-serif;
            padding:40px;
            background:#f8fafc;
          }
          .message{
            margin-bottom:20px;
            padding:15px;
            border-radius:10px;
            background:white;
          }
        </style>
      </head>
      <body>
        <h1>Interview Transcript</h1>

        ${messages
          .map(
            (msg) => `
              <div class="message">
                <strong>${msg.role}</strong>
                <p>${msg.content}</p>
              </div>
            `,
          )
          .join("")}
      </body>
    </html>
  `);
  };

  const handleFinish = async () => {
    speechSynthesis.cancel();
    setShowContinuePrompt(false);

    toast.success("Interview Completed");

    setMessages((prev) => {
      const updated = [
        ...prev,
        {
          role: "assistant",
          content: "Mock Interview Completed. Thank you for participating.",
        },
      ];
      saveInterview(updated);
      return updated;
    });
    stopRecording();

    setInterviewEnded(true);
  };

  useEffect(() => {
    if (timer >= 900) {
      handleExitInterview();
    }
  }, [timer]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      speechSynthesis.cancel();
      stopRecording();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  if (!interviewStarted) {
    return <InterviewStartScreen onStart={startInterviewHandler} />;
  }

  if (interviewEnded) {
    return (
      <>
        <InterviewComplete
          downloadTranscript={downloadTranscript}
          viewTranscript={viewTranscript}
        />
      </>
    );
  }

  return (
    <>
      <ExitInterviewDialog
        open={showExitDialog}
        onCancel={() => setShowExitDialog(false)}
        onConfirm={handleExitInterview}
      />

      <div
        className={`h-screen flex flex-col  transition-all duration-500 ${darkMode ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]" : "bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100"}`}
      >
        <InterviewHeader
          interviewId={interviewId}
          interviewName={interviewName}
          jobRole={jobRole}
          timer={timer}
          micEnabled={micEnabled}
          setMicEnabled={setMicEnabled}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          paused={paused}
          setPaused={handlePause}
          cameraEnabled={cameraEnabled}
          setCameraEnabled={setCameraEnabled}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onExit={() => {
            toast.warning("Leaving will save current progress");
            setShowExitDialog(true);
          }}
          currentQuestionIndex={currentQuestionIndex}
        />

        {aiSpeaking && (
          <div className="flex items-center gap-3 px-6 py-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <span className="text-purple-400 font-medium text-sm">
              AI Speaking...
            </span>
          </div>
        )}

        {cameraEnabled && (
          <div className="fixed bottom-6 right-6 z-50">
            <InterviewCamera videoRef={videoRef} />
          </div>
        )}

        <InterviewChat messages={messages} />
        {showContinuePrompt && (
          <div className="flex justify-center gap-4 py-6">
            <button
              onClick={handleContinue}
              className="px-6 py-3 rounded-2xl bg-green-500 text-white font-semibold"
            >
              Continue Interview
            </button>

            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-2xl bg-red-500 text-white font-semibold"
            >
              Finish Interview
            </button>
          </div>
        )}
        <InterviewInput
          currentAnswer={currentAnswer}
          setCurrentAnswer={setCurrentAnswer}
          handleSubmit={handleSubmit}
          interviewCompleted={interviewCompleted}
          messages={messages}
          interviewId={interviewId}
          loading={loading}
          darkMode={darkMode}
        />
      </div>
    </>
  );
};

export default MockInterview;
