import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { AiAssistantProvider } from "./context/AiAssistantContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AiAssistantProvider>
      <App />
      <Toaster richColors position="top-right" />
    </AiAssistantProvider>
  </StrictMode>,
);
