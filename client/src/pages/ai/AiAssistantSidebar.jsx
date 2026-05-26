import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Sparkles, Minus, X, ChevronLeft } from "lucide-react";

import { useAiAssistant } from "@/context/AiAssistantContext";

import AiQuickActions from "./AiQuickActions";

import AiChat from "./AiChat";

import AiInput from "./AiInput";

const AiAssistantSidebar = () => {
  const { open, setOpen, minimized, setMinimized } = useAiAssistant();

  return (
    <>
      {/* =========================
          SIDEBAR
      ========================= */}

      <Sheet
        open={open && !minimized}
        modal={false}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            setMinimized(false);
          }
        }}
      >
        <SheetContent
          side="right"
          className="fixed inset-y-0 right-0 w-[460px] translate-x-0 p-0 bg-slate-50/95 backdrop-blur-xl border-l border-purple-200 shadow-2xl rounded-none"
        >
          <div className="h-full flex flex-col relative ">
            {/* Glow Effects */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            {/* Header */}
            <div className="relative z-10 p-6 border-b border-purple-200 bg-white/70 backdrop-blur-md flex justify-between items-center">
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-xl animate-pulse">
                  <Sparkles className="text-white w-7 h-7" />
                </div>

                <div>
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    AI Assistant
                  </SheetTitle>

                  <SheetDescription className="text-gray-600 text-sm">
                    Your AI Career Coach
                  </SheetDescription>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2">
                {/* Minimize */}
                <button
                  onClick={() => {
                    setMinimized(true);
                  }}
                  className="p-2 rounded-xl hover:bg-purple-100 transition-all duration-200 hover:scale-110"
                >
                  <Minus className="w-5 h-5 text-gray-700" />
                </button>

                {/* Close */}
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-red-100 transition-all duration-200 hover:scale-110"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="relative z-10">
              <AiQuickActions />
            </div>
            {/* Chat */}
            <div className="relative z-10 flex-1 overflow-y-auto">
              <AiChat />
            </div>
            {/* Input */}
            <div className="relative z-10">
              <AiInput />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AiAssistantSidebar;
