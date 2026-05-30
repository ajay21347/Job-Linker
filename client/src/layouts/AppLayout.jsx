import { RouterProvider } from "react-router-dom";
import { router } from "@/App";
import AiAssistantSidebar from "@/pages/ai/AiAssistantSidebar";
import { useAiAssistant } from "@/context/AiAssistantContext";

const AppLayout = () => {
  const { open } = useAiAssistant();

  return (
    <div className="flex overflow-hidden">
      {/* Main App */}
      <div
        className={`min-h-screen w-full transition-all duration-500 ease-in-out ${open ? "mr-[500px]" : "mr-0"}`}
      >
        <RouterProvider router={router} />
      </div>

      {/* Sidebar */}
      <AiAssistantSidebar />
    </div>
  );
};

export default AppLayout;
