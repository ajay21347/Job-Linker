import { createContext, useContext, useState } from "react";

const AiAssistantContext = createContext(null);

export const AiAssistantProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [currentJob, setCurrentJob] = useState(null);

  const [minimized, setMinimized] = useState(false);

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
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
};

export const useAiAssistant = () => {
  return useContext(AiAssistantContext);
};
