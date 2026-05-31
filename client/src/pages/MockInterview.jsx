import InterviewChat from "@/components/interview/InterviewChat";
import InterviewHeader from "@/components/interview/InterviewHeader";
import InterviewInput from "@/components/interview/InterviewInput";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MockInterview = () => {
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

  const navigate = useNavigate();

  //Speak Question
  const speakQuestion = (text) => {
    if (!micEnabled) return;

    speechSynthesis.cancel();

    setAiSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => {
      setAiSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  // Start Interview
  useEffect(() => {
    const startInterview = async () => {
      try {
        const res = await api.post("/interview/start", { jobId });

        setDbInterviewId(res.data.interviewId);

        setQuestionSet(res.data.questions);
        setAllQuestions(res.data.questions);

        const introMessage = {
          role: "assistant",

          content: `
        
        Hello 👋

        I am your AI Interviewer today.

        This is a mock interview for the role of ${res.data.jobTitle}.

        I will ask technical, HR and project-based questions.

        Please answer confidently.

        Let's begin.`,
        };
        setMessages([introMessage]);

        speakQuestion(introMessage.content);

        setTimeout(() => {
          const firstQuestion = {
            role: "assistant",
            content: res.data.questions[0],
          };
          setMessages((prev) => [...prev, firstQuestion]);

          speakQuestion(res.data.questions[0]);
        }, 5000);

        setDbInterviewId(res.data.interviewId);
        setJobRole(res.data.jobTitle);
      } catch (error) {
        toast.error("Failed to start interview");
      }
    };
    startInterview();
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

        speakQuestion(nextQuestion);

        setCurrentQuestionIndex(nextIndex);
      }, 3000);
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
      speakQuestion(res.data.questions[0]);
    } catch (error) {
      toast.error("Failed to generate more questions");
    }
  };

  const handleFinish = async () => {
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
    setInterviewCompleted(true);
  };

  return (
    <>
      {showExitDialog && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div
            className={`w-[400px] rounded-3xl p-8 shadow-2xl ${darkMode ? "bg-slate-900 text-white" : "bg-white text-black"}`}
          >
            <h2 className="text-2xl font-bold mb-3">Exit Interview</h2>
            <p className="text-gray-400 mb-6">
              Your current interview progress may be lost.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowExitDialog(false)}
                className="px-5 py-2 rounded-xl border"
              >
                No
              </button>{" "}
              <button
                onClick={async () => {
                  speechSynthesis.cancel();
                  await saveInterview(messages, true);
                  navigate(-1);
                }}
                className="px-5 py-2 rounded-xl bg-red-500 text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
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
