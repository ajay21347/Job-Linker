import { useAiAssistant } from "@/context/AiAssistantContext";
import { Copy } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const AiChat = () => {
  const { messages, loading } = useAiAssistant();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const copyMessage = async (content) => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thumb-purple-300 scrollbar-track-transparent">
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
            className={`group max-w-[85%] px-5 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.02] ${
              msg.role === "user"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white self-end shadow-purple-300"
                : "bg-white/80 backdrop-blur-md border border-purple-100 text-gray-800 self-start"
            }`}
          >
            <p
              className="leading-7 whitespace-normal"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            {msg.role === "assistant" && (
              <button
                onClick={() => copyMessage(msg.content)}
                title="Copy response"
                className="opacity-0 group-hover:opacity-100 transition mt-3 text-purple-500 hover:text-purple-700"
              >
                <Copy size={14} />
              </button>
            )}
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
