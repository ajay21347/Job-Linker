import { useEffect, useRef } from "react";

const InterviewChat = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-[75%] px-5 py-4 rounded-3xl shadow-lg ${
            msg.role === "user"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white self-end"
              : "bg-white text-gray-800 self-start"
          } `}
        >
          <p className="leading-7 whitespace-pre-wrap">{msg.content}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default InterviewChat;
