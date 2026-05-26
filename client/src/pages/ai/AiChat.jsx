import { useAiAssistant } from "@/context/AiAssistantContext";
import { useEffect, useRef } from "react";

const AiChat = () => {
  const { messages, loading } = useAiAssistant();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thumb-purple-300 scrollbar-track-transparent">
      {/* Empty State */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-xl animate-pulse mb-5">
            <span className="text-3xl">✨</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            AI Career Assistant
          </h2>

          <p className="text-gray-500 mt-3 max-w-xs leading-7">
            Ask AI anything about jobs, resumes, interviews, career growth, or
            ATS optimization.
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, index) => {
        const formattedContent = msg.content
          // Markdown bold
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          // Headings ending with :
          .replace(/^([A-Za-z\s]+:)/gm, "<strong>$1</strong>")

          // Bullet Points
          .replace(/^-\s(.*)$/gm, "• $1")

          // Line Breaks
          .replace(/\n/g, "<br/>");

        return (
          <div
            key={index}
            className={`max-w-[85%] px-5 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.02] ${
              msg.role === "user"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white self-end shadow-purple-300"
                : "bg-white/80 backdrop-blur-md border border-purple-100 text-gray-800 self-start"
            }`}
          >
            <p
              className="leading-7 whitespace-normal"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          </div>
        );
      })}

      {/* Typing Loader */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl px-5 py-4 shadow-lg self-start flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"></span>

          <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce delay-100"></span>

          <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce delay-200"></span>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default AiChat;
