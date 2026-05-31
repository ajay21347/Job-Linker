import { Brain, Briefcase, Sparkles, Target, Trash2 } from "lucide-react";
import api from "@/utils/api";
import { useAiAssistant } from "@/context/AiAssistantContext";
import { toast } from "sonner";

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
  const { setMessages, setLoading, currentJob, loading, clearMessages } =
    useAiAssistant();

  const handleAction = async (action) => {
    if (loading) return;

    if (
      action.title !== "Resume Analysis" &&
      action.title !== "Career Suggestions" &&
      !currentJob?._id
    ) {
      toast.info("Please open a job details page first to use this feature.");
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
        res.data.analysis ||
        res.data.questions ||
        res.data.suggestions ||
        "No response received.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content,
        },
      ]);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Sorry, I couldn't process your request right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
        },
      ]);

      if (!error.response) {
        toast.error("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-purple-200">
      <div className="flex justify-end mb-3">
        <button
          disabled={loading}
          onClick={() => {
            clearMessages();
            toast.success("Chat cleared");
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              disabled={loading}
              onClick={() => handleAction(action)}
              className="bg-white/70 hover:bg-white transition-all duration-200 rounded-2xl p-4 shadow-md border border-purple-100 flex flex-col items-center gap-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Icon className="text-purple-600 w-7 h-7" />

              <span className="font-semibold text-gray-700 text-sm text-center">
                {loading ? "Generating..." : action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AiQuickActions;
