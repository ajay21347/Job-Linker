import { useState } from "react";

import { useAiAssistant } from "@/context/AiAssistantContext";

import api from "@/utils/api";

import { Send } from "lucide-react";

const AiInput = () => {
  const [input, setInput] = useState("");

  const { setMessages, loading, setLoading } = useAiAssistant();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => {
      const updated = [...prev, userMessage];

      return updated.slice(-20);
    });

    setInput("");

    try {
      setLoading(true);

      const res = await api.post("/ai/chat", {
        message: input,
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t border-purple-200 bg-white/70 backdrop-blur-md">
      <div className="flex items-center gap-3 bg-white border border-purple-200 rounded-2xl px-3 py-2 shadow-md">
        <input
          type="text"
          placeholder="Ask AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AiInput;
