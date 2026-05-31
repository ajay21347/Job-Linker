import { useState } from "react";

import { useAiAssistant } from "@/context/AiAssistantContext";

import api from "@/utils/api";

import { Send } from "lucide-react";
import { toast } from "sonner";

const AiInput = () => {
  const [input, setInput] = useState("");

  const { setMessages, loading, setLoading } = useAiAssistant();

  const handleSend = async () => {
    if (loading) return;

    const message = input.trim();

    if (!message) return;

    if (message.length > 1000) {
      toast.error("Message cannot exceed 1000 characters");
      return;
    }

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => {
      const updated = [...prev, userMessage];

      return updated.slice(-20);
    });

    setInput("");

    try {
      setLoading(true);

      const res = await api.post("/ai/chat", {
        message: message,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => {
        const updated = [...prev, aiMessage];

        return updated.slice(-20);
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Sorry, I couldn't process your request right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);

      if (!error.response) {
        toast.error("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-purple-200 bg-white/70 backdrop-blur-md">
      <div className="flex-1">
        <div className="flex items-center gap-3 bg-white border border-purple-200 rounded-2xl px-3 py-2 shadow-md">
          <input
            type="text"
            placeholder={loading ? "AI is thinking..." : "Ask AI anything..."}
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
          />
          <span
            className={`text-xs font-medium ${
              input.length > 950
                ? "text-red-500"
                : input.length > 800
                  ? "text-yellow-500"
                  : "text-gray-400"
            }`}
          >
            {input.length}/1000
          </span>
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInput;
