import { createContext, useContext, useEffect, useState } from "react";

const AiAssistantContext = createContext(null);

export const AiAssistantProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentJob, setCurrentJob] = useState(null);

  const welcomeMessage = {
    role: "assistant",
    content:
      "Hi! I'm your AI Career Assistant. I can help with resume analysis, job matching, interview preparation, and career guidance.",
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("aiMessages"));

      return saved?.length ? saved : [welcomeMessage];
    } catch {
      return [welcomeMessage];
    }
  });

  const [minimized, setMinimized] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("aiMinimized")) || false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("aiMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("aiMinimized", JSON.stringify(minimized));
  }, [minimized]);

  const clearMessages = () => {
    setMessages([welcomeMessage]);
    localStorage.removeItem("aiMessages", JSON.stringify([welcomeMessage]));
  };

  return (
    <AiAssistantContext.Provider
      value={{
        open,
        setOpen,

        messages,
        setMessages,

        loading,
        setLoading,

        currentJob,
        setCurrentJob,

        minimized,
        setMinimized,

        clearMessages,

        welcomeMessage,
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
};

export const useAiAssistant = () => {
  return useContext(AiAssistantContext);
};
