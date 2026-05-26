import { Brain, Briefcase, Sparkles, Target } from "lucide-react";

import api from "@/utils/api";

import { useAiAssistant } from "@/context/AiAssistantContext";

const actions = [
  {
    title: "Resume Analysis",
    icon: Brain,
    endpoint: "/ai/analyze-resume",
  },

  {
    title: "Job Match",
    icon: Target,
    endpoint: "/ai/analyze-job-match",
  },

  {
    title: "Interview Questions",
    icon: Briefcase,
    endpoint: "/ai/interview-questions",
  },

  {
    title: "Career Suggestions",
    icon: Sparkles,
    endpoint: "/ai/career-suggestions",
  },
];

const AiQuickActions = () => {
  const { setMessages, setLoading, currentJob } = useAiAssistant();

  const handleAction = async (action) => {
    // Job Context Required
    if (
      action.title !== "Resume Analysis" &&
      action.title !== "Career Suggestions" &&
      !currentJob?._id
    ) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please open a job details page first to use this feature.",
        },
      ]);

      return;
    }

    try {
      setLoading(true);

      const body = {};

      if (currentJob?._id) {
        body.jobId = currentJob._id;
      }

      const res = await api.post(action.endpoint, body);

      const content =
        res.data.analysis || res.data.questions || res.data.suggestions;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content,
        },
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error?.response?.data?.message || "AI request failed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 grid grid-cols-2 gap-4 border-b border-purple-200">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.title}
            onClick={() => handleAction(action)}
            className="bg-white/70 hover:bg-white transition-all duration-200 rounded-2xl p-4 shadow-md border border-purple-100 flex flex-col items-center gap-3 hover:scale-105"
          >
            <Icon className="text-purple-600 w-7 h-7" />

            <span className="font-semibold text-gray-700 text-sm text-center">
              {action.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AiQuickActions;
